import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Store, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Clock, 
  Building2,
  Receipt
} from 'lucide-react';
import { 
  initializePaystackPayment, 
  simulatePaymentSuccess, 
  formatCurrency, 
  generateVerificationSignature,
  recordTransaction,
  generateReference
} from '../utils/paystack';
import PaymentReceipt from '../components/PaymentReceipt';

const GatewayCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
  const cancelUrl = searchParams.get('cancel_url') || '';
  const userId = searchParams.get('userId') || searchParams.get('user_id') || '';
  const dueIds = searchParams.get('due_ids') || '';
  
  // Customer details (prefilled or editable)
  const [customerEmail, setCustomerEmail] = useState(searchParams.get('email') || searchParams.get('customer_email') || '');
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
    if (!customerEmail || !customerEmail.includes('@')) {
      alert('Please enter a valid customer email address.');
      return;
    }

    const currentRef = reference || generateReference(`GW_${merchantId.substring(0, 6)}`);

    setIsProcessing(true);

    if (isSandbox) {
      setTimeout(() => {
        const tx = simulatePaymentSuccess({
          email: customerEmail,
          amount,
          currency,
          reference: currentRef,
          customerName,
          merchantId,
          merchantName
        });
        handlePaymentSuccess(tx);
      }, 700);
      return;
    }

    try {
      await initializePaystackPayment({
        email: customerEmail,
        amount,
        currency,
        reference: currentRef,
        customerName,
        merchantId,
        merchantName,
        metadata: {
          title,
          description,
          order_ref: reference,
          callback_url: callbackUrl,
          merchant_id: merchantId
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
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Gateway Security Header Bar */}
        <div className="flex items-center justify-between text-xs text-muted px-2">
          <div className="flex items-center gap-2 font-semibold text-text">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>Ocubyte Payment Gateway <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LIVE</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-accent">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* State 1: Invalid or Missing Parameters */}
        {!hasValidParams && !completedTx && (
          <div className="bg-secondary/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text">Payment Gateway Request Missing Parameters</h2>
              <p className="text-xs text-muted leading-relaxed max-w-md mx-auto">
                Third-party websites initiate payments by redirecting customers with parameters such as 
                <span className="font-mono text-accent"> ?merchant_id=...&amount=...&callback_url=...</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-primary/50 border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="text-muted font-sans font-semibold">Try these quick pre-built test requests:</div>
              <div className="flex flex-col gap-2 pt-1 font-sans">
                <Link
                  to="/gateway/checkout?merchant_id=lumina_store&merchant_name=Lumina+Gadgets&amount=45000&currency=NGN&reference=LUM-8821&title=Smart+ANC+Earbuds&customer_name=Alex+Johnson&customer_email=alex@example.com&callback_url=/gateway/demo-callback"
                  className="p-2.5 rounded-xl bg-secondary hover:bg-slate-800 border border-slate-700 flex justify-between items-center text-text transition"
                >
                  <span>🎧 Lumina Gadgets (₦45,000)</span>
                  <span className="text-accent text-[11px] font-semibold">Load Request →</span>
                </Link>

                <Link
                  to="/gateway/checkout?merchant_id=apex_academy&merchant_name=Apex+Code+Academy&amount=25000&currency=NGN&reference=APX-1049&title=Fullstack+React+Bootcamp&customer_name=Sarah+Smith&customer_email=sarah@example.com&callback_url=/gateway/demo-callback"
                  className="p-2.5 rounded-xl bg-secondary hover:bg-slate-800 border border-slate-700 flex justify-between items-center text-text transition"
                >
                  <span>🎓 Apex Academy Course (₦25,000)</span>
                  <span className="text-accent text-[11px] font-semibold">Load Request →</span>
                </Link>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/gateway"
                className="px-5 py-2.5 rounded-xl bg-accent text-primary text-xs font-bold hover:brightness-110 transition shadow-md"
              >
                Go to Gateway Merchant Portal & Docs
              </Link>
              <Link
                to="/pay"
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs text-text hover:bg-slate-800 transition"
              >
                Direct Ocubyte Payment
              </Link>
            </div>
          </div>
        )}

        {/* State 2: Active Checkout Screen */}
        {hasValidParams && !completedTx && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
          >
            {/* Merchant Identity Card */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base text-text">{merchantName}</span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/20 text-accent" title="Verified Affiliate Merchant">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  </div>
                  <div className="text-xs text-muted font-mono">ID: {merchantId}</div>
                </div>
              </div>

              {cancelUrl && (
                <a 
                  href={cancelUrl}
                  className="text-xs text-muted hover:text-text flex items-center gap-1 transition"
                  title="Cancel and return to store"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </a>
              )}
            </div>

            {/* Order Item & Amount Display */}
            <div className="p-4 rounded-2xl bg-primary/40 border border-slate-800/80 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-text text-sm sm:text-base">{title}</h3>
                  <p className="text-xs text-muted line-clamp-2 mt-0.5">{description}</p>
                </div>
                {reference && (
                  <span className="font-mono text-[11px] text-muted bg-secondary/80 px-2 py-1 rounded-md border border-slate-700">
                    {reference}
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex justify-between items-baseline">
                <span className="text-xs text-muted">Amount Due</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-accent font-mono">
                  {formatCurrency(amount, currency)}
                </span>
              </div>
            </div>

            {/* Customer Details Confirmation */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Customer Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email for payment receipt"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-primary/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Customer Full Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-primary/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Paystack Payment Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleCheckout(false)}
                className="w-full py-4 px-6 rounded-2xl bg-accent text-primary font-extrabold text-base hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-accent/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Connecting to Paystack...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {formatCurrency(amount, currency)} with Paystack</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleCheckout(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 hover:bg-slate-800/50 text-muted hover:text-text text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Test Sandbox Payment (Mock Checkout)</span>
              </button>
            </div>

            {/* Callback Info */}
            {callbackUrl && (
              <div className="p-3 rounded-xl bg-primary/30 border border-slate-800 text-[11px] text-muted flex items-start gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  After successful payment, confirmation will be securely dispatched and you will be returned to <span className="font-mono text-text">{new URL(callbackUrl, window.location.origin).hostname}</span>.
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* State 3: Payment Success & Auto Redirect to Third-Party Website */}
        {completedTx && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Auto-redirect Banner */}
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
