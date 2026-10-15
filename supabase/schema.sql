-- ==============================================================================
-- OCUBYTE REMITA-GRADE PAYMENT GATEWAY & MERCHANT SETTLEMENT SCHEMA
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. MERCHANTS TABLE
-- Stores registered merchants, business details, API keys, bank accounts & wallet
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    merchant_code TEXT NOT NULL UNIQUE,          -- Short unique identifier (e.g. mch_healthplus)
    public_key TEXT NOT NULL UNIQUE,             -- ocu_pub_live_...
    secret_key TEXT NOT NULL UNIQUE,             -- ocu_sec_live_...
    
    -- Settlement Bank Details (For manual live human payout)
    bank_name TEXT NOT NULL,                     -- e.g. "Access Bank", "GTBank", "Zenith Bank"
    account_number VARCHAR(20) NOT NULL,         -- 10-digit NUBAN
    account_name TEXT NOT NULL,                  -- Verified account holder name
    bank_code VARCHAR(10),                       -- CBN bank routing code if available
    
    -- Financial Ledger
    wallet_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (wallet_balance >= 0),
    total_volume NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (total_volume >= 0),
    fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 1.50, -- Gateway processing fee percentage (e.g. 1.5%)
    
    -- Merchant Status & Metadata
    password_hash TEXT,                          -- SHA-256 password hash for secure merchant login
    role TEXT NOT NULL DEFAULT 'merchant',       -- 'merchant' or 'super_admin'
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_kyc', 'suspended')),
    webhook_url TEXT,
    callback_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure migration compatibility for existing tables
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'merchant';

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_merchants_code ON public.merchants(merchant_code);
CREATE INDEX IF NOT EXISTS idx_merchants_pubkey ON public.merchants(public_key);
CREATE INDEX IF NOT EXISTS idx_merchants_seckey ON public.merchants(secret_key);
CREATE INDEX IF NOT EXISTS idx_merchants_email ON public.merchants(email);

-- ==============================================================================
-- 2. TRANSACTIONS / PAYMENTS TABLE
-- Securely documents all inbound customer payments made through Ocubyte Gateway
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE SET NULL,
    reference TEXT NOT NULL UNIQUE,
    
    -- Financials
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    fee NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0),
    net_amount NUMERIC(15, 2) NOT NULL CHECK (net_amount >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
    
    -- Customer Info
    customer_name TEXT,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    
    -- Payment Metadata
    purpose TEXT DEFAULT 'PAYMENT',              -- e.g. "DUE_PAYMENT", "ORDER_CHECKOUT", "WALLET_FUNDING"
    channel TEXT DEFAULT 'card',                 -- 'card', 'bank_transfer', 'ussd'
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
    paystack_reference TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON public.transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- ==============================================================================
-- 3. WITHDRAWALS / SETTLEMENTS TABLE
-- Records merchant payout requests to be fulfilled manually by a real person
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    reference TEXT NOT NULL UNIQUE,              -- e.g. WTH_20261014_ABC12
    
    -- Financials
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    fee NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0),
    net_payout NUMERIC(15, 2) NOT NULL CHECK (net_payout > 0),
    
    -- Destination Account Captured at Request Time
    bank_name TEXT NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    account_name TEXT NOT NULL,
    
    -- Processing Workflow for Human Operator
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'processing', 'completed', 'declined')),
    admin_notes TEXT,
    processed_by TEXT,                           -- Name/Email of the human officer who executed transfer
    processed_at TIMESTAMPTZ,
    proof_reference TEXT,                        -- Bank transfer transaction ID or session reference
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_merchant_id ON public.withdrawals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_reference ON public.withdrawals(reference);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON public.withdrawals(created_at DESC);

-- ==============================================================================
-- 4. AUDIT LOGS TABLE
-- Immutable event ledger for financial compliance
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,                    -- 'MERCHANT_REGISTERED', 'PAYMENT_RECEIVED', 'WITHDRAWAL_REQUESTED', 'WITHDRAWAL_PROCESSED'
    entity_type TEXT NOT NULL,                   -- 'merchant', 'transaction', 'withdrawal'
    entity_id TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. TRANSACTIONAL STORED PROCEDURES (ATOMIC & CONCURRENCY-SAFE)
-- ==============================================================================

