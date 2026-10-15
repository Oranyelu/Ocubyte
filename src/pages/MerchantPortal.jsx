import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, 
  Copy, Check, ExternalLink, RefreshCw, Key, Landmark, 
  Clock, AlertCircle, FileText, PlusCircle, CheckCircle2, ChevronRight,
  Send, DollarSign, Download, Lock, Eye, EyeOff, Sparkles, UserCheck,
  LogOut, CreditCard, Link2
} from 'lucide-react';
import { 
  getMerchantByCode, 
  requestWithdrawal, 
  getMerchantWithdrawals, 
  getMerchantTransactions,
  supabase,
  isSupabaseConfigured 
} from '../lib/supabase';
import { getCurrentSession, logout } from '../lib/auth';
import Button from '../components/Button';

export default function MerchantPortal() {
  const navigate = useNavigate();
  const session = getCurrentSession();

  // Authentication Guard
  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
    } else if (session.role === 'super_admin') {
      navigate('/admin', { replace: true });
    }
  }, [session, navigate]);

  const [activeMerchant, setActiveMerchant] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'withdrawals', 'transactions', 'api_keys'
  
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

  // Load this specific merchant on mount
  useEffect(() => {
    if (session?.role === 'merchant') {
      loadMerchantProfile();
    }
  }, []);

  const loadMerchantProfile = async () => {
    setLoading(true);
    try {
      const merchantId = session?.user?.id || session?.merchantId;
      const merchantCode = session?.user?.merchant_code;
      const merchantEmail = session?.user?.email;

      let merchant = null;

      // 1. Try Supabase
      if (isSupabaseConfigured && supabase) {
        if (merchantId) {
          const { data } = await supabase.from('merchants').select('*').eq('id', merchantId).single();
          if (data) merchant = data;
        }
        if (!merchant && merchantEmail) {
          const { data } = await supabase.from('merchants').select('*').eq('email', merchantEmail).single();
          if (data) merchant = data;
        }
      }

      // 2. Fallback to getMerchantByCode
      if (!merchant && (merchantCode || merchantId)) {
        merchant = await getMerchantByCode(merchantCode || merchantId);
      }

      if (merchant) {
        setActiveMerchant(merchant);
        await loadMerchantFinancials(merchant.id);
      }
    } catch (e) {
      console.error('Error loading merchant profile:', e);
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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
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

    if (num > Number(activeMerchant.wallet_balance)) {
      alert(`Insufficient balance. Available: ₦${Number(activeMerchant.wallet_balance).toLocaleString()}`);
      return;
    }

    setIsSubmittingWithdraw(true);
    try {
      const res = await requestWithdrawal({
        merchantId: activeMerchant.id,
        amount: num,
        notes: withdrawNotes.trim()
      });

      if (res.success) {
        setWithdrawSuccessData(res.withdrawal);
        setWithdrawModalOpen(false);
        setWithdrawAmount('');
        setWithdrawNotes('');
        await loadMerchantProfile(); // Refresh balance and list
      } else {
        alert(res.error || 'Failed to submit withdrawal request.');
      }
    } catch (err) {
      alert(err.message || 'Error submitting withdrawal');
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  // Generate Customer Direct Payment Link (with MRN support)
  const handleGenerateLink = (e) => {
    e.preventDefault();
    if (!activeMerchant) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.ocubyte.org';
    const mrnSlug = `MRN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const url = `${origin}/pay?merchant_code=${encodeURIComponent(activeMerchant.merchant_code)}&amount=${encodeURIComponent(linkAmount)}&description=${encodeURIComponent(linkTitle)}&reference=${mrnSlug}`;
    setGeneratedLink(url);
  };

  if (!session || session.role !== 'merchant') {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-background text-text">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Merchant Authenticated Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#090d16]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-text">
                  {activeMerchant?.business_name || session.user.business_name || 'Merchant Dashboard'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-extrabold uppercase tracking-wider">
                  Verified Merchant
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Merchant Code: <span className="font-mono text-cyan-300 font-bold">{activeMerchant?.merchant_code || session.user.merchant_code}</span> &bull; {activeMerchant?.email || session.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadMerchantProfile}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-700/80 hover:border-accent text-muted hover:text-text transition flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-accent' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => { setLinkModalOpen(true); setGeneratedLink(''); }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-accent text-text hover:text-accent text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5 text-accent" />
              <span>Customer Link (MRN)</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Available Wallet Balance */}
          <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted text-xs font-semibold mb-2">
              <span>Available Wallet Balance</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ₦{Number(activeMerchant?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-muted">Ready for bank withdrawal</span>
              <button
                onClick={() => setWithdrawModalOpen(true)}
                className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
              >
                <span>Request Payout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Total Volume Processed */}
          <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted text-xs font-semibold mb-2">
              <span>Total Processed Volume</span>
              <ArrowDownRight className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              ₦{Number(activeMerchant?.total_volume || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-muted mt-2">
              Gross customer payments through Ocubyte
            </div>
          </div>

          {/* Card 3: Settlement Bank Account */}
          <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted text-xs font-semibold mb-2">
              <span>Settlement Bank Account</span>
              <Landmark className="w-4 h-4 text-accent" />
            </div>
            <div className="font-bold text-text text-sm">
              {activeMerchant?.bank_name || 'Bank not set'}
            </div>
            <div className="font-mono text-xs text-amber-300 font-bold mt-1">
              {activeMerchant?.account_number}
            </div>
            <div className="text-[11px] text-muted truncate mt-0.5">
              {activeMerchant?.account_name}
            </div>
          </div>

          {/* Card 4: Fee Rate & Protection */}
          <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted text-xs font-semibold mb-2">
              <span>Gateway Fee Rate</span>
              <ShieldCheck className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              {activeMerchant?.fee_percent || '1.50'}%
            </div>
            <div className="text-[11px] text-muted mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">Live</span> &bull; ₦50 flat transfer fee on payouts
            </div>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                : 'text-text/70 hover:text-text hover:bg-slate-900/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Balance & Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'transactions'
                ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                : 'text-text/70 hover:text-text hover:bg-slate-900/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Customer Payments ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'withdrawals'
                ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                : 'text-text/70 hover:text-text hover:bg-slate-900/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Withdrawal History ({withdrawals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('api_keys')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'api_keys'
                ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                : 'text-text/70 hover:text-text hover:bg-slate-900/60'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Keys & Credentials</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PAYOUTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Action & Quick Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Customer MRN Payment Link Card */}
              <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">Customer Payment Reference (MRN)</h3>
                    <p className="text-xs text-muted">Customers do NOT need an account to pay your business</p>
                  </div>
                </div>

                <p className="text-xs text-text/80 leading-relaxed mb-4">
                  Provide your customers with your unique Merchant Code (<span className="font-mono font-bold text-accent">{activeMerchant?.merchant_code}</span>) or generate a pre-filled invoice link. Customers simply open Ocubyte Pay, generate an official Merchant Reference Number (MRN), and pay instantly via Card, USSD, or Bank Transfer.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => { setLinkModalOpen(true); setGeneratedLink(''); }}
                    className="px-4 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs hover:opacity-90 transition flex items-center gap-1.5"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Generate Invoice Payment Link</span>
                  </button>
                  <Link
                    to={`/pay?merchant_code=${encodeURIComponent(activeMerchant?.merchant_code || '')}`}
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-text hover:border-accent text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <span>Open Public Payment Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Settlement Bank Details Card */}
              <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl">
                <h3 className="text-sm font-bold text-text mb-2 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-accent" />
                  <span>Verified Settlement Bank Account</span>
                </h3>
                <p className="text-xs text-muted mb-4">
                  Payouts requested from your wallet balance are reviewed and transferred directly to this Nigerian bank account by Ocubyte live treasury personnel.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-muted">Bank Name</div>
                    <div className="text-xs font-bold text-text mt-0.5">{activeMerchant?.bank_name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-muted">Account Number (NUBAN)</div>
                    <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">{activeMerchant?.account_number}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-muted">Account Holder</div>
                    <div className="text-xs font-semibold text-text mt-0.5 truncate">{activeMerchant?.account_name}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Instant Withdrawal Card */}
            <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-accent mb-2">
                  <Wallet className="w-4 h-4" />
                  <span>Request Bank Transfer</span>
                </div>
                <h3 className="text-base font-bold text-text mb-1">Live Human Payout</h3>
                <p className="text-xs text-muted mb-4">
                  Enter an amount to withdraw. The request is sent to Ocubyte Finance for direct bank transfer fulfillment.
                </p>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 space-y-1">
                  <div className="text-[11px] text-muted">Current Wallet Balance:</div>
                  <div className="text-xl font-black text-emerald-400">
                    ₦{Number(activeMerchant?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-accent text-primary font-bold text-xs hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Request Withdrawal to Bank</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-muted flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>Zero-Trust cryptographic financial ledger</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER PAYMENTS TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="bg-[#090d16]/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text">Customer Payment Transactions</h3>
                <p className="text-xs text-muted">All payments made to {activeMerchant?.business_name} with Merchant Reference Numbers</p>
              </div>
              <span className="text-xs text-muted font-mono">{transactions.length} Records</span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center text-muted text-xs">
                No customer payments recorded yet. Share your payment link to start receiving funds.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-muted uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Reference (MRN)</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Gross Paid</th>
                      <th className="py-3 px-4">Gateway Fee</th>
                      <th className="py-3 px-4">Net Credited</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4 font-bold text-text">{tx.reference}</td>
                        <td className="py-3.5 px-4 font-sans">
                          <div className="text-text font-medium">{tx.customer_name || 'Customer'}</div>
                          <div className="text-[10px] text-muted">{tx.customer_email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-text">
                          ₦{Number(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-rose-400">
                          ₦{Number(tx.fee || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-bold">
                          ₦{Number(tx.net_amount || (tx.amount - (tx.fee || 0))).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {tx.status || 'success'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans text-muted text-[11px]">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WITHDRAWAL HISTORY */}
        {activeTab === 'withdrawals' && (
          <div className="bg-[#090d16]/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text">Bank Withdrawal Requests</h3>
                <p className="text-xs text-muted">All withdrawal requests dispatched to Ocubyte Finance for live payout</p>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-accent text-primary text-xs font-bold hover:opacity-90 transition flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Request</span>
              </button>
            </div>

            {withdrawals.length === 0 ? (
              <div className="p-12 text-center text-muted text-xs">
                No withdrawal requests have been logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-muted uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4">Requested</th>
                      <th className="py-3 px-4">Fee</th>
                      <th className="py-3 px-4">Net Payout</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Bank Proof / Notes</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4 font-bold text-text">{w.reference}</td>
                        <td className="py-3.5 px-4 font-bold text-text">
                          ₦{Number(w.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-muted">
                          ₦{Number(w.fee || 50).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-400">
                          ₦{Number(w.net_payout || w.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            w.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : w.status === 'declined'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}>
                            {w.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-muted text-[11px]">
                          {w.proof_reference || w.admin_notes || 'Pending human disbursal'}
                        </td>
                        <td className="py-3.5 px-4 text-muted text-[11px] font-sans">
                          {new Date(w.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: API KEYS */}
        {activeTab === 'api_keys' && (
          <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-text">Ocubyte Gateway API Credentials</h3>
              <p className="text-xs text-muted">Use these keys to integrate your website, e-commerce store, or mobile application</p>
            </div>

            <div className="space-y-4">
              {/* Public Key */}
              <div>
                <label className="block text-xs font-semibold text-text/80 mb-1">
                  Public API Key (Client-Side)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={activeMerchant?.public_key || ''}
                    className="flex-1 px-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(activeMerchant?.public_key, 'pub')}
                    className="p-2.5 rounded-xl border border-slate-700 hover:border-accent text-text transition"
                    title="Copy Public Key"
                  >
                    {copiedKey === 'pub' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Secret Key */}
              <div>
                <label className="block text-xs font-semibold text-text/80 mb-1">
                  Secret API Key (Server-Side Strictly Protected)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    readOnly
                    value={activeMerchant?.secret_key || ''}
                    className="flex-1 px-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="p-2.5 rounded-xl border border-slate-700 hover:border-accent text-text transition"
                    title={showSecretKey ? 'Hide Secret Key' : 'Reveal Secret Key'}
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(activeMerchant?.secret_key, 'sec')}
                    className="p-2.5 rounded-xl border border-slate-700 hover:border-accent text-text transition"
                    title="Copy Secret Key"
                  >
                    {copiedKey === 'sec' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: REQUEST WITHDRAWAL */}
      <AnimatePresence>
        {withdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-8 text-text shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Request Bank Withdrawal</h3>
                  <p className="text-xs text-muted">Sent to Ocubyte Finance for live bank transfer</p>
                </div>
              </div>

              {/* Settlement Bank Reminder */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Available Balance:</span>
                  <span className="font-bold text-emerald-400">
                    ₦{Number(activeMerchant?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Destination Bank:</span>
                  <span className="font-semibold text-text">{activeMerchant?.bank_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">NUBAN Account:</span>
                  <span className="font-mono font-bold text-amber-300">{activeMerchant?.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Beneficiary Name:</span>
                  <span className="font-semibold text-text">{activeMerchant?.account_name}</span>
                </div>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text/80 mb-1.5">
                    Amount to Withdraw (₦) <span className="text-accent">*</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    max={activeMerchant?.wallet_balance || 0}
                    required
                    placeholder="e.g. 50000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text font-mono text-sm focus:outline-none focus:border-accent"
                  />
                  {withdrawAmount > 0 && (
                    <div className="text-[11px] text-muted mt-1.5 flex justify-between">
                      <span>Net Transfer to Receive:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ₦{Math.max(0, withdrawAmount - 50).toLocaleString()} (after ₦50 transfer fee)
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text/80 mb-1.5">
                    Notes for Finance Team (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Batch disbursement for vendor payroll"
                    value={withdrawNotes}
                    onChange={(e) => setWithdrawNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setWithdrawModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-muted hover:text-text text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmittingWithdraw}
                    className="py-2.5 px-5 text-xs font-bold"
                  >
                    {isSubmittingWithdraw ? 'Submitting Request...' : 'Confirm & Request Payout'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: GENERATE PAYMENT LINK WITH MRN */}
      <AnimatePresence>
        {linkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-8 text-text shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Link2 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Generate Customer Payment Link</h3>
                  <p className="text-xs text-muted">Pre-filled with an official Merchant Reference Number (MRN)</p>
                </div>
              </div>

              <form onSubmit={handleGenerateLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text/80 mb-1.5">
                    Invoice Title / Purpose
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Dues 2026 or Medical Supplies"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text/80 mb-1.5">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    placeholder="10000"
                    value={linkAmount}
                    onChange={(e) => setLinkAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text font-mono text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 text-xs font-bold"
                >
                  Generate Shareable Link with MRN
                </Button>
              </form>

              {generatedLink && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-accent">Customer Link Ready:</div>
                  <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-text/90 break-all border border-slate-800">
                    {generatedLink}
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedLink, 'link')}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-text font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    {copiedKey === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'link' ? 'Copied to Clipboard!' : 'Copy Payment Link'}</span>
                  </button>
                </div>
              )}

              <div className="flex justify-end pt-4 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-muted hover:text-text text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
