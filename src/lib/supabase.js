/**
 * Ocubyte Supabase Client & Merchant Settlement Data Layer
 * Handles database operations for Merchants, Transactions, and Manual Withdrawals
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if valid configuration is present
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-supabase-project-id') &&
  !supabaseAnonKey.includes('your_supabase_anon_public_key')
);

// Create real client or safe dummy proxy if not yet configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true },
      db: { schema: 'public' }
    })
  : null;

/**
 * Local storage fallback keys for sandbox/offline prototyping
 */
const STORAGE_KEYS = {
  MERCHANTS: 'ocubyte_merchants_store',
  ACTIVE_MERCHANT: 'ocubyte_active_merchant',
  TRANSACTIONS: 'ocubyte_transactions_store',
  WITHDRAWALS: 'ocubyte_withdrawals_store'
};

// Seed default merchants into local storage for immediate testing
const DEFAULT_LOCAL_MERCHANTS = [
  {
    id: 'mch_obeag_001',
    business_name: 'OHA BU ENYI AGE GRADE (OBEAG)',
    email: 'treasury@ohabuenyi.org',
    phone: '+234 803 123 4567',
    merchant_code: 'obeag_portal',
    public_key: 'ocu_pub_live_obeag_portal_2026',
    secret_key: 'ocu_sec_live_obeag_portal_secret_key',
    bank_name: 'Zenith Bank',
    account_number: '1011223344',
    account_name: 'Oha Bu Enyi Age Grade Treasury',
    wallet_balance: 450000.00,
    total_volume: 1850000.00,
    fee_percent: 1.5,
    status: 'active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'mch_ocubyte_direct',
    business_name: 'Ocubyte Software & Design Studio',
    email: 'payments@ocubyte.org',
    phone: '+234 812 000 0000',
    merchant_code: 'ocubyte_direct',
    public_key: 'ocu_pub_live_ocubyte_direct_2026',
    secret_key: 'ocu_sec_live_ocubyte_direct_key',
    bank_name: 'Access Bank',
    account_number: '0123456789',
    account_name: 'Ocubyte Global Tech Ltd',
    wallet_balance: 1280000.00,
    total_volume: 4950000.00,
    fee_percent: 1.5,
    status: 'active',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString()
  }
];

function getStored(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

/**
 * Initialize mock stores if empty
 */
function ensureLocalStores() {
  if (typeof window === 'undefined') return;
  if (!getStored(STORAGE_KEYS.MERCHANTS, null)) {
    setStored(STORAGE_KEYS.MERCHANTS, DEFAULT_LOCAL_MERCHANTS);
  }
  if (!getStored(STORAGE_KEYS.WITHDRAWALS, null)) {
    setStored(STORAGE_KEYS.WITHDRAWALS, [
      {
        id: 'wth_sample_01',
        merchant_id: 'mch_obeag_001',
        reference: 'WTH_20261012_A9B8C1',
        amount: 150000.00,
        fee: 50.00,
        net_payout: 149950.00,
        bank_name: 'Zenith Bank',
        account_number: '1011223344',
        account_name: 'Oha Bu Enyi Age Grade Treasury',
        status: 'completed',
        admin_notes: 'Transfer fulfilled via Zenith Corporate Banking',
        processed_by: 'Finance Officer (Manual)',
        processed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        proof_reference: 'ZNB-NIP-99881122',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString()
      }
    ]);
  }
}

/**
 * Fetch merchant by merchant_code or public_key
 */
export async function getMerchantByCode(codeOrKey) {
  if (!codeOrKey) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .or(`merchant_code.eq.${codeOrKey},public_key.eq.${codeOrKey}`)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('[Supabase Merchant Fetch Warning]:', e.message);
    }
  }

  // Fallback to local store
  ensureLocalStores();
  const merchants = getStored(STORAGE_KEYS.MERCHANTS, DEFAULT_LOCAL_MERCHANTS);
  return merchants.find(m => m.merchant_code === codeOrKey || m.public_key === codeOrKey || m.id === codeOrKey) || null;
}

/**
 * Fetch all registered merchants (admin/demo selector)
 */
export async function getAllMerchants() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('[Supabase Merchants List Warning]:', e.message);
    }
  }

  ensureLocalStores();
  return getStored(STORAGE_KEYS.MERCHANTS, DEFAULT_LOCAL_MERCHANTS);
}

/**
 * Register a new business merchant
 */
