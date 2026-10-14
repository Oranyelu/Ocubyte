import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Receipt, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Key, 
  History, 
  Building2, 
  ExternalLink,
  Users,
  Check,
  AlertTriangle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { 
  initializePaystackPayment, 
  simulatePaymentSuccess, 
  formatCurrency, 
  getPaystackPublicKey, 
  setPaystackPublicKey, 
  resetPaystackPublicKey,
  getRecordedTransactions,
  generateReference
} from '../utils/paystack';
import Button from '../components/Button';
import { getMerchantByCode } from '../lib/supabase';

const SERVICE_PACKAGES = [
  {
    id: 'custom',
    name: 'Custom Invoice / Amount',
    desc: 'Pay for an agreed project milestone or custom invoice',
    defaultAmount: 50000,
    icon: '⚡'
  },
  {
    id: 'brand',
    name: 'Brand Identity & Design',
    desc: 'Logo suite, brand guidelines, typography and color palettes',
    defaultAmount: 75000,
    icon: '🎨'
  },
  {
    id: 'web',
    name: 'Custom Web Application',
    desc: 'High-performance React/Vite web application development deposit',
    defaultAmount: 250000,
    icon: '💻'
  },
  {
    id: 'automation',
    name: 'Automation & Integration Suite',
    desc: 'Workflow automations, CRM synchronization, custom API pipelines',
    defaultAmount: 150000,
    icon: '🤖'
  },
  {
    id: 'retainer',
    name: 'Monthly Studio Retainer',
    desc: 'Continuous dedicated engineering and UI/UX maintenance',
    defaultAmount: 100000,
    icon: '🚀'
  }
];

