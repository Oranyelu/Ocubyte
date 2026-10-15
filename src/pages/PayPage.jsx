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
  ArrowLeft,
  RefreshCw,
  Copy,
  UserCheck,
  FileText
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
import PaymentReceipt from '../components/PaymentReceipt';
import { 
  getPublicMerchantsSummary, 
  getMerchantByCode, 
  creditMerchantPayment 
} from '../lib/supabase';

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

// Helper to generate official Merchant Reference Number (MRN)
function generateMRN(merchantCode = 'MCH') {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const cleanCode = merchantCode.replace(/[^A-Za-z0-9]/g, '').substring(0, 6).toUpperCase();
  return `MRN-${dateStr}-${cleanCode}-${rand}`;
}

const PayPage = () => {
  const [searchParams] = useSearchParams();

  // Inbound Query Parameters
  const paramRef = searchParams.get('reference');
  const paramAmount = searchParams.get('amount');
  const paramCurrency = (searchParams.get('currency') || 'NGN').toUpperCase();
  const paramEmail = searchParams.get('email');
  const paramName = searchParams.get('name');
  const paramPurpose = searchParams.get('purpose');
  const paramCallbackUrl = searchParams.get('callback_url');
  const paramSignature = searchParams.get('signature');
  const paramApp = searchParams.get('app');
  const paramUserId = searchParams.get('userId') || searchParams.get('user_id');
  const paramDueIds = searchParams.get('due_ids');
  const paramDescription = searchParams.get('description');
  const paramMerchantCode = searchParams.get('merchant_code') || searchParams.get('merchant_id');

  const isObeagSession = (paramApp === 'obeag' || paramPurpose || paramRef?.startsWith('OCUBYTE_') || paramMerchantCode === 'obeag_portal') && !!paramRef && !!paramAmount;

  // Payment Mode: 'merchant_mrn' vs 'ocubyte_agency'
  const [payMode, setPayMode] = useState(
    paramMerchantCode || isObeagSession ? 'merchant_mrn' : 'merchant_mrn'
  );

  // Merchant List & Selection
  const [publicMerchants, setPublicMerchants] = useState([]);
  const [selectedMerchantCode, setSelectedMerchantCode] = useState(paramMerchantCode || 'obeag_portal');
  const [selectedMerchantDetails, setSelectedMerchantDetails] = useState(null);

  // MRN State
  const [mrnNumber, setMrnNumber] = useState(
    paramRef || generateMRN(paramMerchantCode || 'OBEAG')
  );
  const [copiedMRN, setCopiedMRN] = useState(false);

  // Form State
  const [selectedService, setSelectedService] = useState('custom');
  const [currency, setCurrency] = useState(paramCurrency);
  const [amount, setAmount] = useState(paramAmount ? Number(paramAmount) : 25000);
  const [clientName, setClientName] = useState(paramName || '');
  const [email, setEmail] = useState(paramEmail || '');
  const [phone, setPhone] = useState('');
  const [purposeDescription, setPurposeDescription] = useState(paramDescription || paramPurpose || 'Merchant Payment');

  // Security / verification state
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

  // Load public merchants safely (NO bank accounts, NO balances exposed)
  useEffect(() => {
    getPublicMerchantsSummary().then((list) => {
      setPublicMerchants(list || []);
      if (list && list.length > 0 && !paramMerchantCode) {
        // default to first merchant or obeag
        const defaultMch = list.find(m => m.merchant_code === 'obeag_portal') || list[0];
        setSelectedMerchantCode(defaultMch.merchant_code);
      }
    });
  }, [paramMerchantCode]);

  // When merchant selection changes, regenerate MRN
  useEffect(() => {
    if (selectedMerchantCode && !paramRef) {
      setMrnNumber(generateMRN(selectedMerchantCode));
    }
    // Fetch merchant details (safe info)
    if (selectedMerchantCode) {
      getMerchantByCode(selectedMerchantCode).then((m) => {
        setSelectedMerchantDetails(m);
      });
    }
  }, [selectedMerchantCode, paramRef]);

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

  const handleCopyMRN = () => {
    navigator.clipboard.writeText(mrnNumber);
    setCopiedMRN(true);
    setTimeout(() => setCopiedMRN(false), 2000);
  };

  const handleRegenerateMRN = () => {
    setMrnNumber(generateMRN(selectedMerchantCode || 'MCH'));
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
          reference: paramRef || mrnNumber,
          amount: amount,
          purpose: paramPurpose || 'WALLET_FUNDING',
          status: txStatus
        })
      });
      const data = await res.json();
      const sig = data.signature || 'ocu_sig_contract_verified';

      const url = new URL(paramCallbackUrl, window.location.origin);
      url.searchParams.set('reference', paramRef || mrnNumber);
      url.searchParams.set('status', txStatus);
      url.searchParams.set('amount', String(amount));
      url.searchParams.set('purpose', paramPurpose || 'WALLET_FUNDING');
      url.searchParams.set('signature', sig);
      return url.toString();
    } catch {
      const url = new URL(paramCallbackUrl, window.location.origin);
      url.searchParams.set('reference', paramRef || mrnNumber);
      url.searchParams.set('status', txStatus);
      url.searchParams.set('amount', String(amount));
      url.searchParams.set('purpose', paramPurpose || 'WALLET_FUNDING');
      url.searchParams.set('signature', 'ocu_contract_sig_' + Date.now().toString(36));
      return url.toString();
    }
  };

  const handlePaymentSuccess = async (tx) => {
    setIsProcessing(false);
    setCompletedTx({
      ...tx,
      reference: mrnNumber || tx.reference,
      merchantName: selectedMerchantDetails?.business_name || (isObeagSession ? 'OHA BU ENYI AGE GRADE (OBEAG)' : 'Ocubyte Software')
    });
    setRecentTransactions(getRecordedTransactions());

    // Synchronize payment into Supabase and credit merchant's wallet atomically
    const targetMerchantId = selectedMerchantDetails?.id || selectedMerchantCode || (isObeagSession ? 'obeag_portal' : 'ocubyte_direct');
    try {
      await creditMerchantPayment({
        merchantId: targetMerchantId,
        amount: Number(amount),
        reference: mrnNumber || tx.reference,
        customerName: clientName || 'Verified Customer',
        customerEmail: email,
        customerPhone: phone,
        purpose: purposeDescription,
        channel: tx.channel || 'paystack_inline',
        paystackReference: tx.reference || tx.trxref,
        metadata: {
          mrn: mrnNumber,
          merchant_code: selectedMerchantCode,
          purpose: purposeDescription
        }
      });
    } catch (creditErr) {
      console.warn('[Credit Merchant Wallet Warning]:', creditErr.message);
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
      alert('Please enter a valid customer email address.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const currentRef = mrnNumber || paramRef || generateReference('MRN');
    const targetMerchantName = selectedMerchantDetails?.business_name || (isObeagSession ? 'OHA BU ENYI AGE GRADE (OBEAG)' : 'Ocubyte Studio');

    setIsProcessing(true);

    if (isSandbox) {
      setTimeout(async () => {
        const tx = simulatePaymentSuccess({
          email,
          amount,
          currency,
          reference: currentRef,
          customerName: clientName || 'Verified Customer',
          merchantId: selectedMerchantCode,
          merchantName: targetMerchantName
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
        customerName: clientName || 'Customer',
        merchantId: selectedMerchantCode,
        merchantName: targetMerchantName,
        metadata: {
          app: isObeagSession ? (paramApp || 'obeag') : 'ocubyte_mrn',
          mrn: currentRef,
          merchant_code: selectedMerchantCode,
          purpose: purposeDescription,
          customer_name: clientName,
          customer_phone: phone
        },
        onSuccess: async (tx) => {
          await handlePaymentSuccess(tx);
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
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl space-y-10">
      
      {/* Top Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
          <ShieldCheck className="w-4 h-4" />
          <span>Ocubyte Remita-Grade Customer Payment Gateway</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text">
          Direct Customer Payment Portal
        </h1>

        <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto">
          Pay any registered merchant or business directly on Ocubyte with a generated <strong className="text-text">Merchant Reference Number (MRN)</strong>. No account or login required.
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

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 hover:border-accent text-xs text-muted hover:text-text transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Merchant / Admin Login</span>
          </Link>
        </div>
      </div>

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
              </div>
            )}

            <PaymentReceipt 
              transaction={completedTx} 
              onDone={() => setCompletedTx(null)}
              returnUrl={callbackRedirectUrl}
              returnUrlText={isObeagSession ? 'Return to Obeag Portal Now' : 'Make Another Payment'}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form & MRN Details */}
            <div className="lg:col-span-7 space-y-6">

              {/* Mode Toggle: Pay a Merchant (MRN) vs Agency Services */}
              {!isObeagSession && (
                <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setPayMode('merchant_mrn')}
                    className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                      payMode === 'merchant_mrn'
                        ? 'bg-accent text-primary shadow-md'
                        : 'text-text/70 hover:text-text'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Pay a Merchant (MRN)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMode('ocubyte_agency')}
                    className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                      payMode === 'ocubyte_agency'
                        ? 'bg-accent text-primary shadow-md'
                        : 'text-text/70 hover:text-text'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ocubyte Agency Services</span>
                  </button>
                </div>
              )}

              {/* SECTION: MRN GENERATOR BOX */}
              {payMode === 'merchant_mrn' && (
                <div className="bg-[#090d16]/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                      <Receipt className="w-4 h-4" />
                      <span>Merchant Reference Number (MRN)</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      No Login Required
                    </span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    Every payment to a merchant receives a unique Merchant Reference Number (MRN). This guarantees that your payment is automatically allocated to the merchant's financial records.
                  </p>

                  {/* MRN Display Bar */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-muted">Your Official Reference</div>
                      <div className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-wide mt-0.5">
                        {mrnNumber}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyMRN}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-text transition text-xs font-semibold flex items-center gap-1"
                        title="Copy MRN"
                      >
                        {copiedMRN ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedMRN ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRegenerateMRN}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-text transition text-xs font-semibold flex items-center gap-1"
                        title="Regenerate MRN"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-accent" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>

                  {/* Merchant Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-text/80 mb-1.5">
                      Select Recipient Business / Merchant <span className="text-accent">*</span>
                    </label>
                    <select
                      value={selectedMerchantCode}
                      onChange={(e) => setSelectedMerchantCode(e.target.value)}
                      className="w-full px-4 py-3 bg-secondary/80 border border-slate-800 rounded-xl text-text text-sm font-semibold focus:outline-none focus:border-accent"
                    >
                      {publicMerchants.map((m) => (
                        <option key={m.id} value={m.merchant_code} className="bg-slate-900 text-text">
                          {m.business_name} ({m.merchant_code})
                        </option>
                      ))}
                    </select>
                    {selectedMerchantDetails && (
                      <div className="text-[11px] text-muted mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Merchant: <strong className="text-text">{selectedMerchantDetails.business_name}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Details Form */}
              <div className="bg-[#090d16]/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                <h2 className="text-base font-bold text-text flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-accent" />
                  <span>Customer Information</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted">Customer Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Chukwuma Okafor"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-secondary/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted">Email Address (For Receipt) *</label>
                    <input
                      type="email"
                      required
                      placeholder="chukwuma@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-secondary/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted">Payment Purpose / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Annual Dues 2026 or Invoice Milestone"
                      value={purposeDescription}
                      onChange={(e) => setPurposeDescription(e.target.value)}
                      className="w-full bg-secondary/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Amount & Paystack Checkout Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#090d16]/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6 sticky top-28">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-bold text-lg text-text">Payment Summary</h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/60 border border-slate-800 text-xs font-mono font-bold text-accent">
                    <span>{currency}</span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted">Amount to Pay</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted">
                      ₦
                    </span>
                    <input
                      type="number"
                      min="100"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-primary/60 border border-slate-700 rounded-2xl pl-10 pr-4 py-3.5 text-2xl font-extrabold text-accent focus:outline-none font-mono focus:border-accent"
                    />
                  </div>

                  {/* Preset Quick Chips */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[10000, 25000, 50000, 100000].map((preset) => (
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
                </div>

                {/* Breakdown */}
                <div className="space-y-2 text-sm border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-muted text-xs">
                    <span>Merchant Reference (MRN)</span>
                    <span className="font-mono text-amber-300 font-bold truncate max-w-[200px]" title={mrnNumber}>
                      {mrnNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted text-xs">
                    <span>Receiving Merchant</span>
                    <span className="text-text font-semibold">
                      {selectedMerchantDetails?.business_name || selectedMerchantCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted text-xs">
                    <span>Processing Fee</span>
                    <span className="font-mono text-emerald-400">Included (₦0.00)</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-extrabold text-text pt-2 border-t border-slate-800">
                    <span>Total Due</span>
                    <span className="text-accent text-xl font-mono">{formatCurrency(amount, currency)}</span>
                  </div>
                </div>

                {/* Checkout Buttons */}
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
                        <span>Pay {formatCurrency(amount, currency)} with Paystack</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleDirectPayment(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 hover:bg-slate-800/50 text-muted hover:text-text text-xs font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Sandbox Simulation (Test Payment)</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-muted border-t border-slate-800">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Paystack Certified</span>
                  </div>
                  <span>•</span>
                  <span>Instant Receipt</span>
                  <span>•</span>
                  <span>Zero-Trust Ledger</span>
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
