/**
 * Serverless Paystack Transaction Verification Endpoint
 * GET /api/verify?reference={reference}
 * POST /api/verify { reference: "..." }
 * 
 * Verifies transaction directly against Paystack using PAYSTACK_SECRET_KEY.
 * Never exposes the secret key to frontend clients.
 */

export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const reference = req.query?.reference || req.body?.reference;

  if (!reference) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter: reference'
    });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  // Fallback for local sandbox or missing secret key
  if (!secretKey) {
    // If testing in sandbox mode with a mock reference (e.g. SIM_ or TEST_)
    if (reference.startsWith('SIM_') || reference.startsWith('TEST_')) {
      return res.status(200).json({
        success: true,
        verified: true,
        status: 'success',
        reference,
        amount: 50000,
        currency: 'NGN',
        paid_at: new Date().toISOString(),
        channel: 'card',
        mode: 'sandbox_simulation',
        message: 'Sandbox transaction verified (Set PAYSTACK_SECRET_KEY in .env for live Paystack network validation).'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server configuration error: PAYSTACK_SECRET_KEY is not defined in environment variables.'
    });
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey.trim()}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await paystackRes.json();

    if (!paystackRes.ok || !data.status) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: data.message || 'Transaction verification failed at Paystack.'
      });
    }

    const tx = data.data;

    if (tx.status !== 'success') {
      return res.status(200).json({
        success: true,
        verified: false,
        status: tx.status,
        message: `Transaction is in '${tx.status}' state, not completed.`,
        reference: tx.reference,
        amount: tx.amount / 100,
        currency: tx.currency
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      status: 'success',
      reference: tx.reference,
      amount: tx.amount / 100,
      currency: tx.currency,
      customer: {
        email: tx.customer?.email,
        customer_code: tx.customer?.customer_code
      },
      paid_at: tx.paid_at,
      channel: tx.channel,
      gateway_response: tx.gateway_response,
      metadata: tx.metadata || {}
    });

  } catch (error) {
    console.error('[Paystack Verification Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while contacting Paystack verification servers: ' + error.message
    });
  }
}
