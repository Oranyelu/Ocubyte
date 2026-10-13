/**
 * Paystack Integration Utility for Ocubyte & Ocubyte Payment Gateway
 * Supports direct in-app payments and third-party affiliated gateway checkouts.
 */

const DEFAULT_TEST_KEY = 'pk_test_30f40ad60a0a5db253457a16f21287957e8ceab2';
const STORAGE_KEY_PK = 'ocubyte_paystack_public_key';
const STORAGE_KEY_TXS = 'ocubyte_gateway_transactions';

/**
 * Get active Paystack public key
 */
export const getPaystackPublicKey = () => {
  if (typeof window === 'undefined') return DEFAULT_TEST_KEY;
  const envKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const stored = localStorage.getItem(STORAGE_KEY_PK);

  if (stored && stored.trim().length > 5) {
    if (envKey && envKey.startsWith('pk_live') && stored.startsWith('pk_test')) {
      localStorage.removeItem(STORAGE_KEY_PK);
      return envKey.trim();
    }
    return stored.trim();
  }

  if (envKey && envKey.trim().length > 5) {
    return envKey.trim();
  }

  return DEFAULT_TEST_KEY;
};

/**
 * Set custom Paystack public key (for testing or live merchant override)
 */
export const setPaystackPublicKey = (key) => {
  if (typeof window === 'undefined') return;
  if (!key) {
    localStorage.removeItem(STORAGE_KEY_PK);
  } else {
    localStorage.setItem(STORAGE_KEY_PK, key.trim());
  }
};

/**
 * Reset Paystack public key to default
 */
export const resetPaystackPublicKey = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_PK);
};

/**
 * Dynamically load Paystack Inline JS script
 */
export const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve(false);

    if (window.PaystackPop) {
      return resolve(true);
    }

    const existingScript = document.getElementById('paystack-inline-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-inline-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = (err) => reject(new Error('Failed to load Paystack inline script: ' + err));

    document.head.appendChild(script);
  });
};

/**
 * Generate a unique transaction reference
 */
export const generateReference = (prefix = 'OCU') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'NGN') => {
  const num = Number(amount) || 0;
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  }
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num);
};

/**
 * Create a simple security signature / verification token for third-party callback
 */
export const generateVerificationSignature = (reference, amount, merchantId) => {
  const salt = 'ocubyte_secure_gw_2026';
  const str = `${reference}:${amount}:${merchantId}:${salt}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'ocu_sig_' + Math.abs(hash).toString(16) + '_' + Date.now().toString(36);
};

/**
 * Initialize Paystack Payment Modal
 * @param {Object} options
 * @param {string} options.email - Customer email
 * @param {number} options.amount - Amount in standard currency (e.g. 5000 for ₦5,000)
 * @param {string} [options.currency='NGN'] - Currency code
 * @param {string} [options.reference] - Optional unique reference
 * @param {string} [options.customerName] - Optional customer full name
 * @param {string} [options.merchantId] - Optional merchant identifier
 * @param {string} [options.merchantName] - Optional merchant business name
 * @param {Object} [options.metadata] - Extra metadata passed to Paystack
 * @param {Function} options.onSuccess - Callback on successful payment
 * @param {Function} [options.onCancel] - Callback on payment modal close/cancel
 * @param {Function} [options.onError] - Callback on payment error
 */
export const initializePaystackPayment = async ({
  email,
  amount,
  currency = 'NGN',
  reference,
  customerName = '',
  merchantId = 'ocubyte_direct',
  merchantName = 'Ocubyte Studio',
  metadata = {},
  onSuccess = () => {},
  onCancel = () => {},
  onError = () => {}
}) => {
  try {
    const publicKey = getPaystackPublicKey();
    const cleanRef = reference || generateReference(merchantId === 'ocubyte_direct' ? 'OCU' : 'GW');
    const amountInKobo = Math.round(Number(amount) * 100);

    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid customer email address.');
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error('Please enter a valid payment amount.');
    }

    // Try loading Paystack script
    await loadPaystackScript();

    if (!window.PaystackPop) {
      throw new Error('Paystack SDK could not be loaded. Check your internet connection.');
    }

    const mergedMetadata = {
      ...metadata,
      customer_name: customerName,
      merchant_id: merchantId,
      merchant_name: merchantName,
      platform: 'Ocubyte Gateway',
      custom_fields: [
        {
          display_name: 'Merchant',
          variable_name: 'merchant_name',
          value: merchantName
        },
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: customerName || 'Valued Customer'
        },
        ...(metadata.custom_fields || [])
      ]
    };

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: email,
      amount: amountInKobo,
      currency: currency,
      ref: cleanRef,
      metadata: mergedMetadata,
      callback: (response) => {
        // response: { reference, status, trxref, trans, transaction, message }
        const txRecord = {
          reference: response.reference || cleanRef,
          trxref: response.trxref || response.reference || cleanRef,
          status: 'success',
          amount: Number(amount),
          currency,
          customerEmail: email,
          customerName,
          merchantId,
          merchantName,
          timestamp: new Date().toISOString(),
          signature: generateVerificationSignature(cleanRef, amount, merchantId),
          rawResponse: response
        };

        // Record locally for gateway history & receipts
        recordTransaction(txRecord);

        if (typeof onSuccess === 'function') {
          onSuccess(txRecord);
        }
      },
      onClose: () => {
        if (typeof onCancel === 'function') {
          onCancel();
        }
      }
    });

    handler.openIframe();
  } catch (error) {
    console.error('[Paystack Init Error]:', error);
    if (typeof onError === 'function') {
      onError(error);
    } else {
      alert(error.message || 'Failed to initialize payment.');
    }
  }
};

/**
 * Record a transaction locally for receipts & merchant history
 */
export const recordTransaction = (transaction) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    const list = raw ? JSON.parse(raw) : [];
    // Prepend new transaction, keep max 50
    const updated = [transaction, ...list.filter(t => t.reference !== transaction.reference)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to store transaction record:', err);
  }
};

/**
 * Retrieve all locally recorded transactions
 */
export const getRecordedTransactions = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Retrieve single transaction by reference
 */
export const getTransactionByRef = (ref) => {
  const all = getRecordedTransactions();
  return all.find(t => t.reference === ref || t.trxref === ref);
};

/**
 * Simulation mode for testing offline or mock sandbox payments
 */
export const simulatePaymentSuccess = ({
  email,
  amount,
  currency = 'NGN',
  reference,
  customerName = '',
  merchantId = 'simulated_merchant',
  merchantName = 'Demo Merchant'
}) => {
  const cleanRef = reference || generateReference('SIM');
  const txRecord = {
    reference: cleanRef,
    trxref: cleanRef,
    status: 'success',
    amount: Number(amount),
    currency,
    customerEmail: email,
    customerName,
    merchantId,
    merchantName,
    timestamp: new Date().toISOString(),
    signature: generateVerificationSignature(cleanRef, amount, merchantId),
    simulated: true
  };
  recordTransaction(txRecord);
  return txRecord;
};

/**
 * Verify transaction via serverless backend API (/api/verify)
 */
export const verifyTransactionOnServer = async (reference) => {
  try {
    const res = await fetch(`/api/verify?reference=${encodeURIComponent(reference)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Server verification failed' };
    }
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Verify third-party affiliate transaction via backend API (/api/gateway-verify)
 */
export const verifyGatewayTransaction = async (reference, merchantId) => {
  try {
    const res = await fetch(`/api/gateway-verify?reference=${encodeURIComponent(reference)}&merchant_id=${encodeURIComponent(merchantId || '')}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Gateway verification failed' };
    }
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};
