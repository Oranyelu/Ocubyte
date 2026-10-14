import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, 
  Copy, Check, ExternalLink, RefreshCw, Key, Landmark, 
  Clock, AlertCircle, FileText, PlusCircle, CheckCircle2, ChevronRight,
  Send, DollarSign, Download, Lock, Eye, EyeOff, Sparkles, UserCheck
} from 'lucide-react';
import { 
  getAllMerchants, 
  getMerchantByCode, 
  registerMerchant, 
  requestWithdrawal, 
  getMerchantWithdrawals, 
  getMerchantTransactions,
  isSupabaseConfigured 
} from '../lib/supabase';

// Popular Nigerian banks
const NIGERIAN_BANKS = [
  'Access Bank',
  'Zenith Bank',
  'Guaranty Trust Bank (GTBank)',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Kuda Bank',
  'OPay',
  'Moniepoint MFB',
  'Stanbic IBTC Bank',
  'Fidelity Bank',
  'First City Monument Bank (FCMB)',
  'Union Bank of Nigeria',
  'Sterling Bank',
  'Wema Bank / ALAT',
  'Ecobank Nigeria',
  'Polaris Bank',
  'Jaiz Bank'
];

export default function MerchantPortal() {
  const [merchants, setMerchants] = useState([]);
  const [activeMerchant, setActiveMerchant] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'withdrawals', 'transactions', 'api_keys', 'register'
  
  // Data State
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Modals
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawSuccessData, setWithdrawSuccessData] = useState(null);

  // Payment Link Generator Modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkAmount, setLinkAmount] = useState(10000);
  const [linkTitle, setLinkTitle] = useState('Services Invoice');
  const [generatedLink, setGeneratedLink] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    business_name: '',
    email: '',
    phone: '',
    bank_name: 'Zenith Bank',
    account_number: '',
    account_name: ''
  });
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(null);

  // Load merchants on mount
  useEffect(() => {
    loadAllMerchants();
  }, []);

  // When active merchant changes, load their withdrawals and transactions
  useEffect(() => {
    if (activeMerchant) {
      loadMerchantFinancials(activeMerchant.id || activeMerchant.merchant_code);
    }
  }, [activeMerchant]);

  const loadAllMerchants = async () => {
    setLoading(true);
    try {
      const list = await getAllMerchants();
      setMerchants(list);
      if (list.length > 0 && !activeMerchant) {
        setActiveMerchant(list[0]);
      }
    } catch (e) {
      console.error('Error loading merchants:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadMerchantFinancials = async (merchantId) => {
    try {
      const [wthList, txList] = await Promise.all([
        getMerchantWithdrawals(merchantId),
        getMerchantTransactions(merchantId)
      ]);
      setWithdrawals(wthList || []);
      setTransactions(txList || []);
    } catch (e) {
      console.error('Error loading financials:', e);
    }
  };

  const copyToClipboard = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Handle Withdrawal Submission
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!activeMerchant) return;

    const num = Number(withdrawAmount);
    if (!num || num <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (num > activeMerchant.wallet_balance) {
      alert(`Insufficient balance. Available: ₦${activeMerchant.wallet_balance.toLocaleString()}`);
      return;
    }

    setIsSubmittingWithdraw(true);
    try {
      const res = await requestWithdrawal({
        merchantId: activeMerchant.id || activeMerchant.merchant_code,
        amount: num,
        notes: withdrawNotes
      });

      if (res.success) {
        setWithdrawSuccessData(res.withdrawal || res);
        // Refresh merchant data
        const updated = await getMerchantByCode(activeMerchant.merchant_code);
        if (updated) setActiveMerchant(updated);
        loadMerchantFinancials(activeMerchant.id || activeMerchant.merchant_code);
        setWithdrawAmount('');
        setWithdrawNotes('');
      } else {
        alert(res.error || 'Failed to submit withdrawal request.');
      }
    } catch (err) {
      alert(err.message || 'Error communicating with server.');
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  // Handle Merchant Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.business_name || !regForm.email || !regForm.account_number || !regForm.account_name) {
      alert('Please fill out all required fields.');
      return;
    }

    if (regForm.account_number.length !== 10) {
      alert('Please enter a valid 10-digit Nigerian NUBAN account number.');
      return;
    }

    setRegSubmitting(true);
    try {
      const res = await registerMerchant(regForm);
      if (res.success) {
        setRegSuccess(res.merchant);
        await loadAllMerchants();
        setActiveMerchant(res.merchant);
        setRegForm({
          business_name: '',
          email: '',
          phone: '',
          bank_name: 'Zenith Bank',
          account_number: '',
          account_name: ''
        });
      } else {
        alert(res.error || 'Registration failed.');
      }
    } catch (err) {
      alert(err.message || 'Error registering business.');
    } finally {
      setRegSubmitting(false);
    }
  };

  // Build Payment Link
  const generatePaymentLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.ocubyte.org';
    const link = `${origin}/pay?merchant_code=${encodeURIComponent(activeMerchant?.merchant_code || 'ocubyte_direct')}&amount=${linkAmount}&description=${encodeURIComponent(linkTitle)}&app=merchant_link`;
    setGeneratedLink(link);
    setLinkModalOpen(true);
  };

  const transferFee = 50.00;
  const requestedNum = Number(withdrawAmount) || 0;
  const netPayoutAmount = Math.max(0, requestedNum - transferFee);

  return (
    <div className="min-h-screen bg-[#08090d] text-white pt-24 pb-20 selection:bg-[#3ecf8e] selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#3ecf8e]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#3b82f6]/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Supabase Status Banner */}
        <div className={`mb-6 p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl transition ${
          isSupabaseConfigured 
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
            : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isSupabaseConfigured ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide flex items-center gap-2">
                {isSupabaseConfigured ? 'Supabase Backend Connected' : 'Supabase Integration Ready (Local Fallback Active)'}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {isSupabaseConfigured ? 'LIVE DATABASE' : 'AWAITING SUPABASE URL & KEYS'}
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                {isSupabaseConfigured 
                  ? 'All merchants, transactions, and withdrawal alerts are permanently synchronized with PostgreSQL.' 
                  : 'Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to .env to connect your Supabase database.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-white/40">SQL Schema:</span>
            <code className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[11px] text-white/80">
              supabase/schema.sql
            </code>
          </div>
        </div>

        {/* Header & Merchant Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e] text-xs font-mono font-medium mb-3">
              <Building2 className="h-3.5 w-3.5" />
              <span>REMITA-GRADE MERCHANT PAYMENT GATEWAY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Merchant Settlement Portal
            </h1>
            <p className="text-sm text-white/60 mt-1 max-w-2xl">
              Register your business, accept customer payments online, track revenue in real-time, and request bank payouts fulfilled by Ocubyte Finance.
            </p>
          </div>

          {/* Merchant Selector & Quick Switch */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#12141c] border border-white/10 rounded-2xl px-3.5 py-2">
              <Building2 className="h-4 w-4 text-[#3ecf8e]" />
              <div className="text-xs">
                <span className="text-white/40 block text-[10px] uppercase font-mono">Active Business</span>
                <select
                  value={activeMerchant?.id || ''}
                  onChange={(e) => {
                    const found = merchants.find(m => m.id === e.target.value);
                    if (found) setActiveMerchant(found);
                  }}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-4"
                >
                  {merchants.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#12141c] text-white">
                      {m.business_name} ({m.merchant_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('register')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-white transition hover:border-[#3ecf8e]/40"
            >
              <PlusCircle className="h-4 w-4 text-[#3ecf8e]" />
              Register Business
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-2 border-b border-white/10 pb-3 mb-8 no-scrollbar">
          {[
            { id: 'overview', label: 'Financial Overview', icon: Wallet },
            { id: 'withdrawals', label: 'Withdrawals & Payouts', icon: ArrowUpRight, badge: withdrawals.filter(w => w.status === 'pending_review').length },
            { id: 'transactions', label: 'Transactions Ledger', icon: FileText, badge: transactions.length },
            { id: 'api_keys', label: 'API Keys & Integration', icon: Key },
            { id: 'register', label: '+ Register New Business', icon: Building2 },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#3ecf8e] text-black shadow-lg shadow-[#3ecf8e]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {Boolean(tab.badge) && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-black text-[#3ecf8e]' : 'bg-[#3ecf8e]/20 text-[#3ecf8e]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && activeMerchant && (
          <div className="space-y-8">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Available Wallet Balance */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#121622] to-[#0d1017] border border-[#3ecf8e]/30 shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3ecf8e]/10 rounded-full blur-2xl group-hover:bg-[#3ecf8e]/20 transition" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#3ecf8e]">Available Balance</span>
                  <div className="p-2 rounded-xl bg-[#3ecf8e]/10 text-[#3ecf8e]">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  ₦{Number(activeMerchant.wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Ready for direct bank withdrawal</p>
                
                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  disabled={Number(activeMerchant.wallet_balance) <= 50}
                  className="mt-5 w-full py-2.5 px-4 bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#3ecf8e]/20 flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Request Withdrawal
                </button>
              </div>

              {/* Card 2: Total Volume Processed */}
              <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50">Total Lifetime Volume</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  ₦{Number(activeMerchant.total_volume || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Processed across Paystack & Gateway</p>
                <div className="mt-5 flex items-center gap-2 text-xs text-blue-400 font-mono">
                  <span>Fee rate: {activeMerchant.fee_percent || 1.5}%</span>
                </div>
              </div>

              {/* Card 3: Destination Settlement Account */}
              <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50">Settlement Bank</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Landmark className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-lg font-bold text-white truncate">
                  {activeMerchant.bank_name}
                </div>
                <div className="text-xl font-mono font-bold text-[#3ecf8e] mt-1 tracking-wider">
                  {activeMerchant.account_number}
                </div>
                <p className="text-xs text-white/70 truncate mt-1">
                  {activeMerchant.account_name}
                </p>
              </div>

              {/* Card 4: Payout Fulfillment Mode */}
              <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/50">Disbursement Method</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-[#3ecf8e]">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white">
                    Live Human Payout Desk
                  </div>
                  <p className="text-[11px] text-white/50 mt-1">
                    Withdrawal requests trigger instant notifications to Ocubyte Finance officers for manual corporate bank transfer.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/40">Status:</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    DESK ACTIVE
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Actions & Integration Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Payment Link Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121622] to-[#12141c] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#3ecf8e] mb-2">
                    <Sparkles className="h-4 w-4" />
                    <span>INSTANT REMITA-STYLE PAYMENT LINK</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">Generate Payment Link</h3>
                  <p className="text-xs text-white/60 mt-1">
                    Share a direct checkout link with your customers via WhatsApp, Email, or SMS to receive funds straight to your merchant wallet.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                  <button
                    onClick={generatePaymentLink}
                    className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <ExternalLink className="h-4 w-4 text-[#3ecf8e]" />
                    Create Instant Link
                  </button>
                </div>
              </div>

              {/* Developer Integration Card */}
              <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col justify-between lg:col-span-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                      <Key className="h-4 w-4" />
                      <span>LIVE CREDENTIALS</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('api_keys')}
                      className="text-xs text-[#3ecf8e] hover:underline font-mono"
                    >
                      View Full Docs &rarr;
                    </button>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">Merchant Integration Details</h3>
                  <p className="text-xs text-white/60 mt-1">
                    Use these credentials to accept payments programmatically from your website or application.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Merchant Code</span>
                    <div className="flex items-center justify-between mt-1">
                      <code className="text-xs font-mono text-white font-bold">{activeMerchant.merchant_code}</code>
                      <button
                        onClick={() => copyToClipboard(activeMerchant.merchant_code, 'mcode')}
                        className="text-white/40 hover:text-white"
                      >
                        {copiedKey === 'mcode' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Public Key</span>
                    <div className="flex items-center justify-between mt-1">
                      <code className="text-xs font-mono text-white font-bold truncate max-w-[180px]">{activeMerchant.public_key}</code>
                      <button
                        onClick={() => copyToClipboard(activeMerchant.public_key, 'pubkey')}
                        className="text-white/40 hover:text-white"
                      >
                        {copiedKey === 'pubkey' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                  <span>Target Checkout Endpoint:</span>
                  <code className="font-mono text-[11px] text-[#3ecf8e]">https://www.ocubyte.org/pay</code>
                </div>
              </div>

            </div>

            {/* Recent Activity Feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Withdrawals Feed */}
              <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-[#3ecf8e]" />
                    Recent Withdrawal Requests
                  </h3>
                  <button onClick={() => setActiveTab('withdrawals')} className="text-xs text-[#3ecf8e] hover:underline font-mono">
                    View All ({withdrawals.length})
                  </button>
                </div>

                {withdrawals.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/40">
                    No withdrawal requests submitted yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.slice(0, 3).map((wth) => (
                      <div key={wth.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">₦{Number(wth.amount).toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                              wth.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                              wth.status === 'pending_review' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {wth.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-white/40 mt-1">Ref: {wth.reference} &bull; {new Date(wth.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right text-xs text-white/70">
                          <span className="font-mono text-white/40 block text-[10px]">Net to Bank</span>
                          <span className="font-mono font-bold text-[#3ecf8e]">₦{Number(wth.net_payout || wth.amount - 50).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Inbound Customer Payments */}
              <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-emerald-400" />
                    Recent Inbound Payments
                  </h3>
                  <button onClick={() => setActiveTab('transactions')} className="text-xs text-[#3ecf8e] hover:underline font-mono">
                    View Ledger ({transactions.length})
                  </button>
                </div>

                {transactions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/40">
                    No transactions recorded yet for this merchant.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((tx) => (
                      <div key={tx.id || tx.reference} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">₦{Number(tx.amount).toLocaleString()}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300">
                              {tx.status || 'success'}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/40 mt-1">{tx.customer_name || tx.customerName || 'Customer'} &bull; {tx.customer_email || tx.customerEmail}</p>
                        </div>
                        <div className="text-right text-xs">
                          <span className="font-mono text-white/40 block text-[10px]">Ref</span>
                          <span className="font-mono text-[11px] text-white/70 truncate max-w-[120px] inline-block">{tx.reference}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: WITHDRAWALS & PAYOUTS */}
        {activeTab === 'withdrawals' && activeMerchant && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Merchant Withdrawals & Settlement Ledger</h2>
                <p className="text-xs text-white/60 mt-1">
                  Every withdrawal is logged with high-fidelity financial audit tracking and sent to Ocubyte Finance for manual live disbursement.
                </p>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(true)}
                className="py-2.5 px-5 bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#3ecf8e]/20 flex items-center gap-2 transition"
              >
                <ArrowUpRight className="h-4 w-4" />
                Request New Withdrawal
              </button>
            </div>

            {/* Explanatory Callout */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-blue-300 flex items-start gap-3 text-xs leading-relaxed">
              <AlertCircle className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold mb-0.5">How Ocubyte Manual Settlement Works:</strong>
                When you initiate a withdrawal, the funds are safely deducted from your wallet balance to prevent double spending. An automated dispatch is sent to <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-blue-200">payments@ocubyte.org</code> with your bank details. A live finance desk officer executes the Nigerian NIP bank transfer and updates your withdrawal with the bank reference proof.
              </div>
            </div>

            {/* Withdrawals Table */}
            <div className="rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-white/40 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Reference</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Gross Amount</th>
                      <th className="py-3.5 px-4">Transfer Fee</th>
                      <th className="py-3.5 px-4">Net Payout</th>
                      <th className="py-3.5 px-4">Destination Bank Account</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Officer Proof Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-white/40">
                          No withdrawal records found. Click "Request New Withdrawal" to initiate your first payout.
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map((wth) => (
                        <tr key={wth.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-4 px-4 font-mono font-bold text-white">
                            {wth.reference}
                          </td>
                          <td className="py-4 px-4 text-white/60">
                            {new Date(wth.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 font-bold text-white">
                            ₦{Number(wth.amount).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-white/40 font-mono">
                            ₦{Number(wth.fee || 50).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 font-bold text-[#3ecf8e] font-mono">
                            ₦{Number(wth.net_payout || wth.amount - 50).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-white">{wth.bank_name}</div>
                            <div className="font-mono text-white/60 text-[11px]">{wth.account_number} ({wth.account_name})</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                              wth.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                              wth.status === 'pending_review' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                              wth.status === 'processing' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {wth.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-[11px] text-white/60">
                            {wth.proof_reference || wth.admin_notes || (
                              <span className="text-white/30 italic">Awaiting disbursement</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTIONS LEDGER */}
        {activeTab === 'transactions' && activeMerchant && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Customer Inbound Transactions</h2>
                <p className="text-xs text-white/60 mt-1">
                  Complete real-time log of customer payments credited directly to {activeMerchant.business_name}.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => loadMerchantFinancials(activeMerchant.id || activeMerchant.merchant_code)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition"
                  title="Refresh Ledger"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-white/40 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Reference</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Purpose</th>
                      <th className="py-3.5 px-4">Gross Amount</th>
                      <th className="py-3.5 px-4">Platform Fee</th>
                      <th className="py-3.5 px-4">Net Settled</th>
                      <th className="py-3.5 px-4">Channel</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-white/40">
                          No transactions recorded yet. Use the Payment Link or Gateway API to receive your first payment.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => {
                        const feeAmt = tx.fee !== undefined ? Number(tx.fee) : (Number(tx.amount) * 0.015);
                        const netAmt = tx.net_amount !== undefined ? Number(tx.net_amount) : (Number(tx.amount) - feeAmt);
                        return (
                          <tr key={tx.id || tx.reference} className="hover:bg-white/[0.02] transition">
                            <td className="py-4 px-4 font-mono font-bold text-white">
                              {tx.reference}
                            </td>
                            <td className="py-4 px-4 text-white/60">
                              {new Date(tx.paid_at || tx.created_at || tx.timestamp || Date.now()).toLocaleString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-white">{tx.customer_name || tx.customerName || 'Customer'}</div>
                              <div className="font-mono text-white/40 text-[10px]">{tx.customer_email || tx.customerEmail}</div>
                            </td>
                            <td className="py-4 px-4 text-white/70">
                              {tx.purpose || tx.title || 'Invoice Payment'}
                            </td>
                            <td className="py-4 px-4 font-bold text-white font-mono">
                              ₦{Number(tx.amount).toLocaleString()}
                            </td>
                            <td className="py-4 px-4 font-mono text-white/40">
                              ₦{feeAmt.toFixed(2)}
                            </td>
                            <td className="py-4 px-4 font-bold text-[#3ecf8e] font-mono">
                              ₦{netAmt.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 uppercase font-mono text-[10px] text-white/50">
                              {tx.channel || 'CARD'}
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300">
                                {tx.status || 'success'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: API KEYS & INTEGRATION DOCS */}
        {activeTab === 'api_keys' && activeMerchant && (
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10">
              <h2 className="text-xl font-bold text-white">Remita-Style Developer Integration</h2>
              <p className="text-xs text-white/60 mt-1">
                Link any external application, website, or mobile app to Ocubyte Gateway to receive payments directly into your merchant wallet.
              </p>

              {/* API Keys Table */}
              <div className="mt-6 space-y-4">
                
                {/* Merchant Code */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Merchant Code / Slug</span>
                    <span className="font-mono font-bold text-sm text-white">{activeMerchant.merchant_code}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(activeMerchant.merchant_code, 'code_tab')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 transition"
                  >
                    {copiedKey === 'code_tab' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy Code</span>
                  </button>
                </div>

                {/* Public API Key */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">Live Public API Key (Client-Side)</span>
                    <span className="font-mono font-bold text-sm text-white break-all">{activeMerchant.public_key}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(activeMerchant.public_key, 'pub_tab')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 transition"
                  >
                    {copiedKey === 'pub_tab' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy Key</span>
                  </button>
                </div>

                {/* Secret API Key */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block">Live Secret Key (Server-to-Server Only)</span>
                    <span className="font-mono font-bold text-sm text-white break-all">
                      {showSecretKey ? activeMerchant.secret_key : '••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
                      title={showSecretKey ? 'Hide Secret' : 'Reveal Secret'}
                    >
                      {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(activeMerchant.secret_key, 'sec_tab')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 transition"
                    >
                      {copiedKey === 'sec_tab' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>Copy Key</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Integration Snippets */}
            <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10">
              <h3 className="font-bold text-sm text-white mb-2">Checkout Initiation Code Snippet</h3>
              <p className="text-xs text-white/60 mb-4">
                Redirect customers from your website to Ocubyte Gateway with your merchant credentials:
              </p>

              <pre className="p-4 rounded-2xl bg-black/60 border border-white/5 text-[11px] font-mono text-[#3ecf8e] overflow-x-auto leading-relaxed">
{`// Redirect your customer to Ocubyte Hosted Gateway
const checkoutUrl = new URL("https://www.ocubyte.org/pay");
checkoutUrl.searchParams.set("merchant_code", "${activeMerchant.merchant_code}");
checkoutUrl.searchParams.set("amount", "25000"); // NGN
checkoutUrl.searchParams.set("email", customer.email);
checkoutUrl.searchParams.set("name", customer.name);
checkoutUrl.searchParams.set("reference", "ORDER_" + Date.now());
checkoutUrl.searchParams.set("callback_url", "https://yourwebsite.com/payment/callback");

// Send user to Ocubyte
window.location.href = checkoutUrl.toString();`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: REGISTER NEW BUSINESS */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 shadow-2xl">
              <div className="text-center mb-6">
                <div className="h-12 w-12 rounded-2xl bg-[#3ecf8e]/10 text-[#3ecf8e] flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Register Your Business on Ocubyte</h2>
                <p className="text-xs text-white/60 mt-1">
                  Start receiving customer payments like on Remita and get automated manual bank payouts.
                </p>
              </div>

              {regSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white">Business Registered Successfully!</h3>
                  <p className="text-xs text-emerald-300 mt-1">
                    Your merchant account is now active with merchant code: <code className="font-mono font-bold">{regSuccess.merchant_code}</code>
                  </p>
                  <button
                    onClick={() => {
                      setRegSuccess(null);
                      setActiveTab('overview');
                    }}
                    className="mt-6 py-2.5 px-6 bg-[#3ecf8e] text-black font-extrabold text-xs rounded-xl shadow-lg"
                  >
                    Go to Merchant Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-1">Business / Entity Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Logistics Ltd, Oha Bu Enyi Age Grade"
                      value={regForm.business_name}
                      onChange={(e) => setRegForm({ ...regForm, business_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#3ecf8e]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-white/60 mb-1">Official Business Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="billing@yourcompany.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#3ecf8e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-white/60 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#3ecf8e]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <span className="text-xs font-mono text-[#3ecf8e] uppercase tracking-wider block mb-3">
                      Settlement Bank Account Details (Where your money will be transferred)
                    </span>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-white/60 mb-1">Bank Name *</label>
                        <select
                          value={regForm.bank_name}
                          onChange={(e) => setRegForm({ ...regForm, bank_name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#3ecf8e]"
                        >
                          {NIGERIAN_BANKS.map((b) => (
                            <option key={b} value={b} className="bg-[#12141c] text-white">
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-white/60 mb-1">10-Digit Account Number *</label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="0123456789"
                            value={regForm.account_number}
                            onChange={(e) => setRegForm({ ...regForm, account_number: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#3ecf8e]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-white/60 mb-1">Account Holder Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Exact name on bank account"
                            value={regForm.account_name}
                            onChange={(e) => setRegForm({ ...regForm, account_name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#3ecf8e]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={regSubmitting}
                    className="mt-6 w-full py-3.5 px-4 bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-[#3ecf8e]/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {regSubmitting ? (
                      <>
                        <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Generating Keys & Registering...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Create Merchant Gateway Account
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>

      {/* WITHDRAWAL REQUEST MODAL */}
      <AnimatePresence>
        {withdrawModalOpen && activeMerchant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#12141c] border border-white/10 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ArrowUpRight className="h-5 w-5 text-[#3ecf8e]" />
                  <span>Request Bank Settlement</span>
                </div>
                <button
                  onClick={() => {
                    setWithdrawModalOpen(false);
                    setWithdrawSuccessData(null);
                  }}
                  className="text-white/40 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              {withdrawSuccessData ? (
                <div className="text-center py-4">
                  <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-white">Withdrawal Request Dispatched!</h3>
                  <p className="text-xs text-white/70 mt-2 max-w-md mx-auto">
                    Reference: <code className="font-mono text-[#3ecf8e] font-bold">{withdrawSuccessData.reference}</code>
                  </p>
                  <p className="text-xs text-white/60 mt-2">
                    An email alert has been sent to Ocubyte Finance Desk. An authorized human officer will execute the bank transfer of <strong className="text-white">₦{Number(withdrawSuccessData.net_payout || requestedNum - 50).toLocaleString()}</strong> to your {activeMerchant.bank_name} account.
                  </p>

                  <button
                    onClick={() => {
                      setWithdrawModalOpen(false);
                      setWithdrawSuccessData(null);
                    }}
                    className="mt-6 w-full py-3 bg-[#3ecf8e] text-black font-bold text-xs rounded-xl shadow-lg"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  
                  {/* Current Balance Bar */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/60 font-mono">Available Balance:</span>
                    <span className="font-mono font-bold text-sm text-[#3ecf8e]">
                      ₦{Number(activeMerchant.wallet_balance || 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Destination Account */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Destination Bank Account</span>
                    <div className="font-bold text-xs text-white">{activeMerchant.bank_name} - {activeMerchant.account_number}</div>
                    <div className="text-[11px] text-white/60">{activeMerchant.account_name}</div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-1">Withdrawal Amount (₦) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      max={activeMerchant.wallet_balance}
                      placeholder="e.g. 50000"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-base font-bold focus:outline-none focus:border-[#3ecf8e]"
                    />
                    
                    {/* Percentage Buttons */}
                    <div className="flex gap-2 mt-2">
                      {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setWithdrawAmount(String(Math.floor(activeMerchant.wallet_balance * pct)))}
                          className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-mono text-white/70"
                        >
                          {pct * 100}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between text-white/60">
                      <span>Requested Amount:</span>
                      <span className="font-mono text-white">₦{requestedNum.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>NIP Transfer Fee:</span>
                      <span className="font-mono text-white">₦{transferFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                      <span className="text-white">Net Payout to Bank:</span>
                      <span className="font-mono text-[#3ecf8e]">₦{netPayoutAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/60 mb-1">Notes for Finance Officer (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Urgent dues settlement for October"
                      value={withdrawNotes}
                      onChange={(e) => setWithdrawNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#3ecf8e]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingWithdraw || requestedNum <= transferFee || requestedNum > activeMerchant.wallet_balance}
                    className="w-full py-3.5 bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#3ecf8e]/20 flex items-center justify-center gap-2 transition disabled:opacity-40"
                  >
                    {isSubmittingWithdraw ? (
                      <>
                        <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Transmitting Request to Ocubyte Finance...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Confirm & Submit Withdrawal Request
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GENERATE PAYMENT LINK MODAL */}
      <AnimatePresence>
        {linkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#12141c] border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-[#3ecf8e]" />
                  Instant Payment Link
                </h3>
                <button onClick={() => setLinkModalOpen(false)} className="text-white/40 hover:text-white">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Invoice / Payment Description</label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    value={linkAmount}
                    onChange={(e) => setLinkAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1">Shareable Customer Checkout URL</label>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-[#3ecf8e] break-all">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://www.ocubyte.org'}/pay?merchant_code={activeMerchant?.merchant_code}&amount={linkAmount}&description={encodeURIComponent(linkTitle)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.ocubyte.org'}/pay?merchant_code=${activeMerchant?.merchant_code}&amount=${linkAmount}&description=${encodeURIComponent(linkTitle)}`;
                    copyToClipboard(link, 'modal_link');
                  }}
                  className="w-full py-3 bg-[#3ecf8e] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  {copiedKey === 'modal_link' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedKey === 'modal_link' ? 'Copied to Clipboard!' : 'Copy Payment Link'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
