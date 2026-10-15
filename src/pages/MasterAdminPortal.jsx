import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Landmark,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  ExternalLink,
  DollarSign,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  UserCheck,
  Layers,
  CreditCard
} from 'lucide-react';
import { getCurrentSession, logout } from '../lib/auth';
import { 
  getAllMerchants, 
  getAllWithdrawals, 
  getAllTransactions, 
  completeWithdrawal, 
  declineWithdrawal 
} from '../lib/supabase';
import Button from '../components/Button';

export default function MasterAdminPortal() {
  const navigate = useNavigate();
  const session = getCurrentSession();

  // Guard: Strictly Super Admin
  useEffect(() => {
    if (!session || session.role !== 'super_admin') {
      navigate('/login', { replace: true });
    }
  }, [session, navigate]);

  const [activeTab, setActiveTab] = useState('withdrawals'); // 'withdrawals' | 'merchants' | 'transactions'
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [copiedText, setCopiedText] = useState(null);

  // Modals
  const [fulfillModal, setFulfillModal] = useState(null); // withdrawal item
  const [proofReference, setProofReference] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmittingFulfill, setIsSubmittingFulfill] = useState(false);

  const [declineModal, setDeclineModal] = useState(null); // withdrawal item
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmittingDecline, setIsSubmittingDecline] = useState(false);

  // Success / error flash
  const [bannerNotice, setBannerNotice] = useState(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [merchList, wthList, txList] = await Promise.all([
        getAllMerchants(),
        getAllWithdrawals(),
        getAllTransactions()
      ]);
      setMerchants(merchList || []);
      setWithdrawals(wthList || []);
      setTransactions(txList || []);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.role === 'super_admin') {
      loadAdminData();
    }
  }, []);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Submit Payout Fulfillment
  const handleFulfillSubmit = async (e) => {
    e.preventDefault();
    if (!fulfillModal) return;
    setIsSubmittingFulfill(true);
    try {
      const res = await completeWithdrawal({
        withdrawalId: fulfillModal.id,
        proofReference: proofReference.trim() || `TRF-MANUAL-${Date.now()}`,
        adminNotes: adminNotes.trim(),
        adminName: session?.user?.name || 'Ocubyte Central Admin'
      });
      if (res.success) {
        setBannerNotice({ type: 'success', text: `Withdrawal ${fulfillModal.reference} marked as completed & disbursed!` });
        setFulfillModal(null);
        setProofReference('');
        setAdminNotes('');
        await loadAdminData();
      } else {
        alert(res.error || 'Failed to complete withdrawal');
      }
    } catch (err) {
      alert(err.message || 'Error completing withdrawal');
    } finally {
      setIsSubmittingFulfill(false);
    }
  };

  // Submit Decline & Refund
  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    if (!declineModal) return;
    setIsSubmittingDecline(true);
    try {
      const res = await declineWithdrawal({
        withdrawalId: declineModal.id,
        reason: declineReason.trim() || 'Bank account details mismatch',
        adminName: session?.user?.name || 'Ocubyte Central Admin'
      });
      if (res.success) {
        setBannerNotice({ type: 'info', text: `Withdrawal ${declineModal.reference} declined and ₦${Number(declineModal.amount).toLocaleString()} refunded to merchant!` });
        setDeclineModal(null);
        setDeclineReason('');
        await loadAdminData();
      } else {
        alert(res.error || 'Failed to decline withdrawal');
      }
    } catch (err) {
      alert(err.message || 'Error declining withdrawal');
    } finally {
      setIsSubmittingDecline(false);
    }
  };

  // Calculations
  const totalVolume = merchants.reduce((sum, m) => sum + (Number(m.total_volume) || 0), 0);
  const totalPlatformFees = merchants.reduce((sum, m) => {
    const vol = Number(m.total_volume) || 0;
    const rate = (Number(m.fee_percent) || 1.5) / 100;
    return sum + (vol * rate);
  }, 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending_review' || w.status === 'processing');
  const pendingPayoutTotal = pendingWithdrawals.reduce((sum, w) => sum + (Number(w.net_payout) || Number(w.amount) || 0), 0);

  if (!session || session.role !== 'super_admin') {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-background text-text">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Operational Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#090d16]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-text">
                  Ocubyte Central Financial Command
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
                  Master Admin
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Logged in as <span className="font-semibold text-text">{session.user.email}</span> &bull; Real live human bank payout desk & platform audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-700/80 hover:border-accent text-muted hover:text-text transition flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-accent' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              to="/pay"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-accent text-text hover:text-accent text-xs font-semibold transition flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Customer MRN Portal</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Alert Notification Banner */}
        <AnimatePresence>
          {bannerNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between gap-3 shadow-lg ${
                bannerNotice.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bannerNotice.text}</span>
              </div>
              <button 
                onClick={() => setBannerNotice(null)}
                className="text-xs underline hover:opacity-80"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Financial Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Platform Volume */}
          <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted text-xs font-semibold mb-2">
              <span>Total Processed Volume</span>
              <Layers className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              ₦{totalVolume.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-muted mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">100% verified</span> across all merchant integrations
            </div>
          </div>

          {/* Card 2: Platform Revenue */}
          <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted text-xs font-semibold mb-2">
              <span>Ocubyte Revenue (1.5%)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ₦{totalPlatformFees.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-muted mt-2">
              Accumulated gateway processing commissions
            </div>
          </div>

          {/* Card 3: Active Merchants */}
          <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted text-xs font-semibold mb-2">
              <span>Registered Merchants</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              {merchants.length}
            </div>
            <div className="text-[11px] text-muted mt-2 flex items-center gap-1">
              <span className="text-cyan-400 font-semibold">{merchants.filter(m => m.status === 'active').length} active</span> settlement entities
            </div>
          </div>

          {/* Card 4: Pending Payout Desk */}
          <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all ${
            pendingWithdrawals.length > 0 
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-lg shadow-amber-500/5' 
              : 'bg-[#090d16]/80 border-slate-800 text-text'
          }`}>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span>Pending Human Payouts</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-400">
              {pendingWithdrawals.length} <span className="text-sm font-normal text-muted">requests</span>
            </div>
            <div className="text-[11px] mt-2 font-mono font-bold">
              ₦{pendingPayoutTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })} awaiting bank transfer
            </div>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'withdrawals'
                ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                : 'text-text/70 hover:text-text hover:bg-slate-900/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Withdrawals Desk</span>
            {pendingWithdrawals.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'merchants'
                ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                : 'text-text/70 hover:text-text hover:bg-slate-900/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Merchants Directory</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-text text-[10px] font-bold">
              {merchants.length}
            </span>
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
            <span>Platform Transactions Ledger</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-text text-[10px] font-bold">
              {transactions.length}
            </span>
          </button>
        </div>

        {/* TAB 1: WITHDRAWALS DESK */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-text">Merchant Withdrawal Requests</h2>
                <p className="text-xs text-muted">
                  When a merchant requests a withdrawal, their wallet balance is deducted atomically. A real live person reviews the destination Nigerian bank account, completes the bank transfer, and documents the transfer reference.
                </p>
              </div>
            </div>

            {/* Pending Requests Section */}
            {pendingWithdrawals.length > 0 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Action Required: Pending Live Human Disbursals ({pendingWithdrawals.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingWithdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-6 rounded-3xl bg-amber-500/[0.04] border border-amber-500/30 backdrop-blur-xl relative flex flex-col justify-between gap-6 shadow-xl"
                    >
                      <div>
                        {/* Top Reference & Time */}
                        <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-3 mb-4">
                          <span className="font-mono text-xs font-bold text-amber-300">
                            {w.reference}
                          </span>
                          <span className="text-[11px] text-muted">
                            {new Date(w.created_at).toLocaleString()}
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                          <div className="text-[11px] text-muted uppercase font-semibold">Net Payout to Transfer</div>
                          <div className="text-3xl font-black text-text tracking-tight">
                            ₦{Number(w.net_payout || w.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[11px] text-muted mt-0.5">
                            Gross: ₦{Number(w.amount).toLocaleString()} &bull; Transfer Fee: ₦{Number(w.fee || 50).toLocaleString()}
                          </div>
                        </div>

                        {/* Merchant Details */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 mb-4">
                          <div className="text-xs font-bold text-text">
                            {w.merchant?.business_name || 'Registered Business'}
                          </div>
                          <div className="text-[11px] text-muted">
                            {w.merchant?.email} &bull; {w.merchant?.phone || 'No phone'}
                          </div>
                        </div>

                        {/* Destination Bank Account */}
                        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-muted text-[11px]">
                            <span>Destination Bank</span>
                            <span className="font-bold text-text">{w.bank_name}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted text-[11px]">NUBAN Account</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-amber-300 text-sm tracking-wider">
                                {w.account_number}
                              </span>
                              <button
                                onClick={() => handleCopy(w.account_number, `acc_${w.id}`)}
                                className="p-1 text-muted hover:text-accent"
                                title="Copy Account Number"
                              >
                                {copiedText === `acc_${w.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted text-[11px]">Beneficiary Name</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-text truncate max-w-[200px]">
                                {w.account_name}
                              </span>
                              <button
                                onClick={() => handleCopy(w.account_name, `name_${w.id}`)}
                                className="p-1 text-muted hover:text-accent"
                                title="Copy Beneficiary Name"
                              >
                                {copiedText === `name_${w.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => { setFulfillModal(w); setProofReference(''); setAdminNotes(''); }}
                          className="py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark as Paid</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setDeclineModal(w); setDeclineReason(''); }}
                          className="py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs hover:bg-rose-500 hover:text-white transition flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline & Refund</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Withdrawals Table (History) */}
            <div className="bg-[#090d16]/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-text">Withdrawal Records & Historical Payouts</h3>
                <span className="text-xs text-muted font-mono">{withdrawals.length} Total Records</span>
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
                        <th className="py-3 px-4">Merchant</th>
                        <th className="py-3 px-4">Net Payout</th>
                        <th className="py-3 px-4">Destination Bank</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Processed Proof</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-900/40 transition">
                          <td className="py-3.5 px-4 font-bold text-text">{w.reference}</td>
                          <td className="py-3.5 px-4 font-sans">
                            <div className="font-semibold text-text">{w.merchant?.business_name || 'Business'}</div>
                            <div className="text-[10px] text-muted">{w.merchant?.merchant_code}</div>
                          </td>
                          <td className="py-3.5 px-4 font-black text-text">
                            ₦{Number(w.net_payout || w.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-4 font-sans">
                            <div className="text-text font-medium">{w.bank_name}</div>
                            <div className="text-[10px] text-muted font-mono">{w.account_number} ({w.account_name})</div>
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
                            {w.proof_reference || w.admin_notes || '—'}
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
          </div>
        )}

        {/* TAB 2: MERCHANTS DIRECTORY */}
        {activeTab === 'merchants' && (
          <div className="bg-[#090d16]/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text">Registered Merchants Directory</h3>
                <p className="text-xs text-muted">All business entities integrated into the Ocubyte payment gateway</p>
              </div>
              <span className="text-xs text-muted font-mono">{merchants.length} Registered</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-muted uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Business Details</th>
                    <th className="py-3 px-4">Merchant Code</th>
                    <th className="py-3 px-4">Settlement Bank</th>
                    <th className="py-3 px-4">Wallet Balance</th>
                    <th className="py-3 px-4">Total Volume</th>
                    <th className="py-3 px-4">Fee %</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {merchants.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-4 px-4">
                        <div className="font-bold text-text">{m.business_name}</div>
                        <div className="text-[11px] text-muted">{m.email} &bull; {m.phone || 'No phone'}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-cyan-400 font-bold">
                        {m.merchant_code}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-text">{m.bank_name}</div>
                        <div className="font-mono text-muted text-[11px]">{m.account_number} ({m.account_name})</div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-emerald-400">
                        ₦{Number(m.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-text">
                        ₦{Number(m.total_volume || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 font-mono text-muted">
                        {m.fee_percent || '1.5'}%
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {m.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PLATFORM TRANSACTIONS LEDGER */}
        {activeTab === 'transactions' && (
          <div className="bg-[#090d16]/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text">Platform Master Transactions Ledger</h3>
                <p className="text-xs text-muted">All customer inbound payments with Merchant Reference Numbers (MRN)</p>
              </div>
              <span className="text-xs text-muted font-mono">{transactions.length} Records</span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center text-muted text-xs">
                No customer transactions recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-muted uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Reference (MRN)</th>
                      <th className="py-3 px-4">Merchant</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Gross Amount</th>
                      <th className="py-3 px-4">Fee (1.5%)</th>
                      <th className="py-3 px-4">Net Credited</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4 font-bold text-text">{tx.reference}</td>
                        <td className="py-3.5 px-4 font-sans font-medium text-text">
                          {tx.merchant?.business_name || tx.merchant_id || 'Ocubyte Direct'}
                        </td>
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

      </div>

      {/* MODAL 1: MARK WITHDRAWAL AS PAID / DISBURSED */}
      <AnimatePresence>
        {fulfillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-8 text-text shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Fulfill Live Merchant Payout</h3>
                  <p className="text-xs text-muted">Complete the bank transfer, then document proof</p>
                </div>
              </div>

              {/* Payout Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Merchant:</span>
                  <span className="font-bold text-text">{fulfillModal.merchant?.business_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Net Transfer Amount:</span>
                  <span className="font-black text-emerald-400 text-sm">
                    ₦{Number(fulfillModal.net_payout || fulfillModal.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Destination Bank:</span>
                  <span className="font-semibold text-text">{fulfillModal.bank_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">NUBAN Account:</span>
                  <span className="font-mono font-bold text-amber-300">{fulfillModal.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Beneficiary Name:</span>
                  <span className="font-semibold text-text">{fulfillModal.account_name}</span>
                </div>
              </div>

              <form onSubmit={handleFulfillSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text/80 mb-1.5">
                    Bank Transfer Session ID / Reference <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZNB-NIP-99881122 or Transfer Ref"
                    value={proofReference}
                    onChange={(e) => setProofReference(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text font-mono text-xs focus:outline-none focus:border-accent"
                  />
                  <p className="text-[11px] text-muted mt-1">
                    Proof from your banking application verifying the funds left Ocubyte account.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text/80 mb-1.5">
                    Admin Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Disbursed via Zenith Corporate Banking"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFulfillModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-muted hover:text-text text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmittingFulfill}
                    className="py-2.5 px-5 text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  >
                    {isSubmittingFulfill ? 'Recording Disbursal...' : 'Confirm Disbursal & Mark Paid'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DECLINE WITHDRAWAL & REFUND BALANCE */}
      <AnimatePresence>
        {declineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#090d16] border border-slate-800 rounded-3xl p-6 sm:p-8 text-text shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Decline Withdrawal & Refund Merchant</h3>
                  <p className="text-xs text-muted">Restores ₦{Number(declineModal.amount).toLocaleString()} back to merchant wallet</p>
                </div>
              </div>

              <form onSubmit={handleDeclineSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text/80 mb-1.5">
                    Decline Reason <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Account name mismatch: Provided name does not match the bank verified account holder."
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="w-full p-3 bg-secondary/80 border border-slate-800 rounded-xl text-text text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDeclineModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-muted hover:text-text text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmittingDecline}
                    className="py-2.5 px-5 text-xs font-bold bg-rose-500 text-white hover:bg-rose-400"
                  >
                    {isSubmittingDecline ? 'Processing Refund...' : 'Decline & Refund Balance'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
