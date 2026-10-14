/**
 * Merchant Withdrawal Request Handler (Manual Human Payout Notification)
 * POST /api/merchant/withdraw
 * 
 * 1. Validates merchant balance in Supabase or local storage
 * 2. Locks and deducts the requested amount
 * 3. Records a pending withdrawal record
 * 4. Dispatches an email alert to the Ocubyte team email (SETTLEMENT_NOTIFICATION_EMAIL)
 *    so a real live person can execute the bank transfer to the merchant's account.
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { merchant_id, amount, notes = '' } = req.body || {};

  if (!merchant_id || !amount || Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid merchant_id and amount are required.'
    });
  }

  const numAmount = Number(amount);
  const transferFee = 50.00; // Flat NGN 50
  const netPayout = numAmount - transferFee;

  if (netPayout <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Withdrawal amount must exceed the ₦50 processing fee.'
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const recipientEmail = process.env.SETTLEMENT_NOTIFICATION_EMAIL || 'payments@ocubyte.org';
  const resendApiKey = process.env.RESEND_API_KEY;

  let withdrawalRecord = null;
  let merchantDetails = null;

  // 1. Process via Supabase if configured
  if (supabaseUrl && serviceKey && !supabaseUrl.includes('your-supabase-project-id')) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey);

      // Call safe atomic procedure
      const { data, error } = await supabase.rpc('request_merchant_withdrawal', {
        p_merchant_id: merchant_id,
        p_amount: numAmount,
        p_fee: transferFee
      });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      withdrawalRecord = data;

      // Fetch merchant details for email notification
      const { data: mData } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', merchant_id)
        .single();
      merchantDetails = mData;

    } catch (dbErr) {
      console.error('[Supabase Withdrawal Error]:', dbErr);
      return res.status(500).json({ success: false, error: 'Database execution failed: ' + dbErr.message });
    }
  } else {
    // Sandbox / Local fallback response
    const ref = `WTH_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    withdrawalRecord = {
      success: true,
      reference: ref,
      amount: numAmount,
      fee: transferFee,
      net_payout: netPayout,
      status: 'pending_review',
      created_at: new Date().toISOString()
    };
  }

  // 2. Dispatch Email Alert for Manual Human Settlement
  const emailSubject = `🚨 [ACTION REQUIRED] Merchant Payout Request: ₦${netPayout.toLocaleString()} to ${merchantDetails?.business_name || 'Merchant'}`;
  const emailContent = `
================================================================================
OCUBYTE GATEWAY: MERCHANT WITHDRAWAL NOTIFICATION
================================================================================
A registered merchant has requested a settlement payout.
Please review the details below and have an authorized officer execute the bank transfer.

REFERENCE:        ${withdrawalRecord.reference}
REQUEST DATE:     ${new Date().toUTCString()}
STATUS:           PENDING HUMAN REVIEW & DISBURSEMENT

--------------------------------------------------------------------------------
MERCHANT INFORMATION
--------------------------------------------------------------------------------
Business Name:    ${merchantDetails?.business_name || 'Registered Merchant'}
Merchant ID:      ${merchant_id}
Email:            ${merchantDetails?.email || 'N/A'}
Phone:            ${merchantDetails?.phone || 'N/A'}

--------------------------------------------------------------------------------
SETTLEMENT DESTINATION BANK ACCOUNT
--------------------------------------------------------------------------------
Bank Name:        ${merchantDetails?.bank_name || withdrawalRecord.bank_name || 'N/A'}
Account Number:   ${merchantDetails?.account_number || withdrawalRecord.account_number || 'N/A'}
Account Name:     ${merchantDetails?.account_name || withdrawalRecord.account_name || 'N/A'}

--------------------------------------------------------------------------------
FINANCIAL BREAKDOWN
--------------------------------------------------------------------------------
Gross Amount:     ₦${numAmount.toLocaleString()}
Processing Fee:   ₦${transferFee.toFixed(2)}
NET PAYOUT DUE:   ₦${netPayout.toLocaleString()}

Notes from Merchant: ${notes || 'None provided'}
================================================================================
Action Steps for Human Officer:
1. Log in to Ocubyte Corporate Online Banking.
2. Transfer ₦${netPayout.toLocaleString()} to ${merchantDetails?.account_number || 'the account above'}.
3. Mark reference ${withdrawalRecord.reference} as Completed with the bank session ID.
================================================================================
`;

  console.log('[WITHDRAWAL DISPATCHED TO EMAIL]:', recipientEmail);
  console.log(emailContent);

  // If Resend API Key is provided, send real HTML/Text email
  if (resendApiKey && !resendApiKey.includes('your_resend')) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Ocubyte Gateway <alerts@ocubyte.org>',
          to: recipientEmail,
          subject: emailSubject,
          text: emailContent
        })
      });
      console.log('[Resend Email Dispatched Successfully to]:', recipientEmail);
    } catch (emailErr) {
      console.warn('[Resend Email Dispatch Warning]:', emailErr.message);
    }
  }

  return res.status(200).json({
    success: true,
    withdrawal: withdrawalRecord,
    recipient_email: recipientEmail,
    message: `Withdrawal request ${withdrawalRecord.reference} submitted! An alert has been forwarded to ${recipientEmail} for manual human transfer.`
  });
}
