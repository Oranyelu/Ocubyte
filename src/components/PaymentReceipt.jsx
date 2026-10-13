import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Check, Printer, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/paystack';

const PaymentReceipt = ({ transaction, onDone, returnUrl, returnUrlText = 'Return to Merchant' }) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.reference || transaction.trxref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = transaction.timestamp 
    ? new Date(transaction.timestamp).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : new Date().toLocaleString();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto bg-secondary/90 border border-slate-700/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      {/* Decorative top ribbon */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent via-emerald-400 to-cyan-400" />

      {/* Success Badge */}
      <div className="flex flex-col items-center text-center pt-2 pb-6 border-b border-slate-700/50">
        <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent mb-3 shadow-[0_0_25px_rgba(62,207,142,0.4)]">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30 mb-2">
          Payment Successful
        </span>
        <h2 className="text-2xl font-bold text-text">Payment Confirmed</h2>
        <p className="text-xs text-muted mt-1">Transaction verified via Paystack Network</p>
        
        <div className="mt-4 text-3xl font-extrabold text-accent tracking-tight">
          {formatCurrency(transaction.amount, transaction.currency || 'NGN')}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="py-6 space-y-3.5 text-sm border-b border-slate-700/50">
        <div className="flex justify-between items-center text-xs text-muted">
          <span>Transaction Reference</span>
          <button 
            onClick={handleCopyRef} 
            className="flex items-center gap-1.5 font-mono text-accent hover:underline focus:outline-none"
            title="Copy reference"
          >
            <span>{transaction.reference}</span>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {transaction.merchantName && (
          <div className="flex justify-between items-center">
            <span className="text-muted">Merchant</span>
            <span className="font-semibold text-text">{transaction.merchantName}</span>
          </div>
        )}

        {transaction.merchantId && (
          <div className="flex justify-between items-center">
            <span className="text-muted">Merchant ID</span>
            <span className="font-mono text-xs text-muted">{transaction.merchantId}</span>
          </div>
        )}

        {transaction.customerName && (
          <div className="flex justify-between items-center">
            <span className="text-muted">Customer Name</span>
            <span className="text-text font-medium">{transaction.customerName}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-muted">Customer Email</span>
          <span className="text-text font-medium">{transaction.customerEmail}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted">Date & Time</span>
          <span className="text-muted text-xs">{formattedDate}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted">Payment Processor</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-text">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Paystack Inline
          </span>
        </div>

        {transaction.signature && (
          <div className="pt-2">
            <div className="flex justify-between items-center text-[11px] text-muted font-mono bg-primary/40 px-3 py-1.5 rounded-lg border border-slate-800">
              <span>Security Token</span>
              <span className="truncate max-w-[200px]" title={transaction.signature}>
                {transaction.signature}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Security Guarantee Footer */}
      <div className="py-4 flex items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck className="w-4 h-4 text-accent" />
        <span>256-Bit Encrypted • Verified Ocubyte Gateway</span>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 print:hidden">
        {returnUrl ? (
          <a
            href={returnUrl}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-primary font-bold hover:brightness-110 transition shadow-lg shadow-accent/20"
          >
            <span>{returnUrlText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          onDone && (
            <button
              onClick={onDone}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-primary font-bold hover:brightness-110 transition shadow-lg shadow-accent/20"
            >
              <span>Done</span>
            </button>
          )
        )}

        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800/60 text-text text-xs font-semibold transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print or Save PDF Receipt</span>
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentReceipt;
