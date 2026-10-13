import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ArrowRight, 
  Code, 
  Copy, 
  Check, 
  Play, 
  ShieldCheck, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Store, 
  Receipt, 
  Search, 
  Sparkles,
  Link as LinkIcon,
  Zap,
  Globe,
  Users,
  Server
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  formatCurrency, 
  getRecordedTransactions, 
  getPaystackPublicKey 
} from '../utils/paystack';
import PaymentReceipt from '../components/PaymentReceipt';

const GatewayPortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'generator', 'docs', 'explorer'
  const [copiedField, setCopiedField] = useState(null);
  const [simulatorProfile, setSimulatorProfile] = useState('obeag'); // 'obeag' | 'ecommerce'

  // Link Generator State
  const [merchantName, setMerchantName] = useState('OHA BU ENYI AGE GRADE (OBEAG)');
  const [merchantId, setMerchantId] = useState('obeag_portal');
  const [productTitle, setProductTitle] = useState('Annual Membership Dues 2026');
  const [productAmount, setProductAmount] = useState(20000);
  const [currency, setCurrency] = useState('NGN');
  const [callbackUrl, setCallbackUrl] = useState('/gateway/demo-callback');
  const [customerEmail, setCustomerEmail] = useState('member@obeag.org');
  const [customerName, setCustomerName] = useState('Chief Emeka Okafor');

  const loadObeagPreset = () => {
    setMerchantName('OHA BU ENYI AGE GRADE (OBEAG)');
    setMerchantId('obeag_portal');
    setProductTitle('Annual Membership Dues 2026');
    setProductAmount(20000);
    setCurrency('NGN');
    setCallbackUrl('/gateway/demo-callback');
    setCustomerEmail('member@obeag.org');
    setCustomerName('Chief Emeka Okafor');
  };

  const loadEcommercePreset = () => {
    setMerchantName('Nexus Electronics');
    setMerchantId('nexus_electronics');
    setProductTitle('SonicPulse ANC Headphones');
    setProductAmount(45000);
    setCurrency('NGN');
    setCallbackUrl('/gateway/demo-callback');
    setCustomerEmail('alex@example.com');
    setCustomerName('Alex Carter');
  };

  // Transaction Explorer State
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    setTransactions(getRecordedTransactions());
  }, [activeTab]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Generate checkout URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.ocubyte.org';
  const generatedCheckoutUrl = `${baseUrl}/gateway/checkout?merchant_id=${encodeURIComponent(merchantId)}&merchant_name=${encodeURIComponent(merchantName)}&amount=${productAmount}&currency=${currency}&title=${encodeURIComponent(productTitle)}&customer_email=${encodeURIComponent(customerEmail)}&customer_name=${encodeURIComponent(customerName)}&callback_url=${encodeURIComponent(callbackUrl)}`;

  // Code snippets
  const htmlButtonSnippet = `<!-- Add this button to your website -->
<a 
  href="${generatedCheckoutUrl}" 
  style="background:#3ecf8e; color:#0c0d10; padding:12px 24px; border-radius:12px; font-weight:bold; text-decoration:none; display:inline-block;"
>
  Pay with Ocubyte Gateway
</a>`;

  const jsRedirectSnippet = `// In your website's checkout handler:
function checkoutWithOcubyte() {
  const checkoutUrl = "${generatedCheckoutUrl}";
  window.location.href = checkoutUrl;
}`;

  const iframeSnippet = `<!-- Embed in popup or iframe with instant postMessage confirmation -->
<iframe src="${generatedCheckoutUrl}" width="100%" height="650px" frameborder="0"></iframe>

<script>
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'OCUBYTE_PAYMENT_SUCCESS') {
    console.log('Payment verified from Ocubyte Gateway:', event.data);
    // event.data contains: { reference, trxref, amount, merchant_id, signature }
    alert('Payment confirmed for ' + event.data.reference);
  }
});
</script>`;

  // Filtered transactions
  const filteredTxs = transactions.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.reference && t.reference.toLowerCase().includes(q)) ||
      (t.merchantName && t.merchantName.toLowerCase().includes(q)) ||
      (t.customerEmail && t.customerEmail.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
          <Building2 className="w-4 h-4" />
          <span>Ocubyte Affiliate Payment Gateway</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Payment Gateway <span className="text-accent">Hub & API</span>
        </h1>
        <p className="text-muted text-base sm:text-lg">
          Enable any third-party affiliated website or store to receive payments via Ocubyte's secure Paystack gateway infrastructure.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'simulator' 
                ? 'bg-accent text-primary shadow-lg shadow-accent/20' 
                : 'bg-secondary/60 text-muted hover:text-text border border-slate-700/60'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Store Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'generator' 
                ? 'bg-accent text-primary shadow-lg shadow-accent/20' 
                : 'bg-secondary/60 text-muted hover:text-text border border-slate-700/60'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Payment Link Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'docs' 
                ? 'bg-accent text-primary shadow-lg shadow-accent/20' 
                : 'bg-secondary/60 text-muted hover:text-text border border-slate-700/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer API Docs</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'explorer' 
                ? 'bg-accent text-primary shadow-lg shadow-accent/20' 
                : 'bg-secondary/60 text-muted hover:text-text border border-slate-700/60'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Gateway Transactions ({transactions.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Store Simulator */}
      {activeTab === 'simulator' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Explanation Banner */}
          <div className="bg-secondary/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="font-bold text-base text-text flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>How the Third-Party Affiliate Payment Flow Works</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="p-4 rounded-2xl bg-primary/40 border border-slate-800 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="font-bold text-text text-sm">Affiliate Website Initiates</h4>
                <p className="text-muted leading-relaxed">
                  Third-party store redirects customer to Ocubyte Gateway with order amount, merchant ID, and callback URL.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-primary/40 border border-slate-800 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="font-bold text-text text-sm">Customer Pays on Ocubyte</h4>
                <p className="text-muted leading-relaxed">
                  Customer completes payment securely via Paystack on Ocubyte with 256-bit encryption.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-primary/40 border border-slate-800 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="font-bold text-text text-sm">Instant Confirmation Returned</h4>
                <p className="text-muted leading-relaxed">
                  Ocubyte automatically redirects customer back to the affiliate website with verified status and signature!
                </p>
              </div>
            </div>
          </div>

          {/* Simulator Profile Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/80 border border-slate-700/80">
            <div className="text-xs">
              <span className="text-muted">Choose Simulation Scenario:</span>
              <span className="font-bold text-text ml-2">
                {simulatorProfile === 'obeag' ? 'OBEAG Tracker & Portal (Dues Collection)' : 'Nexus E-Commerce Store (Retail Cart)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulatorProfile('obeag')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  simulatorProfile === 'obeag'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-primary/50 text-muted hover:text-text border border-slate-700'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>OBEAG Member Portal</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulatorProfile('ecommerce')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  simulatorProfile === 'ecommerce'
                    ? 'bg-accent text-primary shadow-md shadow-accent/20'
                    : 'bg-primary/50 text-muted hover:text-text border border-slate-700'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Nexus Retail Store</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulated Storefront / Portal */}
          <div className={`border rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6 ${
            simulatorProfile === 'obeag'
              ? 'bg-gradient-to-b from-blue-950/40 via-secondary/70 to-secondary/50 border-blue-800/60'
              : 'bg-gradient-to-b from-secondary/80 to-secondary/50 border-slate-700'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                  simulatorProfile === 'obeag'
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                    : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                }`}>
                  {simulatorProfile === 'obeag' ? <Users className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xl text-text">
                      {simulatorProfile === 'obeag' ? 'OHA BU ENYI AGE GRADE (OBEAG)' : 'Nexus Electronics'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      simulatorProfile === 'obeag' ? 'bg-blue-500/20 text-blue-300' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {simulatorProfile === 'obeag' ? 'OBEAG Portal Simulator' : 'External Store Simulator'}
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    {simulatorProfile === 'obeag'
                      ? 'Simulated Financial Contribution & Annual Dues Reconciliation System'
                      : 'Simulated Third-Party E-commerce Website Checkout Cart'
                    }
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-muted">Gateway Link Status</div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected to Ocubyte Gateway
                </div>
              </div>
            </div>

            {/* Simulated Item Cart / Dues Assessment */}
            <div className="grid md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 p-6 rounded-2xl bg-primary/50 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-muted">
                      {simulatorProfile === 'obeag' ? 'LEVY CODE: OBEAG-2026-DUES' : 'SKU: NEX-48902'}
                    </span>
                    <h4 className="font-bold text-lg text-text">
                      {simulatorProfile === 'obeag' ? 'Annual Membership Dues & Welfare Levy 2026' : 'SonicPulse ANC Wireless Headphones'}
                    </h4>
                    <p className="text-xs text-muted">
                      {simulatorProfile === 'obeag'
                        ? 'Includes constitutional dues, member welfare allocation, and community development levy'
                        : 'Active Noise Cancelling, 40-hour Battery Life, Spatial Audio'
                      }
                    </p>
                  </div>
                  <div className="text-right font-mono font-bold text-xl text-text">
                    {simulatorProfile === 'obeag' ? '₦20,000' : '₦45,000'}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <span>{simulatorProfile === 'obeag' ? 'Member Email:' : 'Customer Email:'}</span>
                    <span className="bg-secondary px-3 py-1.5 rounded-lg border border-slate-700 text-text font-mono text-xs">
                      {simulatorProfile === 'obeag' ? 'member@obeag.org' : customerEmail}
                    </span>
                  </div>
                  <div className="font-semibold text-text">
                    Total Due: <span className="font-mono text-accent text-sm">
                      {simulatorProfile === 'obeag' ? '₦20,000' : '₦45,000'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="md:col-span-4 space-y-3">
                <Link
                  to={simulatorProfile === 'obeag'
                    ? `/gateway/checkout?merchant_id=obeag_portal&merchant_name=OHA+BU+ENYI+AGE+GRADE+(OBEAG)&amount=20000&currency=NGN&reference=OBEAG-2026-049&title=Annual+Membership+Dues+2026&customer_name=Chief+Emeka+Okafor&customer_email=member@obeag.org&callback_url=/gateway/demo-callback`
                    : `/gateway/checkout?merchant_id=nexus_electronics&merchant_name=Nexus+Electronics&amount=45000&currency=NGN&reference=NEX-CART-1082&title=SonicPulse+ANC+Headphones&customer_email=${encodeURIComponent(customerEmail)}&customer_name=Alex+Carter&callback_url=/gateway/demo-callback`
                  }
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm hover:brightness-110 active:scale-[0.99] transition shadow-lg flex items-center justify-center gap-2 ${
                    simulatorProfile === 'obeag'
                      ? 'bg-blue-600 text-white shadow-blue-600/30'
                      : 'bg-accent text-primary shadow-accent/25'
                  }`}
                >
                  <span>{simulatorProfile === 'obeag' ? 'Pay Dues via Ocubyte Gateway' : 'Pay with Ocubyte Gateway'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-muted text-center leading-relaxed">
                  {simulatorProfile === 'obeag'
                    ? 'Redirects to Ocubyte Gateway, processes Paystack payment, then returns to OBEAG ledger with verified token!'
                    : 'Clicking opens Ocubyte Gateway, processes Paystack payment, then redirects back to Nexus Store order confirmation!'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Payment Link & Hosted Checkout Generator */}
      {activeTab === 'generator' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-12 gap-8 items-start"
        >
          {/* Configuration Form */}
          <div className="lg:col-span-6 bg-secondary/80 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-lg text-text flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-accent" />
              <span>Configure Affiliate Merchant Parameters</span>
            </h3>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="text-xs text-muted">Quick Presets:</span>
              <button
                type="button"
                onClick={loadObeagPreset}
                className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 transition flex items-center gap-1"
              >
                <Users className="w-3 h-3" />
                <span>OBEAG Portal Preset</span>
              </button>
              <button
                type="button"
                onClick={loadEcommercePreset}
                className="px-2.5 py-1 rounded-lg bg-secondary text-muted border border-slate-700 text-xs font-semibold hover:text-text transition flex items-center gap-1"
              >
                <Store className="w-3 h-3" />
                <span>Retail E-Commerce</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Merchant Business Name</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full bg-primary/50 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-text focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Merchant ID</label>
                  <input
                    type="text"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="w-full bg-primary/50 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Product / Service Title</label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full bg-primary/50 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Amount ({currency})</label>
                  <input
                    type="number"
                    min="100"
                    value={productAmount}
                    onChange={(e) => setProductAmount(Number(e.target.value))}
                    className="w-full bg-primary/50 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-primary/50 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-text focus:outline-none focus:border-accent"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Return / Callback URL</label>
                <input
                  type="text"
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                  placeholder="https://yourstore.com/checkout/success"
                  className="w-full bg-primary/50 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Generated Code & Links */}
          <div className="lg:col-span-6 space-y-4">
            {/* Direct Checkout Link Card */}
            <div className="bg-secondary/80 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text uppercase tracking-wider">Direct Checkout URL</span>
                <span className="text-[10px] text-accent font-semibold">Ready to Use</span>
              </div>

              <div className="p-3 rounded-xl bg-primary/50 border border-slate-800 font-mono text-[11px] text-accent break-all">
                {generatedCheckoutUrl}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(generatedCheckoutUrl, 'link')}
                  className="flex-1 py-2 rounded-xl bg-accent text-primary text-xs font-bold hover:brightness-110 transition flex items-center justify-center gap-1.5"
                >
                  {copiedField === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'link' ? 'Copied!' : 'Copy Payment Link'}</span>
                </button>

                <a
                  href={generatedCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-text hover:bg-slate-800 transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>

            {/* HTML Button Snippet */}
            <div className="bg-secondary/80 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text">HTML Button Code</span>
                <button
                  onClick={() => copyToClipboard(htmlButtonSnippet, 'html')}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  {copiedField === 'html' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'html' ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-primary/70 border border-slate-800 font-mono text-[11px] text-muted overflow-x-auto">
                {htmlButtonSnippet}
              </pre>
            </div>

            {/* Iframe PostMessage Snippet */}
            <div className="bg-secondary/80 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text">Embed Modal / Iframe + postMessage</span>
                <button
                  onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  {copiedField === 'iframe' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'iframe' ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-primary/70 border border-slate-800 font-mono text-[11px] text-muted overflow-x-auto max-h-36">
                {iframeSnippet}
              </pre>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Developer API Docs */}
      {activeTab === 'docs' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/70 border border-slate-700/80 rounded-3xl p-6 sm:p-10 backdrop-blur-md space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-text">Ocubyte Payment Gateway API Reference</h2>
            <p className="text-sm text-muted">
              Integrate Ocubyte Gateway into any e-commerce platform, backend, or custom web frontend.
            </p>
          </div>

          {/* Section: URL Parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent" />
              <span>Checkout Request Parameters</span>
            </h3>
            <p className="text-xs text-muted">
              Redirect your customers to <code className="text-accent bg-primary px-2 py-0.5 rounded font-mono">/gateway/checkout</code> with the following query parameters:
            </p>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-primary/70 text-text border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Parameter</th>
                    <th className="p-3 font-semibold">Type</th>
                    <th className="p-3 font-semibold">Required</th>
                    <th className="p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-muted font-mono">
                  <tr>
                    <td className="p-3 text-accent font-bold">merchant_id</td>
                    <td className="p-3">string</td>
                    <td className="p-3 text-rose-400">Yes</td>
                    <td className="p-3 font-sans">Unique identifier assigned to the affiliated store.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-accent font-bold">amount</td>
                    <td className="p-3">number</td>
                    <td className="p-3 text-rose-400">Yes</td>
                    <td className="p-3 font-sans">Payment amount in main units (e.g. 5000 for ₦5,000).</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-accent font-bold">callback_url</td>
                    <td className="p-3">string</td>
                    <td className="p-3 text-rose-400">Yes</td>
                    <td className="p-3 font-sans">URL where the customer is redirected upon payment confirmation.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-accent font-bold">merchant_name</td>
                    <td className="p-3">string</td>
                    <td className="p-3 text-slate-500">Optional</td>
                    <td className="p-3 font-sans">Business name displayed on the customer's checkout screen.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-accent font-bold">reference</td>
                    <td className="p-3">string</td>
                    <td className="p-3 text-slate-500">Optional</td>
                    <td className="p-3 font-sans">Your store's unique order / invoice reference number.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-accent font-bold">customer_email</td>
                    <td className="p-3">string</td>
                    <td className="p-3 text-slate-500">Optional</td>
                    <td className="p-3 font-sans">Pre-fills customer email on the checkout form.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-accent font-bold">currency</td>
                    <td className="p-3">string</td>
                    <td className="p-3 text-slate-500">Optional</td>
                    <td className="p-3 font-sans">Currency code (default: NGN).</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-accent font-bold">cancel_url</td>
                    <td className="p-3">string</td>
                    <td className="p-3 text-slate-500">Optional</td>
                    <td className="p-3 font-sans">URL to return to if the customer decides not to complete checkout.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Callback Response Payload */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Confirmation Callback Payload</span>
            </h3>
            <p className="text-xs text-muted">
              Once payment is completed via Paystack, Ocubyte appends verification parameters to your <code className="text-accent bg-primary px-2 py-0.5 rounded font-mono">callback_url</code>:
            </p>

            <div className="p-4 rounded-2xl bg-primary/60 border border-slate-800 font-mono text-xs text-muted space-y-2">
              <div className="text-accent font-semibold">GET https://yourstore.com/checkout/callback?status=success...</div>
              <pre className="text-[11px] leading-relaxed text-text">
{`{
  status: "success",
  reference: "GW_NEXUS_17192348_AB92",
  trxref: "GW_NEXUS_17192348_AB92",
  amount: "45000",
  currency: "NGN",
  merchant_id: "nexus_electronics",
  timestamp: "2026-10-12T22:30:00.000Z",
  sig: "ocu_sig_47fa918_b803kz"
}`}
              </pre>
            </div>
          </div>

          {/* Section: Server-Side Verification for Third-Party Backends (OBEAG Guide) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>100% Secure Server-to-Server Verification (OBEAG Integration)</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Production Standard
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              To prevent fraudulent URL parameter tampering, third-party backends (like the <strong>OBEAG Tracker & Portal</strong>) should always verify the transaction server-to-server before updating member balances or marking dues as paid:
            </p>

            <div className="p-4 rounded-2xl bg-primary/70 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-text flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-accent" />
                <span>OBEAG Backend Verification Route (Next.js / Node.js API)</span>
              </div>
              <pre className="text-[11px] font-mono text-muted overflow-x-auto leading-relaxed">
{`// Inside OBEAG backend: pages/api/verify-dues.js or app/api/dues/verify/route.ts
export async function POST(req) {
  const { reference, member_id } = await req.json();

  // 1. Call Ocubyte Gateway Verification Serverless API
  const response = await fetch(
    \`https://www.ocubyte.org/api/v1/gateway/verify/\${reference}\`
  );
  const data = await response.json();

  // 2. Validate authenticity
  if (data.verified && data.status === 'success') {
    // 3. 100% Confirmed! Update member's dues status in OBEAG database / ledger
    await markMemberDuesAsPaid({
      memberId: member_id,
      amount: data.amount,
      reference: data.reference,
      paidAt: data.paid_at,
      token: data.ocubyte_verification_token
    });

    return Response.json({ success: true, message: 'Dues successfully reconciled.' });
  }

  return Response.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
}`}
              </pre>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 4: Gateway Transactions Explorer */}
      {activeTab === 'explorer' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-text">Gateway Transaction Explorer</h2>
              <p className="text-xs text-muted">Audit and verify transactions processed through Ocubyte Gateway.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search by ref, merchant, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {selectedTx ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                ← Back to All Transactions
              </button>
              <PaymentReceipt transaction={selectedTx} />
            </div>
          ) : filteredTxs.length === 0 ? (
            <div className="bg-secondary/60 border border-slate-700/60 rounded-3xl p-12 text-center space-y-3">
              <Receipt className="w-10 h-10 text-muted mx-auto" />
              <h4 className="font-bold text-text text-base">No Gateway Transactions Found</h4>
              <p className="text-xs text-muted max-w-sm mx-auto">
                No payments have been recorded yet. Test a payment using the Store Simulator or Direct Pay to view live transaction records.
              </p>
              <button
                onClick={() => setActiveTab('simulator')}
                className="mt-2 px-4 py-2 rounded-xl bg-accent text-primary text-xs font-bold hover:brightness-110"
              >
                Launch Simulator
              </button>
            </div>
          ) : (
            <div className="bg-secondary/70 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-primary/70 text-text border-b border-slate-800">
                    <tr>
                      <th className="p-4 font-semibold">Reference</th>
                      <th className="p-4 font-semibold">Merchant</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Amount</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTxs.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-primary/30 transition">
                        <td className="p-4 font-mono text-accent">{tx.reference}</td>
                        <td className="p-4 text-text font-medium">{tx.merchantName || tx.merchantId}</td>
                        <td className="p-4 text-muted">{tx.customerEmail}</td>
                        <td className="p-4 font-bold text-text font-mono">
                          {formatCurrency(tx.amount, tx.currency)}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/20 text-accent">
                            SUCCESS
                          </span>
                        </td>
                        <td className="p-4 text-muted text-[11px]">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="px-3 py-1 rounded-lg border border-slate-700 text-[11px] text-text hover:bg-slate-800"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GatewayPortal;
