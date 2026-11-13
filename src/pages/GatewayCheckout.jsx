import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { 
  initializePaystackPayment, 
  simulatePaymentSuccess, 
  formatCurrency, 
  generateReference
} from '../utils/paystack';
import PaymentReceipt from '../components/PaymentReceipt';

const GatewayCheckout = () => {
  const [searchParams] = useSearchParams();

  // Extract third-party affiliate gateway query parameters
  const appSlug = searchParams.get('app') || '';
  const merchantId = searchParams.get('merchant_id') || (appSlug === 'obeag' ? 'obeag_portal' : appSlug) || '';
  const merchantName = searchParams.get('merchant_name') || (appSlug === 'obeag' ? 'OHA BU ENYI AGE GRADE (OBEAG)' : 'Affiliated Partner');
  const rawAmount = searchParams.get('amount') || '';
  const currency = (searchParams.get('currency') || 'NGN').toUpperCase();
  const reference = searchParams.get('reference') || '';
  const purpose = searchParams.get('purpose') || '';
  const title = searchParams.get('title') || (purpose === 'DUE_PAYMENT' ? 'Annual Dues & Levies Settlement' : (purpose === 'WALLET_FUNDING' ? 'Digital Wallet Funding' : 'Order Checkout'));
  const description = searchParams.get('description') || 'Payment for goods or services';
  const callbackUrl = searchParams.get('callback_url') || '';
  
  // Customer details (prefilled or editable)
  const [customerEmail] = useState(searchParams.get('email') || searchParams.get('customer_email') || '');
  const [customerName, setCustomerName] = useState(searchParams.get('name') || searchParams.get('customer_name') || '');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);

  // Validate parameters
  const amount = Number(rawAmount);
  const hasValidParams = (merchantId || appSlug) && !isNaN(amount) && amount > 0;

  // Build the complete return URL with verification payload for the third-party website
  const buildReturnUrl = (tx) => {
    if (!callbackUrl) return null;
    const url = new URL(callbackUrl, window.location.origin);
    url.searchParams.set('status', 'success');
    url.searchParams.set('reference', tx.reference);
    url.searchParams.set('trxref', tx.trxref || tx.reference);
    url.searchParams.set('amount', String(tx.amount));
    url.searchParams.set('currency', tx.currency || 'NGN');
    if (purpose) url.searchParams.set('purpose', purpose);
    url.searchParams.set('merchant_id', tx.merchantId);
    url.searchParams.set('timestamp', tx.timestamp);
    url.searchParams.set('signature', tx.signature);
    url.searchParams.set('sig', tx.signature);
    return url.toString();
  };

  // Notify third-party via postMessage (for iframe/popup embedding)
  const dispatchPostMessageConfirmation = (tx) => {
    const payload = {
      type: 'OCUBYTE_PAYMENT_SUCCESS',
      status: 'success',
      reference: tx.reference,
      trxref: tx.trxref,
      amount: tx.amount,
      currency: tx.currency,
      merchant_id: tx.merchantId,
      timestamp: tx.timestamp,
      signature: tx.signature
    };

    if (window.opener && window.opener !== window) {
      try {
        window.opener.postMessage(payload, '*');
      } catch (e) {
        console.warn('Could not postMessage to opener:', e);
      }
    }
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(payload, '*');
      } catch (e) {
        console.warn('Could not postMessage to parent:', e);
      }
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = (tx) => {
    setIsProcessing(false);
    setCompletedTx(tx);
    dispatchPostMessageConfirmation(tx);

    // If there is a callback URL, start auto-redirect countdown
    if (callbackUrl) {
      setIsAutoRedirecting(true);
      let count = 5;
      const timer = setInterval(() => {
        count -= 1;
        setRedirectCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          const finalUrl = buildReturnUrl(tx);
          if (finalUrl) {
            window.location.href = finalUrl;
          }
        }
      }, 1000);
    }
  };

  // Trigger Paystack inline checkout
  const handleCheckout = async (isSandbox = false) => {
    const cleanName = (customerName || '').trim();
    const fallbackEmail = `${(cleanName || 'payer').toLowerCase().replace(/[^a-z0-9]/g, '') || 'member'}@${appSlug === 'obeag' || merchantId.includes('obeag') ? 'ohabuenyi.org' : 'ocubyte.org'}`;
    const effectiveEmail = (customerEmail && customerEmail.includes('@')) ? customerEmail.trim() : fallbackEmail;

    const currentRef = reference || generateReference(`GW_${(merchantId || 'OBEAG').substring(0, 6)}`);

    setIsProcessing(true);

    if (isSandbox) {
      setTimeout(() => {
        const tx = simulatePaymentSuccess({
          email: effectiveEmail,
          amount,
          currency,
          reference: currentRef,
          customerName: cleanName || 'Payer',
          merchantId,
          merchantName
        });
        handlePaymentSuccess(tx);
      }, 700);
      return;
    }

    try {
      await initializePaystackPayment({
        email: effectiveEmail,
        amount,
        currency,
        reference: currentRef,
        customerName: cleanName || 'Payer',
        merchantId,
        merchantName,
        metadata: {
          title,
          description,
          order_ref: reference,
          callback_url: callbackUrl,
          merchant_id: merchantId,
          payer_name: cleanName
        },
        onSuccess: (tx) => {
          handlePaymentSuccess(tx);
        },
        onCancel: () => {
          setIsProcessing(false);
        },
        onError: (err) => {
          setIsProcessing(false);
          alert(err.message || 'Payment initiation failed.');
        }
      });
    } catch (err) {
      setIsProcessing(false);
      alert(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full space-y-6">
        
        {/* State 1: Invalid or Missing Parameters */}
        {!hasValidParams && !completedTx && (
          <div className="bg-secondary/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text">Payment Request Incomplete</h2>
              <p className="text-xs text-muted leading-relaxed max-w-xs mx-auto">
                Payment information is missing or incomplete. Please return to the merchant site and try again.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-accent text-primary text-xs font-bold hover:brightness-110 transition shadow-md"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}

        {/* State 2: Active Checkout Screen - Simplified: Only who they are paying, payer's name, amount, and pay button */}
        {hasValidParams && !completedTx && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-center"
          >
            {/* Who they are paying */}
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Paying to
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text tracking-tight">
                {merchantName}
              </h1>
            </div>

            {/* Payer's Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-muted block">
                Payer's Name
              </label>
              <input
                type="text"
                placeholder="Enter payer's name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-primary/60 border border-slate-700 rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold text-text focus:outline-none focus:border-accent transition"
              />
            </div>

            {/* Amount */}
            <div className="p-5 rounded-2xl bg-primary/50 border border-slate-800 text-center space-y-1">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Amount
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-accent font-mono">
                {formatCurrency(amount, currency)}
              </div>
            </div>

            {/* The Pay Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleCheckout(false)}
                className="w-full py-4 px-6 rounded-2xl bg-accent text-primary font-extrabold text-base hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-accent/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </span>
                ) : (
                  <span>Pay {formatCurrency(amount, currency)}</span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* State 3: Payment Success & Auto Redirect to Third-Party Website */}
        {completedTx && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {callbackUrl && isAutoRedirecting && (
              <div className="bg-accent/15 border border-accent/40 rounded-2xl p-4 text-center space-y-2">
                <div className="text-xs font-semibold text-accent flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to {merchantName} in {redirectCountdown}s...</span>
                </div>
                <div className="w-full bg-primary/50 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            )}

            <PaymentReceipt 
              transaction={completedTx}
              returnUrl={buildReturnUrl(completedTx)}
              returnUrlText={`Return to ${merchantName} Now`}
            />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default GatewayCheckout;