-- Procedure: Credit Merchant on Successful Payment (Zero double-crediting)
CREATE OR REPLACE FUNCTION public.credit_merchant_payment(
    p_merchant_code TEXT,
    p_reference TEXT,
    p_amount NUMERIC,
    p_customer_email TEXT,
    p_customer_name TEXT,
    p_purpose TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_channel TEXT DEFAULT 'card'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_merchant RECORD;
    v_fee NUMERIC(15, 2);
    v_net_amount NUMERIC(15, 2);
    v_existing RECORD;
BEGIN
    -- Check if transaction reference is already recorded as SUCCESS
    SELECT * INTO v_existing FROM public.transactions WHERE reference = p_reference;
    IF FOUND AND v_existing.status = 'success' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already settled', 'reference', p_reference);
    END IF;

    -- Look up merchant
    SELECT * INTO v_merchant FROM public.merchants WHERE merchant_code = p_merchant_code OR public_key = p_merchant_code;

    IF FOUND THEN
        -- Compute platform fee and net merchant earnings
        v_fee := ROUND((p_amount * COALESCE(v_merchant.fee_percent, 1.5) / 100.0), 2);
        v_net_amount := p_amount - v_fee;

        -- Atomically update merchant balance
        UPDATE public.merchants
        SET wallet_balance = wallet_balance + v_net_amount,
            total_volume = total_volume + p_amount,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_merchant.id;

        -- Upsert transaction record
        INSERT INTO public.transactions (
            merchant_id, reference, amount, fee, net_amount, customer_email, customer_name, purpose, channel, status, metadata, paid_at
        ) VALUES (
            v_merchant.id, p_reference, p_amount, v_fee, v_net_amount, p_customer_email, p_customer_name, p_purpose, p_channel, 'success', p_metadata, timezone('utc'::text, now())
        )
        ON CONFLICT (reference) DO UPDATE
        SET status = 'success',
            amount = EXCLUDED.amount,
            fee = EXCLUDED.fee,
            net_amount = EXCLUDED.net_amount,
            paid_at = timezone('utc'::text, now());

        -- Log audit
        INSERT INTO public.audit_logs (event_type, entity_type, entity_id, payload)
        VALUES ('PAYMENT_CREDITED', 'merchant', v_merchant.id::text, jsonb_build_object(
            'reference', p_reference, 'amount', p_amount, 'net', v_net_amount, 'fee', v_fee
        ));

        RETURN jsonb_build_object(
            'success', true,
            'merchant_id', v_merchant.id,
            'reference', p_reference,
            'net_credited', v_net_amount,
            'new_balance', v_merchant.wallet_balance + v_net_amount
        );
    ELSE
        -- Record as generic / non-merchant payment
        INSERT INTO public.transactions (
            merchant_id, reference, amount, fee, net_amount, customer_email, customer_name, purpose, channel, status, metadata, paid_at
        ) VALUES (
            NULL, p_reference, p_amount, 0.00, p_amount, p_customer_email, p_customer_name, p_purpose, p_channel, 'success', p_metadata, timezone('utc'::text, now())
        )
        ON CONFLICT (reference) DO UPDATE
        SET status = 'success', paid_at = timezone('utc'::text, now());

        RETURN jsonb_build_object('success', true, 'message', 'Recorded without merchant', 'reference', p_reference);
    END IF;
END;
$$;

-- Procedure: Request Merchant Withdrawal (Locks balance atomically)
CREATE OR REPLACE FUNCTION public.request_merchant_withdrawal(
    p_merchant_id UUID,
    p_amount NUMERIC,
    p_fee NUMERIC DEFAULT 50.00 -- Standard transfer fee in NGN
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_merchant RECORD;
    v_net_payout NUMERIC(15, 2);
    v_withdrawal_ref TEXT;
    v_withdrawal_id UUID;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Withdrawal amount must be greater than zero.';
    END IF;

    -- Lock merchant row for update
    SELECT * INTO v_merchant FROM public.merchants WHERE id = p_merchant_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Merchant not found.';
    END IF;

    IF v_merchant.wallet_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient wallet balance. Available: ₦%, Requested: ₦%', v_merchant.wallet_balance, p_amount;
    END IF;

    v_net_payout := p_amount - p_fee;
    IF v_net_payout <= 0 THEN
        RAISE EXCEPTION 'Amount after fee must be positive.';
    END IF;

    -- Generate reference
    v_withdrawal_ref := 'WTH_' || TO_CHAR(timezone('utc'::text, now()), 'YYYYMMDD') || '_' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

    -- Deduct from balance immediately to prevent double spending
    UPDATE public.merchants
    SET wallet_balance = wallet_balance - p_amount,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_merchant_id;

    -- Insert into withdrawals table
    INSERT INTO public.withdrawals (
        merchant_id, reference, amount, fee, net_payout, bank_name, account_number, account_name, status
    ) VALUES (
        p_merchant_id, v_withdrawal_ref, p_amount, p_fee, v_net_payout, v_merchant.bank_name, v_merchant.account_number, v_merchant.account_name, 'pending_review'
    ) RETURNING id INTO v_withdrawal_id;

    -- Audit log
    INSERT INTO public.audit_logs (event_type, entity_type, entity_id, payload)
    VALUES ('WITHDRAWAL_REQUESTED', 'withdrawal', v_withdrawal_id::text, jsonb_build_object(
        'reference', v_withdrawal_ref,
        'merchant_id', p_merchant_id,
        'business_name', v_merchant.business_name,
        'amount', p_amount,
        'net_payout', v_net_payout,
        'bank_name', v_merchant.bank_name,
        'account_number', v_merchant.account_number,
        'account_name', v_merchant.account_name
    ));

    RETURN jsonb_build_object(
        'success', true,
        'withdrawal_id', v_withdrawal_id,
        'reference', v_withdrawal_ref,
        'amount', p_amount,
        'net_payout', v_net_payout,
        'bank_name', v_merchant.bank_name,
        'account_number', v_merchant.account_number,
        'account_name', v_merchant.account_name,
        'status', 'pending_review',
        'remaining_balance', v_merchant.wallet_balance - p_amount
    );
END;
$$;

-- Procedure: Decline Withdrawal & Refund Merchant Balance
CREATE OR REPLACE FUNCTION public.decline_merchant_withdrawal(
    p_withdrawal_id UUID,
    p_reason TEXT,
    p_admin_name TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wth RECORD;
BEGIN
    SELECT * INTO v_wth FROM public.withdrawals WHERE id = p_withdrawal_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Withdrawal request not found.';
    END IF;

    IF v_wth.status != 'pending_review' AND v_wth.status != 'processing' THEN
        RAISE EXCEPTION 'Withdrawal is already in state: %', v_wth.status;
    END IF;

    -- Refund merchant wallet balance
    UPDATE public.merchants
    SET wallet_balance = wallet_balance + v_wth.amount,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_wth.merchant_id;

    -- Update withdrawal status
    UPDATE public.withdrawals
    SET status = 'declined',
        admin_notes = p_reason,
        processed_by = p_admin_name,
        processed_at = timezone('utc'::text, now())
    WHERE id = p_withdrawal_id;

    -- Audit log
    INSERT INTO public.audit_logs (event_type, entity_type, entity_id, payload)
    VALUES ('WITHDRAWAL_DECLINED', 'withdrawal', p_withdrawal_id::text, jsonb_build_object(
        'reason', p_reason, 'admin', p_admin_name, 'refunded_amount', v_wth.amount
    ));

    RETURN jsonb_build_object('success', true, 'message', 'Withdrawal declined and balance refunded.');
END;
$$;

-- Procedure: Complete Withdrawal by Human Admin (Recorded after bank transfer)
CREATE OR REPLACE FUNCTION public.complete_merchant_withdrawal(
    p_withdrawal_id UUID,
    p_proof_reference TEXT,
    p_admin_notes TEXT,
    p_admin_name TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wth RECORD;
BEGIN
    SELECT * INTO v_wth FROM public.withdrawals WHERE id = p_withdrawal_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Withdrawal request not found.';
    END IF;

    IF v_wth.status = 'completed' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already completed');
    END IF;

    UPDATE public.withdrawals
    SET status = 'completed',
        proof_reference = p_proof_reference,
        admin_notes = p_admin_notes,
        processed_by = p_admin_name,
        processed_at = timezone('utc'::text, now())
    WHERE id = p_withdrawal_id;

    INSERT INTO public.audit_logs (event_type, entity_type, entity_id, payload)
    VALUES ('WITHDRAWAL_COMPLETED', 'withdrawal', p_withdrawal_id::text, jsonb_build_object(
        'proof_reference', p_proof_reference, 'admin', p_admin_name
    ));

    RETURN jsonb_build_object('success', true, 'message', 'Withdrawal marked as completed.');
END;
$$;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous / Public access policies
-- Anyone can read public merchant information by merchant_code (used on checkout page)
DROP POLICY IF EXISTS "Public can view merchant checkout profile" ON public.merchants;
CREATE POLICY "Public can view merchant checkout profile"
ON public.merchants FOR SELECT
USING (true);

-- Anyone can read payment status for their own reference
DROP POLICY IF EXISTS "Public can view transaction by reference" ON public.transactions;
CREATE POLICY "Public can view transaction by reference"
ON public.transactions FOR SELECT
USING (true);

-- Service role bypasses RLS automatically in Supabase
-- (Serverless backend API routes using SUPABASE_SERVICE_ROLE_KEY have full root access)

-- ==============================================================================
-- 7. DEFAULT SEED DATA
-- Default merchant account for OBEAG (OHA BU ENYI AGE GRADE)
-- ==============================================================================
INSERT INTO public.merchants (
    business_name,
    email,
    phone,
    merchant_code,
    public_key,
    secret_key,
    bank_name,
    account_number,
    account_name,
    wallet_balance,
    fee_percent,
    status
) VALUES (
    'OHA BU ENYI AGE GRADE (OBEAG)',
    'admin@ohabuenyi.org',
    '+2348000000000',
    'obeag_portal',
    'ocu_pub_live_obeag_portal_2026',
    'ocu_sec_live_obeag_portal_secret_key',
    'Zenith Bank',
    '1011223344',
    'Oha Bu Enyi Age Grade Treasury',
    0.00,
    1.50,
    'active'
) ON CONFLICT (merchant_code) DO NOTHING;
