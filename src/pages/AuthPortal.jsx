import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Landmark, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles,
  CreditCard,
  KeyRound,
  ChevronRight
} from 'lucide-react';
import { login, registerMerchantAccount, getCurrentSession, DEFAULT_ADMIN_EMAIL } from '../lib/auth';
import Button from '../components/Button';

// CBN Licensed Nigerian Banks
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

export default function AuthPortal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    business_name: '',
    email: '',
    password: '',
    phone: '',
    bank_name: 'Zenith Bank',
    account_number: '',
    account_name: ''
  });

  // If already logged in, redirect immediately
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      if (session.role === 'super_admin') {
        navigate('/admin', { replace: true });
      } else if (session.role === 'merchant') {
        navigate('/merchant/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  // Handle Sign In Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email: loginEmail, password: loginPassword });
      if (res.success) {
        setSuccessMessage('Authentication successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate(res.redirectUrl, { replace: true });
        }, 600);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Business Registration Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regForm.business_name || !regForm.email || !regForm.password || !regForm.account_number || !regForm.account_name) {
      setErrorMessage('Please fill in all mandatory business and bank account fields.');
      return;
    }

    if (regForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (regForm.account_number.length !== 10) {
      setErrorMessage('Nigerian NUBAN account number must be exactly 10 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerMerchantAccount(regForm);
      if (res.success) {
        setSuccessMessage('Merchant account registered successfully! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate(res.redirectUrl, { replace: true });
        }, 800);
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  // Quick autofill for local testing
  const autofillAdmin = () => {
    setLoginEmail(DEFAULT_ADMIN_EMAIL);
    setLoginPassword('OcubyteAdmin2026!');
    setErrorMessage('');
  };

  const autofillMerchant = () => {
    setLoginEmail('treasury@ohabuenyi.org');
    setLoginPassword('ObeagTreasury2026!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-background relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Customer Quick Pay Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mb-6 bg-slate-900/60 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Customer Notice</div>
            <div className="text-xs text-text/80">Paying a merchant with an MRN? No account is required.</div>
          </div>
        </div>
        <Link 
          to="/pay"
          className="shrink-0 px-3.5 py-1.5 rounded-xl bg-accent/15 border border-accent/30 text-accent hover:bg-accent hover:text-primary text-xs font-bold transition flex items-center gap-1"
        >
          <span>Pay with MRN</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-[#090d16]/90 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Financial-Grade Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            {mode === 'login' ? 'Ocubyte Access Portal' : 'Register Merchant Account'}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2">
            {mode === 'login'
              ? 'Enter your credentials to access your merchant or central admin dashboard.'
              : 'Set up your business to receive customer payments and request live bank withdrawals.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-accent text-primary shadow-md'
                : 'text-text/70 hover:text-text'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-accent text-primary shadow-md'
                : 'text-text/70 hover:text-text'
            }`}
          >
            Register Business
          </button>
        </div>

        {/* Alert Messages */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM 1: SIGN IN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@ocubyte.org or your business email"
                  className="w-full pl-11 pr-4 py-3 bg-secondary/80 border border-slate-800 rounded-xl text-text text-sm focus:outline-none focus:border-accent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text/80 mb-2">
                Account Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your secret password"
                  className="w-full pl-11 pr-11 py-3 bg-secondary/80 border border-slate-800 rounded-xl text-text text-sm focus:outline-none focus:border-accent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Quick Demo Credentials Assistant */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-accent" />
                <span>Quick Access Shortcuts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={autofillAdmin}
                  className="p-3 text-left rounded-xl bg-slate-900/60 border border-slate-800 hover:border-accent/40 transition group"
                >
                  <div className="text-xs font-bold text-accent group-hover:underline">Ocubyte HQ Admin</div>
                  <div className="text-[10px] text-muted truncate">admin@ocubyte.org</div>
                </button>
                <button
                  type="button"
                  onClick={autofillMerchant}
                  className="p-3 text-left rounded-xl bg-slate-900/60 border border-slate-800 hover:border-accent/40 transition group"
                >
                  <div className="text-xs font-bold text-cyan-400 group-hover:underline">OBEAG Merchant</div>
                  <div className="text-[10px] text-muted truncate">treasury@ohabuenyi.org</div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* FORM 2: REGISTER BUSINESS */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text/80 mb-1.5">
                Registered Business / Company Name <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health Logistics Ltd"
                  value={regForm.business_name}
                  onChange={(e) => setRegForm({ ...regForm, business_name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text text-sm focus:outline-none focus:border-accent transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text/80 mb-1.5">
                  Official Business Email <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="finance@apexhealth.ng"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text text-sm focus:outline-none focus:border-accent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text/80 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text text-sm focus:outline-none focus:border-accent transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text/80 mb-1.5">
                Account Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a strong account password"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-secondary/80 border border-slate-800 rounded-xl text-text text-sm focus:outline-none focus:border-accent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Settlement Bank Information */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-accent">
                <Landmark className="w-4 h-4" />
                <span>Withdrawal Settlement Bank (For Live Human Payout)</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text/70 mb-1">
                  Nigerian Bank Name <span className="text-accent">*</span>
                </label>
                <select
                  value={regForm.bank_name}
                  onChange={(e) => setRegForm({ ...regForm, bank_name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/80 border border-slate-800 rounded-xl text-text text-xs focus:outline-none focus:border-accent"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b} value={b} className="bg-slate-900 text-text">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text/70 mb-1">
                    10-Digit NUBAN Account Number <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    required
                    placeholder="0123456789"
                    value={regForm.account_number}
                    onChange={(e) => setRegForm({ ...regForm, account_number: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 bg-secondary/80 border border-slate-800 rounded-xl text-text text-xs font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text/70 mb-1">
                    Account Holder Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apex Health Logistics"
                    value={regForm.account_name}
                    onChange={(e) => setRegForm({ ...regForm, account_name: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary/80 border border-slate-800 rounded-xl text-text text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Registering Merchant Account...</span>
              ) : (
                <>
                  <span>Create Merchant Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