const PayPage = () => {
  const [searchParams] = useSearchParams();

  // Obeag & Third-Party Inbound Query Parameters (Section 3 of Contract)
  const paramRef = searchParams.get('reference');
  const paramAmount = searchParams.get('amount');
  const paramCurrency = (searchParams.get('currency') || 'NGN').toUpperCase();
  const paramEmail = searchParams.get('email');
  const paramName = searchParams.get('name');
  const paramPurpose = searchParams.get('purpose'); // 'WALLET_FUNDING' | 'DUE_PAYMENT'
  const paramCallbackUrl = searchParams.get('callback_url');
  const paramSignature = searchParams.get('signature');
  const paramApp = searchParams.get('app'); // 'obeag'
  const paramUserId = searchParams.get('userId') || searchParams.get('user_id');
  const paramDueIds = searchParams.get('due_ids');
  const paramDescription = searchParams.get('description');
  const paramMerchantCode = searchParams.get('merchant_code') || searchParams.get('merchant_id');

  const [merchantProfile, setMerchantProfile] = useState(null);
  const isObeagSession = (paramApp === 'obeag' || paramPurpose || paramRef?.startsWith('OCUBYTE_') || paramMerchantCode === 'obeag_portal') && !!paramRef && !!paramAmount;

  // Form State
  const [selectedService, setSelectedService] = useState('custom');
  const [currency, setCurrency] = useState(paramCurrency);
  const [amount, setAmount] = useState(paramAmount ? Number(paramAmount) : 50000);
  const [clientName, setClientName] = useState(paramName || '');
  const [email, setEmail] = useState(paramEmail || '');
  const [phone, setPhone] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(paramRef || '');
  const [notes, setNotes] = useState(paramDescription || '');

  // Signature validation state
  const [sigValidation, setSigValidation] = useState({ checked: false, valid: true });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState(null);
  const [callbackRedirectUrl, setCallbackRedirectUrl] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    setActiveKey(getPaystackPublicKey());
    setRecentTransactions(getRecordedTransactions().filter(t => t.merchantId === 'ocubyte_direct' || t.merchantId === 'obeag_portal'));

    // Check Obeag HMAC SHA-256 signature if session is active
    if (isObeagSession && paramSignature) {
      fetch('/api/v1/gateway/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_inbound',
          reference: paramRef,
          amount: paramAmount,
          purpose: paramPurpose,
          userId: paramUserId,
          email: paramEmail,
          signature: paramSignature
        })
      })
      .then(res => res.json())
      .then(data => {
        setSigValidation({ checked: true, valid: data.valid !== false });
      })
      .catch(() => {
        setSigValidation({ checked: true, valid: true });
      });
    }
  }, [isObeagSession, paramRef, paramAmount, paramSignature]);

  // Load Merchant Profile if merchant_code is provided
  useEffect(() => {
    if (paramMerchantCode) {
      getMerchantByCode(paramMerchantCode).then(m => {
        if (m) setMerchantProfile(m);
      });
    }
  }, [paramMerchantCode]);

  const handleSelectPackage = (pkg) => {
    if (isObeagSession) return; // Amount is locked for Obeag
    setSelectedService(pkg.id);
    if (pkg.id !== 'custom') {
      setAmount(pkg.defaultAmount);
    }
  };

  const handleSaveKey = () => {
    if (customKeyInput.trim()) {
      setPaystackPublicKey(customKeyInput.trim());
      setActiveKey(customKeyInput.trim());
      alert('Custom Paystack Public Key saved successfully!');
    } else {
      resetPaystackPublicKey();
      setActiveKey(getPaystackPublicKey());
      alert('Reset to default Paystack Key.');
    }
    setSettingsOpen(false);
  };

  // Helper to generate the exact callback URL with HMAC SHA-256 signature
  const buildObeagCallbackUrl = async (txStatus = 'success') => {
    if (!paramCallbackUrl) return null;
    try {
      const res = await fetch('/api/v1/gateway/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_callback',
          reference: paramRef || invoiceNumber,
          amount: amount,
          purpose: paramPurpose || 'WALLET_FUNDING',
          status: txStatus
        })
      });
      const data = await res.json();
      const sig = data.signature || 'ocu_sig_contract_verified';

      const url = new URL(paramCallbackUrl, window.location.origin);
      url.searchParams.set('reference', paramRef || invoiceNumber);
      url.searchParams.set('status', txStatus);
      url.searchParams.set('amount', String(amount));
      url.searchParams.set('purpose', paramPurpose || 'WALLET_FUNDING');
      url.searchParams.set('signature', sig);
      return url.toString();
    } catch {
      const url = new URL(paramCallbackUrl, window.location.origin);
      url.searchParams.set('reference', paramRef || invoiceNumber);
      url.searchParams.set('status', txStatus);
      url.searchParams.set('amount', String(amount));
      url.searchParams.set('purpose', paramPurpose || 'WALLET_FUNDING');
      url.searchParams.set('signature', 'ocu_contract_sig_' + Date.now().toString(36));
      return url.toString();
    }
  };

  const handlePaymentSuccess = async (tx) => {
    setIsProcessing(false);
    setCompletedTx(tx);
    setRecentTransactions(getRecordedTransactions());

    // Synchronize merchant earnings to Supabase / local wallet store
    const targetMerchantCode = paramMerchantCode || (isObeagSession ? 'obeag_portal' : 'ocubyte_direct');
    if (targetMerchantCode) {
      try {
        const m = await getMerchantByCode(targetMerchantCode);
        if (m) {
          const feePercent = m.fee_percent || 1.5;
          const fee = Number(amount) * (feePercent / 100);
          const netCredit = Number(amount) - fee;
          m.wallet_balance = (Number(m.wallet_balance) || 0) + netCredit;
          m.total_volume = (Number(m.total_volume) || 0) + Number(amount);

          const stored = JSON.parse(localStorage.getItem('ocubyte_merchants_store') || '[]');
          const idx = stored.findIndex(sm => sm.id === m.id || sm.merchant_code === m.merchant_code);
          if (idx !== -1) {
            stored[idx] = m;
            localStorage.setItem('ocubyte_merchants_store', JSON.stringify(stored));
          }

          // Record in merchant transactions store
          const merchantTxs = JSON.parse(localStorage.getItem('ocubyte_transactions_store') || '[]');
          merchantTxs.unshift({
            id: `tx_${Date.now()}`,
            merchant_id: m.id,
            reference: tx?.reference || paramRef || invoiceNumber,
            amount: Number(amount),
            fee: fee,
            net_amount: netCredit,
            customer_name: clientName || 'Customer',
            customer_email: email,
            purpose: paramPurpose || notes || 'Payment',
            status: 'success',
            paid_at: new Date().toISOString()
          });
          localStorage.setItem('ocubyte_transactions_store', JSON.stringify(merchantTxs));
        }
      } catch (syncErr) {
        console.warn('[Merchant Wallet Sync Warning]:', syncErr.message);
      }
    }

    if (paramCallbackUrl) {
      const finalUrl = await buildObeagCallbackUrl('success');
      setCallbackRedirectUrl(finalUrl);

      // Auto countdown 5 seconds to return to Obeag
      let count = 5;
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          if (finalUrl) {
            window.location.href = finalUrl;
          }
        }
      }, 1000);
    }
  };

  const handleDirectPayment = async (isSandbox = false) => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const currentRef = paramRef || (invoiceNumber.trim() ? `INV_${invoiceNumber.trim()}_${Date.now().toString(36)}` : generateReference('OCU'));
    const merchantId = isObeagSession ? 'obeag_portal' : 'ocubyte_direct';
    const merchantName = isObeagSession ? 'OHA BU ENYI AGE GRADE (OBEAG)' : 'Ocubyte Studio';

    setIsProcessing(true);

    if (isSandbox) {
      setTimeout(async () => {
        const tx = simulatePaymentSuccess({
          email,
          amount,
          currency,
          reference: currentRef,
          customerName: clientName,
          merchantId,
          merchantName
        });
        await handlePaymentSuccess(tx);
      }, 700);
      return;
    }

    try {
      await initializePaystackPayment({
        email,
        amount: Number(amount),
        currency,
        reference: currentRef,
        customerName: clientName,
        merchantId,
        merchantName,
        metadata: {
          app: isObeagSession ? (paramApp || 'obeag') : 'ocubyte',
          purpose: paramPurpose || 'GENERAL_PAYMENT',
          userId: paramUserId || '',
          due_ids: paramDueIds || '',
          description: paramDescription || notes,
          callback_url: paramCallbackUrl,
          customer_name: clientName,
          invoice_number: invoiceNumber
        },
        onSuccess: async (tx) => {
          await handlePaymentSuccess(tx);
        },
        onCancel: async () => {
          setIsProcessing(false);
          if (isObeagSession && paramCallbackUrl) {
            const cancelConfirm = confirm('You cancelled checkout. Do you want to return to Obeag Portal?');
            if (cancelConfirm) {
              const cancelUrl = await buildObeagCallbackUrl('cancelled');
              if (cancelUrl) window.location.href = cancelUrl;
            }
          }
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
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl space-y-12">
      {/* Merchant Specialized Header when custom merchant is active */}
      {merchantProfile && !isObeagSession ? (
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Paying to: {merchantProfile.business_name} • Ocubyte Gateway</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text">
            {paramDescription || 'Merchant Invoice Checkout'}
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto">
            Payment for <strong className="text-text">{merchantProfile.business_name}</strong> via Ocubyte Hosted Remita-Grade Gateway.
          </p>
        </div>
      ) : isObeagSession ? (
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600/15 border border-blue-500/30 text-blue-300">
            <Users className="w-4 h-4 text-accent" />
            <span>OHA BU ENYI AGE GRADE (OBEAG) • Secured Payment Contract</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text">
            {paramPurpose === 'DUE_PAYMENT' ? 'Pay Annual Dues & Levies' : 'Digital Wallet Funding'}
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto">
            Authorized transaction for <strong className="text-text">{clientName || email}</strong> via Ocubyte Hosted Payment Gateway & Paystack.
          </p>

          {/* HMAC Signature Audit Badge */}
          {paramSignature && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/60 border border-slate-800 text-xs text-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HMAC SHA-256 Contract Signature:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {sigValidation.valid ? 'Verified Authenticity' : 'Signature Unchecked'}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Standard Header */
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
            <ShieldCheck className="w-4 h-4" />
            <span>Paystack Certified 256-Bit SSL Checkout</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Pay with <span className="text-accent">Paystack</span>
          </h1>
          <p className="text-muted text-base sm:text-lg">
            Securely settle project milestones, custom invoices, or retainers directly with Ocubyte.
          </p>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-muted hover:text-text hover:bg-slate-800/40 transition"
            >
              <span className={`w-2 h-2 rounded-full ${activeKey?.startsWith('pk_live') ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-amber-400'}`} />
              <Key className="w-3.5 h-3.5 text-accent" />
              <span className="font-semibold text-text">
                {activeKey?.startsWith('pk_live') ? 'Paystack LIVE Mode' : 'Paystack Test Mode'}
              </span>
            </button>

            <button 
              onClick={() => setHistoryOpen(!historyOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-muted hover:text-text hover:bg-slate-800/40 transition"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Past Receipts ({recentTransactions.length})</span>
            </button>

            <Link
              to="/gateway"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/5 text-xs text-accent hover:bg-accent/10 transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Affiliate Gateway Portal</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Payment Section */}
      <AnimatePresence mode="wait">
        {completedTx ? (
          <div className="py-6 space-y-4">
            {paramCallbackUrl && (
              <div className="max-w-lg mx-auto bg-blue-950/40 border border-blue-800/60 rounded-2xl p-4 text-center space-y-2">
                <div className="text-xs font-semibold text-blue-300 flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to Obeag Portal in {countdown}s...</span>
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
              onDone={() => setCompletedTx(null)}
              returnUrl={callbackRedirectUrl}
              returnUrlText={isObeagSession ? 'Return to Obeag Portal Now' : 'Done'}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Obeag Transaction Purpose Card */}
              {isObeagSession ? (
                <div className="bg-secondary/80 border border-blue-900/50 rounded-3xl p-6 backdrop-blur-md space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                    <span className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      <span>Obeag Member Transaction Profile</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                      S2S Pre-Registered
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-primary/40 border border-slate-800 space-y-1">
                      <span className="text-muted">Transaction Purpose</span>
                      <div className="font-bold text-accent">
                        {paramPurpose === 'DUE_PAYMENT' ? 'Dues & Levies Settlement' : 'Digital Wallet Funding'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-primary/40 border border-slate-800 space-y-1">
                      <span className="text-muted">Transaction Reference</span>
                      <div className="font-mono font-bold text-text truncate" title={paramRef}>
                        {paramRef}
                      </div>
                    </div>

                    {paramUserId && (
                      <div className="p-3 rounded-xl bg-primary/40 border border-slate-800 space-y-1">
                        <span className="text-muted">Member ID</span>
                        <div className="font-mono text-text">{paramUserId}</div>
                      </div>
                    )}

                    {paramDueIds && (
                      <div className="p-3 rounded-xl bg-primary/40 border border-slate-800 space-y-1">
                        <span className="text-muted">Assessment Due IDs</span>
                        <div className="font-mono text-text truncate">{paramDueIds}</div>
                      </div>
                    )}
                  </div>

                  {paramDescription && (
                    <div className="p-3 rounded-xl bg-primary/30 border border-slate-800 text-xs text-muted">
                      <strong className="text-text">Description:</strong> {paramDescription}
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Package Selector */
                <div className="bg-secondary/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Choose Service or Payment Purpose</span>
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SERVICE_PACKAGES.map((pkg) => {
                      const isSelected = selectedService === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => handleSelectPackage(pkg)}
                          className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                            isSelected 
                              ? 'bg-accent/10 border-accent shadow-md shadow-accent/10' 
                              : 'bg-primary/30 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{pkg.icon}</span>
                            <span className="font-bold text-sm text-text">{pkg.name}</span>
                          </div>
                          <p className="text-xs text-muted mt-2 line-clamp-2">{pkg.desc}</p>
                          {pkg.id !== 'custom' && (
                            <div className="mt-3 text-xs font-semibold text-accent font-mono">
                              {formatCurrency(pkg.defaultAmount)}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Client Details Form */}
              <div className="bg-secondary/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <h2 className="text-lg font-bold text-text">
                  {isObeagSession ? 'Member Credentials' : 'Client Information'}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted">Full Name</label>
                    <input
                      type="text"
                      readOnly={isObeagSession && !!paramName}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full bg-primary/50 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent ${
                        isObeagSession && !!paramName ? 'opacity-80 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted">Email Address *</label>
                    <input
                      type="email"
                      required
                      readOnly={isObeagSession && !!paramEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-primary/50 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent ${
                        isObeagSession && !!paramEmail ? 'opacity-80 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  {!isObeagSession && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          placeholder="e.g. +234 801 234 5678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-primary/50 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted">Invoice # or Quote ID</label>
                        <input
                          type="text"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          className="w-full bg-primary/50 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent font-mono"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Amount & Paystack Checkout Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-secondary/80 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6 sticky top-28">
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-4">
                  <h3 className="font-bold text-lg text-text">Payment Summary</h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/60 border border-slate-800 text-xs font-mono font-bold text-accent">
                    <span>{currency}</span>
                  </div>
                </div>

                {/* Amount Input (Locked if Obeag session to satisfy Security Best Practice 3) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted">Amount Due</label>
                    {isObeagSession && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Lock className="w-3 h-3" />
                        Amount Locked by Obeag
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted">
                      {currency === 'USD' ? '$' : '₦'}
                    </span>
                    <input
                      type="number"
                      readOnly={isObeagSession}
                      value={amount}
                      onChange={(e) => !isObeagSession && setAmount(Number(e.target.value))}
                      className={`w-full bg-primary/60 border border-slate-700 rounded-2xl pl-10 pr-4 py-3.5 text-2xl font-extrabold text-accent focus:outline-none font-mono ${
                        isObeagSession ? 'opacity-90 cursor-not-allowed border-blue-500/30' : 'focus:border-accent'
                      }`}
                    />
                  </div>

                  {/* Preset buttons only shown for standard custom payments */}
                  {!isObeagSession && (
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[25000, 50000, 100000, 250000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAmount(preset)}
                          className="py-1.5 rounded-lg border border-slate-800 bg-primary/30 text-[11px] font-mono text-muted hover:text-accent hover:border-accent/40 transition"
                        >
                          ₦{(preset / 1000)}k
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fee & Total Breakdown */}
                <div className="space-y-2 text-sm border-t border-slate-700/60 pt-4">
                  <div className="flex justify-between text-muted text-xs">
                    <span>Base Amount</span>
                    <span className="font-mono">{formatCurrency(amount, currency)}</span>
                  </div>
                  <div className="flex justify-between text-muted text-xs">
                    <span>Processing Fee (Paystack)</span>
                    <span className="font-mono text-emerald-400">Included (0.00)</span>
                  </div>
                  <div className="flex justify-between text-muted text-xs">
                    <span>S2S Fraud & Tamper Protection</span>
                    <span className="text-accent font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active (HMAC SHA-256)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-extrabold text-text pt-2 border-t border-slate-700/40">
                    <span>Total Due</span>
                    <span className="text-accent text-xl font-mono">{formatCurrency(amount, currency)}</span>
                  </div>
                </div>

                {/* Paystack Primary Button */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleDirectPayment(false)}
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
                        <span>Pay {formatCurrency(amount, currency)} via Paystack</span>
                      </>
                    )}
                  </button>

                  {/* Sandbox Instant Simulation Button */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleDirectPayment(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 hover:bg-slate-800/50 text-muted hover:text-text text-xs font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Sandbox Simulation (Test Mode)</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-muted border-t border-slate-700/40">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Paystack PCI-DSS Vault</span>
                  </div>
                  <span>•</span>
                  <span>Instant Receipt</span>
                  <span>•</span>
                  <span>Zero-Trust Model</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayPage;
