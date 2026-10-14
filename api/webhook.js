/**
 * Official Paystack Webhook Handler & Obeag S2S Notification Engine
 * POST /api/webhook
 * 
 * 1. Receives and verifies asynchronous event from Paystack using x-paystack-signature (HMAC SHA-512)
 * 2. When payment succeeds for Obeag, dispatches signed webhook to Obeag Backend:
 *    POST https://ohabuenyi.vercel.app/api/ocubyte/webhook
 *    Header: x-ocubyte-signature: <HMAC_SHA256_HEX(rawRequestBody, OCUBYTE_SECRET_KEY)>
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: true,
  },
};

/**
 * Dispatch webhook to Obeag with retry logic
 */
async function dispatchObeagWebhook(targetUrl, payloadObject, ocubyteSecret, maxRetries = 3) {
  const rawBody = JSON.stringify(payloadObject);
  const signature = crypto
    .createHmac('sha256', ocubyteSecret.trim())
    .update(rawBody)
    .digest('hex');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Ocubyte -> Obeag Webhook]: Dispatching attempt ${attempt}/${maxRetries} to ${targetUrl}`);
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ocubyte-signature': signature
        },
        body: rawBody
      });

      if (res.ok) {
        console.log(`[Ocubyte -> Obeag Webhook Success]: HTTP ${res.status} received from ${targetUrl}`);
        return true;
      } else {
        console.warn(`[Ocubyte -> Obeag Webhook Warning]: HTTP ${res.status} from ${targetUrl}`);
      }
    } catch (err) {
      console.error(`[Ocubyte -> Obeag Webhook Error] (Attempt ${attempt}):`, err.message);
    }

    // Wait before retry (exponential backoff: 1s, 2s...)
    if (attempt < maxRetries) {
      await new Promise(r => setTimeout(r, attempt * 1000));
    }
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const ocubyteSecret = process.env.OCUBYTE_SECRET_KEY || paystackSecret || 'ocubyte_production_signing_secret_2026';

  if (!paystackSecret) {
    console.warn('[Webhook Warning]: PAYSTACK_SECRET_KEY not set.');
    return res.status(200).json({ received: true, note: 'Paystack secret key not configured' });
  }

  const paystackSignature = req.headers['x-paystack-signature'];

  if (!paystackSignature) {
    return res.status(401).json({ error: 'Missing x-paystack-signature header' });
  }

  try {
    const rawPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const hash = crypto
      .createHmac('sha512', paystackSecret.trim())
      .update(rawPayload)
      .digest('hex');

    if (hash !== paystackSignature) {
      console.error('[Webhook Security Alert]: Invalid x-paystack-signature!');
      return res.status(401).json({ error: 'Invalid webhook signature.' });
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log(`[Paystack Webhook Received]: ${event.event} - Ref: ${event.data?.reference}`);

    if (event.event === 'charge.success') {
      const data = event.data;
      const metadata = data.metadata || {};
      const isObeag = metadata.app === 'obeag' || metadata.merchant_id === 'obeag_portal' || data.reference?.startsWith('OCUBYTE_');

      console.log(`[Payment Confirmed]: Reference: ${data.reference}, Amount: ${data.amount / 100} ${data.currency}`);

      // 1. Sync payment to Supabase backend database
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && serviceKey && !supabaseUrl.includes('your-supabase-project-id')) {
        try {
          const supabase = createClient(supabaseUrl, serviceKey);
          const merchantCode = metadata.merchant_id || metadata.merchant_code || (isObeag ? 'obeag_portal' : 'ocubyte_direct');

          await supabase.rpc('credit_merchant_payment', {
            p_merchant_code: merchantCode,
            p_reference: data.reference,
            p_amount: data.amount / 100,
            p_customer_email: data.customer?.email || metadata.customer_email || metadata.email || 'customer@example.com',
            p_customer_name: metadata.customer_name || metadata.name || '',
            p_purpose: metadata.purpose || 'PAYMENT',
            p_metadata: metadata,
            p_channel: (data.channel || 'card').toLowerCase()
          });
          console.log(`[Supabase Webhook Success]: Credited merchant ${merchantCode} for ref: ${data.reference}`);
        } catch (sbErr) {
          console.error('[Supabase Webhook Sync Warning]:', sbErr.message);
        }
      }

      // Section 6: Webhook Specification for Obeag
      if (isObeag) {
        const obeagTargetUrl = metadata.webhook_url || process.env.OBEAG_WEBHOOK_URL || 'https://ohabuenyi.vercel.app/api/ocubyte/webhook';
        
        let dueIds = [];
        if (metadata.due_ids) {
          dueIds = Array.isArray(metadata.due_ids) ? metadata.due_ids : String(metadata.due_ids).split(',').map(s => s.trim());
        } else if (metadata.dueIds) {
          dueIds = Array.isArray(metadata.dueIds) ? metadata.dueIds : [];
        }

        const obeagPayload = {
          event: 'payment.success',
          data: {
            reference: data.reference,
            amount: data.amount / 100, // NGN
            currency: data.currency || 'NGN',
            status: 'success',
            purpose: metadata.purpose || 'WALLET_FUNDING',
            userId: metadata.userId || metadata.user_id || '',
            dueIds: dueIds,
            paidAt: data.paid_at || new Date().toISOString(),
            channel: (data.channel || 'CARD').toUpperCase()
          }
        };

        // Asynchronously dispatch webhook to Obeag without blocking Paystack 200 response
        dispatchObeagWebhook(obeagTargetUrl, obeagPayload, ocubyteSecret).catch(err => {
          console.error('[Background Obeag Webhook Error]:', err);
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Webhook Processing Error]:', err);
    return res.status(500).json({ error: 'Internal server error processing webhook' });
  }
}
