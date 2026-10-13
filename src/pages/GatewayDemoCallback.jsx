import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Store, 
  ShieldCheck, 
  Package, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  Code,
  Users,
  Check,
  AlertTriangle,
  Server
} from 'lucide-react';
import { formatCurrency, verifyGatewayTransaction } from '../utils/paystack';

const GatewayDemoCallback = () => {
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status') || 'pending';
  const reference = searchParams.get('reference') || '';
  const trxref = searchParams.get('trxref') || '';
  const amount = Number(searchParams.get('amount')) || 0;
  const currency = searchParams.get('currency') || 'NGN';
  const merchantId = searchParams.get('merchant_id') || 'affiliate_store';
  const timestamp = searchParams.get('timestamp') || new Date().toISOString();
  const signature = searchParams.get('sig') || '';

  // Server verification state
  const [serverVerification, setServerVerification] = useState({
    loading: true,
    verified: false,
    data: null,
    error: null
  });

  const isObeag = merchantId === 'obeag_portal' || merchantId.toLowerCase().includes('obeag');
  const merchantTitle = isObeag ? 'OHA BU ENYI AGE GRADE (OBEAG)' : 'Nexus Electronics';
  const subCategory = isObeag ? 'Members Dues & Levies Portal' : 'Affiliated Storefront';

  useEffect(() => {
    let isMounted = true;
    if (reference) {
      verifyGatewayTransaction(reference, merchantId)
        .then((res) => {
          if (!isMounted) return;
          if (res && res.verified) {
            setServerVerification({ loading: false, verified: true, data: res, error: null });
          } else {
            setServerVerification({ loading: false, verified: false, data: res, error: res?.error || 'Verification pending' });
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          setServerVerification({ loading: false, verified: false, data: null, error: err.message });
        });
    } else {
      setServerVerification({ loading: false, verified: false, data: null, error: 'No reference' });
    }
    return () => { isMounted = false; };
  }, [reference, merchantId]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-3xl space-y-8">
      {/* Affiliated Store / Organization Header */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
        isObeag 
          ? 'bg-blue-950/40 border-blue-800/70 text-blue-200' 
          : 'bg-secondary/80 border-slate-700/80 text-muted'
      }`}>
        <div className="flex items-center gap-2">
          {isObeag ? <Users className="w-4 h-4 text-accent" /> : <Store className="w-4 h-4 text-accent" />}
          <span className="font-bold text-text">{merchantTitle}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 font-mono">
          {subCategory}
        </span>
      </div>

      {/* Confirmation Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-secondary/90 border border-slate-700 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent text-accent mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(62,207,142,0.3)]">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30">
            Payment Completed & Authenticated
          </span>
          <h1 className="text-3xl font-extrabold text-text">
            {isObeag ? 'OBEAG Member Contribution Reconciled!' : 'Order Confirmed at Nexus Store!'}
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
            {isObeag 
              ? 'Annual dues / levy contribution was processed via Ocubyte Gateway and verified by the OBEAG financial ledger.'
              : 'Payment was successfully processed through Ocubyte Gateway via Paystack and verified by this merchant website.'
            }
          </p>
        </div>

        {/* 100% Security Validation Banner */}
        <div className="p-4 rounded-2xl bg-primary/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-text">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Server-to-Server Verification (/api/gateway-verify)</span>
            </div>
            {serverVerification.loading ? (
              <span className="text-muted flex items-center gap-1 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Validating with backend...
              </span>
            ) : serverVerification.verified ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                100% Verified by Backend
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400">
                Sandbox Mock Verified
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded-lg bg-secondary/80 border border-slate-800">
              <div className="text-muted text-[10px]">1. Client Callback</div>
              <div className="font-semibold text-accent flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" /> Received
              </div>
            </div>
            <div className="p-2 rounded-lg bg-secondary/80 border border-slate-800">
              <div className="text-muted text-[10px]">2. Secret Key Query</div>
              <div className="font-semibold text-accent flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" /> Verified
              </div>
            </div>
            <div className="p-2 rounded-lg bg-secondary/80 border border-slate-800">
              <div className="text-muted text-[10px]">3. HMAC Signature</div>
              <div className="font-semibold text-accent flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" /> Valid Token
              </div>
            </div>
            <div className="p-2 rounded-lg bg-secondary/80 border border-slate-800">
              <div className="text-muted text-[10px]">4. Database Ledger</div>
              <div className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" /> Safe to Credit
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-5 rounded-2xl bg-primary/50 border border-slate-800 space-y-3.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted">Payment Status</span>
            <span className="font-bold text-accent uppercase tracking-wider">SUCCESS / SETTLED</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted">Amount Paid</span>
            <span className="text-base font-extrabold text-text font-mono">
              {formatCurrency(amount, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted">Transaction Reference</span>
            <span className="font-mono text-accent">{reference || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted">Merchant ID</span>
            <span className="font-mono text-text">{merchantId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted">Timestamp</span>
            <span className="text-muted text-xs">{new Date(timestamp).toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/gateway"
            className="px-6 py-3 rounded-xl bg-accent text-primary font-bold text-xs hover:brightness-110 transition shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Open Gateway Simulator & API Docs</span>
          </Link>

          <Link
            to="/pay"
            className="px-6 py-3 rounded-xl border border-slate-700 text-xs font-semibold text-text hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <span>Direct Ocubyte Pay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default GatewayDemoCallback;
