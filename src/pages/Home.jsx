import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Globe, 
  Cpu, 
  Share2, 
  ArrowRight, 
  Zap, 
  CheckCircle,
  Play, 
  Layers,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const Home = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('brand');
  const [brandName, setBrandName] = useState('My Business');
  const [brandVibe, setBrandVibe] = useState('bold'); // bold, elegant, tech, eco
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: Step 1, 2: Step 2, 3: Success

  // Configuration for branding interactive demo
  const vibes = {
    bold: { bg: 'from-rose-500 to-amber-500', font: 'font-extrabold font-serif italic', text: 'text-amber-100', subtitle: 'A Bold Disruptor' },
    elegant: { bg: 'from-violet-600 to-indigo-900', font: 'font-light tracking-widest uppercase', text: 'text-violet-200', subtitle: 'Timeless Premium Quality' },
    tech: { bg: 'from-cyan-500 to-blue-600', font: 'font-mono uppercase font-bold tracking-tight', text: 'text-cyan-100', subtitle: 'Smart Adaptive Tech' },
    eco: { bg: 'from-emerald-400 to-teal-700', font: 'font-semibold tracking-normal', text: 'text-emerald-100', subtitle: 'Pure Organic Growth' }
  };

  const services = [
    {
      icon: <Palette className="h-7 w-7 text-accent" />,
      title: 'Brand Logos & Identities',
      description: 'We design custom logos, color schemes, and brand systems that make your business look highly professional and memorable.'
    },
    {
      icon: <Globe className="h-7 w-7 text-accent" />,
      title: 'Custom Websites & Apps',
      description: 'We build fast, responsive, and easy-to-use custom websites and web applications tailored specifically to your daily operations.'
    },
    {
      icon: <Cpu className="h-7 w-7 text-accent" />,
      title: 'Automated Workflows',
      description: 'We connect your software tools together to automate daily tasks, eliminating manual data entry and saving you hours of work.'
    },
    {
      icon: <Share2 className="h-7 w-7 text-accent" />,
      title: 'Social Media Management',
      description: 'We design, schedule, and publish regular content for your social media pages, building trust and active engagement with your audience.'
    }
  ];

  const triggerSimulation = () => {
    setSimStep(1);
    setTimeout(() => setSimStep(2), 1200);
    setTimeout(() => setSimStep(3), 2400);
  };

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glows for glass theme */}
      {theme === 'glass' && <div className="glass-hero-overlay" />}

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-6xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-2"
          >
            <Sparkles size={16} />
            <span>Theme-Adaptive Experience</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto"
          >
            We design <span className="gradient-text">brands</span>, build{' '}
            <span className="gradient-text">websites</span>, and{' '}
            <span className="gradient-text">automate</span> your business.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto text-muted"
          >
            In plain English: We upgrade your visual presence, handle your software development, connect your tools, and run your social media so you can focus on growing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Link to="/contact">
              <Button className="px-8 py-3.5 text-base shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-transform duration-300">
                Partner with Us
              </Button>
            </Link>
            <Link to="/services" className="text-text hover:text-accent font-semibold transition-colors flex items-center gap-2">
              Explore Our Services <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Prompt to toggle themes */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xs text-muted/80 italic pt-2"
          >
            💡 Hint: Try clicking the theme toggle switch in the top right to watch the design morph!
          </motion.p>
        </div>
      </section>

      {/* Services Grid (In Plain English) */}
      <section className="py-20 px-6 bg-slate-950/20 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold">What We Do</h2>
            <p className="text-muted">
              We cover all your branding, engineering, and digital marketing bases with simple, professional execution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex items-start gap-5 hover:-translate-y-1 transition-all">
                  <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/20 flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{service.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Studio Playground Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Experience the <span className="text-accent">Ocubyte Studio</span>
            </h2>
            <p className="text-muted">
              Test out our design and automation prototypes live below to see how we upgrade workflows and brands.
            </p>
          </div>

          <div className="flex justify-center mb-8 bg-slate-200/40 dark:bg-slate-900/60 p-1.5 rounded-xl max-w-sm mx-auto border border-slate-200/50 dark:border-slate-800/50">
            <button
              onClick={() => setActiveTab('brand')}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'brand' ? 'bg-accent text-white shadow-md' : 'text-text/70'
              }`}
            >
              Design Canvas
            </button>
            <button
              onClick={() => setActiveTab('auto')}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'auto' ? 'bg-accent text-white shadow-md' : 'text-text/70'
              }`}
            >
              Automation Lab
            </button>
          </div>

          <div className="premium-card p-6 md:p-8 min-h-[400px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {activeTab === 'brand' ? (
                <motion.div
                  key="brand-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid md:grid-cols-12 gap-8 items-center"
                >
                  <div className="md:col-span-5 space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Palette className="text-accent" />
                      Logo & Brand Canvas
                    </h3>
                    <p className="text-muted text-sm">
                      Type your business name and select a vibe. Our studio generates unified, gorgeous visual systems in seconds.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted">Business Name</label>
                        <input
                          type="text"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value.slice(0, 24))}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-slate-950/20 text-sm focus:outline-none focus:border-accent"
                          placeholder="My Creative Agency"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted font-bold">Vibe Direction</label>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.keys(vibes).map((v) => (
                            <button
                              key={v}
                              onClick={() => setBrandVibe(v)}
                              className={`py-2 px-3 rounded-lg border text-xs font-bold capitalize transition-all ${
                                brandVibe === v 
                                  ? 'border-accent bg-accent/5 text-accent' 
                                  : 'border-slate-200/30 dark:border-slate-800/30 hover:border-accent/40'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7 flex justify-center">
                    <div className={`relative w-full max-w-[340px] aspect-square rounded-3xl bg-gradient-to-tr ${vibes[brandVibe].bg} p-6 shadow-xl flex flex-col justify-between overflow-hidden group`}>
                      {/* Grid background effect */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)] opacity-60" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:20px_20px]" />

                      <div className="flex justify-between items-center z-10">
                        <span className="text-white/60 text-xs font-mono tracking-widest">OCUBYTE MOCKUP</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
                      </div>

                      <div className="z-10 text-center py-6">
                        <h4 className={`text-white text-3xl md:text-4xl select-none ${vibes[brandVibe].font} break-words leading-none drop-shadow-md`}>
                          {brandName || 'Ocubyte'}
                        </h4>
                        <p className={`text-xs mt-2 font-medium tracking-wide uppercase ${vibes[brandVibe].text}`}>
                          {vibes[brandVibe].subtitle}
                        </p>
                      </div>

                      <div className="flex justify-between items-center z-10 border-t border-white/10 pt-4">
                        <span className="text-white/70 text-xs font-semibold">Active Identity</span>
                        <Link to="/studio" className="text-white bg-white/20 hover:bg-white/35 transition-colors px-3 py-1 rounded-full text-xs font-bold">
                          Customize →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auto-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="grid md:grid-cols-12 gap-8 items-center"
                >
                  <div className="md:col-span-5 space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Cpu className="text-accent" />
                      Workflow Simulator
                    </h3>
                    <p className="text-muted text-sm">
                      Witness how automated systems orchestrate logic in real-time. Hit "Trigger Lead Workflow" to run a client onboarding sequence.
                    </p>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={triggerSimulation}
                        disabled={simStep > 0 && simStep < 3}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-white font-extrabold hover:bg-accent/90 transition shadow-lg shadow-accent/15 disabled:opacity-50"
                      >
                        {simStep === 0 && <Play size={16} />}
                        {simStep > 0 && simStep < 3 && <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                        {simStep === 3 && <CheckCircle size={16} />}
                        {simStep === 0 && 'Trigger Lead Workflow'}
                        {simStep === 1 && 'Ingesting Lead Data...'}
                        {simStep === 2 && 'Routing APIs & Syncing...'}
                        {simStep === 3 && 'Workflow Successfully Fired!'}
                      </button>

                      {simStep > 0 && (
                        <button 
                          onClick={() => setSimStep(0)}
                          className="w-full text-xs text-accent font-semibold hover:underline"
                        >
                          Reset Simulation
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-7 flex justify-center">
                    <div className="w-full max-w-[380px] bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-emerald-400 space-y-3 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-3 right-3 flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>

                      <div className="border-b border-slate-800 pb-2 text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Layers size={12} />
                        <span>LIVE LOGS SCREEN</span>
                      </div>

                      <div className="space-y-1 min-h-[170px]">
                        <p className="text-slate-500">[SYSTEM] Listening for webhooks...</p>
                        {simStep >= 1 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400">
                            ⚡ [Webhook] New Customer Lead: "{brandName || 'Lead'}" detected.
                          </motion.p>
                        )}
                        {simStep >= 1 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400">
                            ⚙️ [API] Initializing custom visual palette: {brandVibe.toUpperCase()}
                          </motion.p>
                        )}
                        {simStep >= 2 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400">
                            ⚙️ [API] Sending notification to Slack Channel #ocubyte-deals
                          </motion.p>
                        )}
                        {simStep >= 2 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-violet-400">
                            💾 [DB] Synchronized details with partner CRM records.
                          </motion.p>
                        )}
                        {simStep >= 3 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 font-bold">
                            ✅ [STATUS] Setup completed in 2.4s. Customer sent greeting email.
                          </motion.p>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-slate-500">
                        <span>PIPELINE: ACTIVE</span>
                        <Link to="/automation" className="text-accent font-semibold hover:underline">
                          View Flow Builder →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Case Studies / Recent Works */}
      <section className="py-20 px-6 bg-slate-950/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold">Recent Partnerships</h2>
            <p className="text-muted">
              Here is how we helped businesses upgrade their identity, engineering, and automation setups.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Case Study 1 */}
            <GlassCard className="p-0 overflow-hidden flex flex-col justify-between group">
              <div className="relative aspect-video bg-gradient-to-br from-violet-900 to-indigo-950 p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:16px_16px]" />
                <span className="text-[10px] font-bold font-mono tracking-widest text-violet-300 uppercase px-2.5 py-1 rounded bg-violet-800/40 border border-violet-500/20 self-start">
                  Branding + Web App
                </span>
                <h4 className="text-2xl font-black text-white relative z-10">Mosaik Art</h4>
                <div className="text-white/60 text-xs">Custom Portfolio & Booking Engine</div>
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold">Mosaik Creative Platform</h4>
                  <p className="text-muted text-xs leading-relaxed">
                    Designed a bold geometric logo/identity and built a bespoke web gallery enabling artist bookings, generating over $20k in bookings month one.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Branding</span>
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Vite</span>
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Supabase</span>
                </div>
              </div>
            </GlassCard>

            {/* Case Study 2 */}
            <GlassCard className="p-0 overflow-hidden flex flex-col justify-between group">
              <div className="relative aspect-video bg-gradient-to-br from-cyan-900 to-emerald-950 p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:16px_16px]" />
                <span className="text-[10px] font-bold font-mono tracking-widest text-cyan-300 uppercase px-2.5 py-1 rounded bg-cyan-800/40 border border-cyan-500/20 self-start">
                  Automated Workflows
                </span>
                <h4 className="text-2xl font-black text-white relative z-10">Apex Logistics</h4>
                <div className="text-white/60 text-xs">Automated Dispatch System</div>
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold">Apex Flow Hub</h4>
                  <p className="text-muted text-xs leading-relaxed">
                    Eliminated 25 hours/week of administrative work by automating client invoice matching, WhatsApp courier updates, and CRM sync pipelines.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Automation</span>
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Stripe API</span>
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Slack API</span>
                </div>
              </div>
            </GlassCard>

            {/* Case Study 3 */}
            <GlassCard className="p-0 overflow-hidden flex flex-col justify-between group">
              <div className="relative aspect-video bg-gradient-to-br from-rose-950 to-orange-950 p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:16px_16px]" />
                <span className="text-[10px] font-bold font-mono tracking-widest text-rose-300 uppercase px-2.5 py-1 rounded bg-rose-800/40 border border-rose-500/20 self-start">
                  Social Presence + Identity
                </span>
                <h4 className="text-2xl font-black text-white relative z-10">VibeSync</h4>
                <div className="text-white/60 text-xs">Social Growth & Content Engine</div>
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold">VibeSync Content Hub</h4>
                  <p className="text-muted text-xs leading-relaxed">
                    Overhauled branding and established a 30-day automated content creation & schedule workflow, increasing LinkedIn and Instagram reach by 140%.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Branding</span>
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Social Media</span>
                  <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-muted font-semibold">Copywriting</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Trust & Partnership Call to Action (CTA) */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 backdrop-blur-3xl -z-10" />
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-black">Ready to upgrade your business?</h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Get in touch to build custom tools, redesign your identity, automate manual work, and manage your social channels. Let's partner and work together.
          </p>
          <div className="pt-6">
            <Link to="/contact">
              <Button className="px-10 py-4 text-base font-bold flex items-center gap-3 mx-auto shadow-xl shadow-accent/20 hover:scale-105 transition-transform duration-300">
                <MessageSquare size={18} />
                Get a Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