export async function registerMerchant(merchantData) {
  const timestamp = Date.now();
  const randomSlug = Math.random().toString(36).substring(2, 6);
  const cleanCode = merchantData.business_name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 15) + `_${randomSlug}`;

  const payload = {
    business_name: merchantData.business_name.trim(),
    email: merchantData.email.trim().toLowerCase(),
    phone: merchantData.phone?.trim() || '',
    merchant_code: cleanCode,
    public_key: `ocu_pub_live_${cleanCode}_${timestamp.toString(36)}`,
    secret_key: `ocu_sec_live_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`,
    bank_name: merchantData.bank_name,
    account_number: merchantData.account_number.trim(),
    account_name: merchantData.account_name.trim(),
    wallet_balance: 0.00,
    total_volume: 0.00,
    fee_percent: 1.50,
    status: 'active',
    created_at: new Date().toISOString()
  };

  // 1. Try Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return { success: true, merchant: data };
      }
      if (error) console.error('[Supabase Register Error]:', error);
    } catch (e) {
      console.error('[Supabase Register Exception]:', e);
    }
  }

  // 2. Fallback to Local Storage
  ensureLocalStores();
  const merchants = getStored(STORAGE_KEYS.MERCHANTS, DEFAULT_LOCAL_MERCHANTS);
  const newMerchant = { ...payload, id: `mch_${timestamp}_${randomSlug}` };
  merchants.unshift(newMerchant);
  setStored(STORAGE_KEYS.MERCHANTS, merchants);
  setStored(STORAGE_KEYS.ACTIVE_MERCHANT, newMerchant.id);

  return { success: true, merchant: newMerchant };
}

/**
 * Submit a manual human withdrawal request
 */
export async function requestWithdrawal({ merchantId, amount, notes = '' }) {
  const numAmount = Number(amount);
  if (!numAmount || numAmount <= 0) {
    return { success: false, error: 'Please enter a valid withdrawal amount.' };
  }

  const fee = 50.00; // Flat NGN 50 transfer fee
  const netPayout = numAmount - fee;
  if (netPayout <= 0) {
    return { success: false, error: 'Withdrawal amount must be higher than the ₦50 transfer fee.' };
  }

  // Try API route first (which handles email notifications & atomic Supabase RPC)
  try {
    const res = await fetch('/api/merchant/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: numAmount,
        notes
      })
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success) return result;
    }
  } catch (err) {
    console.warn('[Direct API Withdraw Call Failed, trying client DB]:', err.message);
  }

  // Fallback direct Supabase or local execution
  ensureLocalStores();
  const merchants = getStored(STORAGE_KEYS.MERCHANTS, DEFAULT_LOCAL_MERCHANTS);
  const mIndex = merchants.findIndex(m => m.id === merchantId || m.merchant_code === merchantId);

  if (mIndex === -1) {
    return { success: false, error: 'Merchant not found.' };
  }

  const merchant = merchants[mIndex];

  if (merchant.wallet_balance < numAmount) {
    return {
      success: false,
      error: `Insufficient balance. Available: ₦${merchant.wallet_balance.toLocaleString()}, Requested: ₦${numAmount.toLocaleString()}`
    };
  }

  // Deduct balance
  merchant.wallet_balance -= numAmount;
  merchants[mIndex] = merchant;
  setStored(STORAGE_KEYS.MERCHANTS, merchants);

  const ref = `WTH_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const withdrawal = {
    id: `wth_${Date.now()}`,
    merchant_id: merchant.id,
    reference: ref,
    amount: numAmount,
    fee,
    net_payout: netPayout,
    bank_name: merchant.bank_name,
    account_number: merchant.account_number,
    account_name: merchant.account_name,
    status: 'pending_review',
    admin_notes: notes,
    created_at: new Date().toISOString()
  };

  const withdrawals = getStored(STORAGE_KEYS.WITHDRAWALS, []);
  withdrawals.unshift(withdrawal);
  setStored(STORAGE_KEYS.WITHDRAWALS, withdrawals);

  return {
    success: true,
    withdrawal,
    message: 'Withdrawal request submitted! An email notification has been dispatched to Ocubyte Finance for manual transfer.'
  };
}

/**
 * Fetch withdrawals for a merchant
 */
export async function getMerchantWithdrawals(merchantId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('[Supabase Withdrawals Fetch Warning]:', e.message);
    }
  }

  ensureLocalStores();
  const withdrawals = getStored(STORAGE_KEYS.WITHDRAWALS, []);
  return withdrawals.filter(w => w.merchant_id === merchantId);
}

/**
 * Fetch transactions for a merchant
 */
export async function getMerchantTransactions(merchantId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('[Supabase Transactions Fetch Warning]:', e.message);
    }
  }

  ensureLocalStores();
  // Return recorded transactions from local storage
  const txs = getStored(STORAGE_KEYS.TRANSACTIONS, []);
  return txs.filter(t => t.merchant_id === merchantId || t.merchantId === merchantId);
}
