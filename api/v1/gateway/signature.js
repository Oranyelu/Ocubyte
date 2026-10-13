/**
 * Ocubyte Payment Gateway - Signature Service
 * POST /api/v1/gateway/signature
 * 
 * Securely validates and generates HMAC SHA-256 signatures for Obeag contracts
 * without leaking OCUBYTE_SECRET_KEY to client-side browsers.
 */

import crypto from 'crypto';

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

  const { action, reference, amount, purpose, userId, email, status, signature } = req.body || {};
  const secretKey = process.env.OCUBYTE_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY || 'ocubyte_production_signing_secret_2026';

  // Action 1: Verify inbound signature from Obeag
  // Format: reference|amount|purpose|userId|email
  if (action === 'verify_inbound') {
    const rawString = `${reference}|${amount}|${purpose}|${userId || ''}|${email || ''}`;
    const computedSignature = crypto
      .createHmac('sha256', secretKey.trim())
      .update(rawString)
      .digest('hex');

    let isValid = false;
    if (signature) {
      try {
        const sigBuf = Buffer.from(signature.trim(), 'hex');
        const compBuf = Buffer.from(computedSignature, 'hex');
        if (sigBuf.length === compBuf.length) {
          isValid = crypto.timingSafeEqual(sigBuf, compBuf);
        }
      } catch (e) {
        isValid = (signature.trim().toLowerCase() === computedSignature.toLowerCase());
      }
    }

    return res.status(200).json({
      valid: isValid,
      reference,
      rawString,
      // For diagnostic transparency if testing in sandbox
      computed: !process.env.OCUBYTE_SECRET_KEY ? computedSignature : undefined
    });
  }

  // Action 2: Generate outbound return signature for callback_url
  // Format: reference|amount|status|purpose
  if (action === 'generate_callback') {
    const rawString = `${reference}|${amount}|${status || 'success'}|${purpose || 'WALLET_FUNDING'}`;
    const generatedSignature = crypto
      .createHmac('sha256', secretKey.trim())
      .update(rawString)
      .digest('hex');

    return res.status(200).json({
      signature: generatedSignature,
      reference,
      status: status || 'success',
      amount,
      purpose: purpose || 'WALLET_FUNDING'
    });
  }

  return res.status(400).json({ error: 'Invalid action. Supported: verify_inbound, generate_callback' });
}
