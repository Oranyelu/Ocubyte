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
  MessageSquare,
  Users,
  Shield,
  Trees,
  Building,
  Boxes,
  CreditCard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { HeroIllustration, BrandingIllustration, WebIllustration, AutomationIllustration, SocialIllustration } from '../components/TechIllustration';
import { projectsData } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';

const Home = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('brand');
  const [brandName, setBrandName] = useState('My Business');
  const [brandVibe, setBrandVibe] = useState('bold'); // bold, elegant, tech, eco
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: Step 1, 2: Step 2, 3: Success
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenSocials = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const featuredProjectIds = [1, 3, 2];
  const featuredProjects = featuredProjectIds
    .map(id => projectsData.find(p => p.id === id))
    .filter(Boolean);

  // Configuration for branding interactive demo
  const vibes = {
    bold: { bg: 'from-rose-500 to-amber-500', font: 'font-extrabold font-serif italic', text: 'text-amber-100', subtitle: 'A Bold Disruptor' },
    elegant: { bg: 'from-violet-600 to-indigo-900', font: 'font-light tracking-widest uppercase', text: 'text-violet-200', subtitle: 'Timeless Premium Quality' },
    tech: { bg: 'from-cyan-500 to-blue-600', font: 'font-mono uppercase font-bold tracking-tight', text: 'text-cyan-100', subtitle: 'Smart Adaptive Tech' },
    eco: { bg: 'from-emerald-400 to-teal-700', font: 'font-semibold tracking-normal', text: 'text-emerald-100', subtitle: 'Pure Organic Growth' }
  };

  const services = [
    {
      icon: <BrandingIllustration />,
      title: 'Brand Logos & Identities',
      description: 'We design custom logos, color schemes, and brand systems that make your business look highly professional and memorable.'
    },
    {
      icon: <WebIllustration />,
      title: 'Custom Websites & Apps',
      description: 'We build fast, responsive, and easy-to-use custom websites and web applications tailored specifically to your daily operations.'
    },
    {
      icon: <AutomationIllustration />,
      title: 'Automated Workflows',
      description: 'We connect your software tools together to automate daily tasks, eliminating manual data entry and saving you hours of work.'
    },
    {
      icon: <SocialIllustration />,
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
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-12 gap-12 items-center text-center lg:text-left">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]"
            >
              We design <span className="gradient-text">brands</span>, build{' '}
              <span className="gradient-text">websites</span>, and{' '}
              <span className="gradient-text">automate</span> your business.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 text-muted leading-relaxed"
            >
              In plain English: We upgrade your visual presence, handle your software development, connect your tools, and run your social media so you can focus on growing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2"
            >
              <Link to="/contact">
                <Button className="w-full sm:w-auto px-8 py-3.5 text-base shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-transform duration-300">
                  Partner with Us
                </Button>
              </Link>
              <Link to="/services" className="text-text hover:text-accent font-semibold transition-colors flex items-center gap-2">
                Explore Our Services <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Tech Illustration */}
          <div className="lg:col-span-5 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Logos Auto-Scroll Band */}
      <div className="w-full py-8 border-y border-slate-200/40 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-900/10 overflow-hidden relative">
        <div className="flex w-max animate-marquee">
          <div className="flex space-x-16 px-8 items-center shrink-0">
            <a href="https://ohabuenyi.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Users size={16} />
              <span>OHA BU ENYI</span>
            </a>
            <a href="https://global-care-pathways.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Shield size={16} />
              <span>GLOBAL CARE PATHWAYS</span>
            </a>
            <a href="https://www.georgewoodcasket.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Trees size={16} />
              <span>GEORGE WOOD CASKET</span>
            </a>
            <a href="https://riseborough-website.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Building size={16} />
              <span>RISEBOROUGH APARTMENTS</span>
            </a>
            <a href="https://ogbako-web.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Boxes size={16} />
              <span>OGBAKO</span>
            </a>
          </div>
          <div className="flex space-x-16 px-8 items-center shrink-0" aria-hidden="true">
            <a href="https://ohabuenyi.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Users size={16} />
              <span>OHA BU ENYI</span>
            </a>
            <a href="https://global-care-pathways.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Shield size={16} />
              <span>GLOBAL CARE PATHWAYS</span>
            </a>
            <a href="https://www.georgewoodcasket.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Trees size={16} />
              <span>GEORGE WOOD CASKET</span>
            </a>
            <a href="https://riseborough-website.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Building size={16} />
              <span>RISEBOROUGH APARTMENTS</span>
            </a>
            <a href="https://ogbako-web.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-text/40 hover:text-text/80 transition-colors duration-300 font-extrabold tracking-widest text-xs md:text-sm font-mono whitespace-nowrap">
              <Boxes size={16} />
              <span>OGBAKO</span>
            </a>
          </div>
        </div>
      </div>

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
                  <div className="flex-shrink-0">
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
            {featuredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onOpenSocials={handleOpenSocials} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal for socials */}
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        project={selectedProject} 
      />

      {/* Payment Gateway & Paystack Showcase Section */}
      <section className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/60 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30">
                <CreditCard className="w-4 h-4" />
                <span>Paystack Integration & Affiliate Payment Gateway</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Accept Payments In-App & Power Your <span className="text-accent">Affiliate Network</span>
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Whether settling design and development milestones directly with Ocubyte, or using Ocubyte as a hosted payment gateway for your affiliated e-commerce websites — our Paystack-powered checkout delivers instant, encrypted transactions with automated return callbacks.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-secondary/80 border border-slate-700/60 space-y-1">
                  <div className="text-accent font-bold text-sm">Direct In-App Checkout</div>
                  <p className="text-xs text-muted">Pay for custom invoices, retainers, and services with Paystack inline cards or bank transfer.</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/80 border border-slate-700/60 space-y-1">
                  <div className="text-cyan-400 font-bold text-sm">Hosted Affiliate Gateway</div>
                  <p className="text-xs text-muted">Third-party sites redirect to Ocubyte, customer pays, and returns with verified signature.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/pay"
                  className="px-6 py-3 rounded-xl bg-accent text-primary font-bold text-xs sm:text-sm hover:brightness-110 transition shadow-lg shadow-accent/20 flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Make In-App Payment</span>
                </Link>
                <Link
                  to="/gateway"
                  className="px-6 py-3 rounded-xl border border-slate-700 text-xs sm:text-sm font-semibold text-text hover:bg-slate-800 transition flex items-center gap-2"
                >
                  <span>Explore Gateway API & Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-secondary/90 border border-slate-700 backdrop-blur-xl shadow-2xl space-y-5">
                <div className="flex justify-between items-center text-xs text-muted border-b border-slate-700/60 pb-3">
                  <span className="font-semibold text-text flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    Gateway Live Demo
                  </span>
                  <span className="font-mono text-accent">SSL 256-Bit</span>
                </div>

                <div className="p-4 rounded-2xl bg-primary/60 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted">Affiliated Merchant</div>
                      <div className="text-sm font-bold text-text">Apex Tech Store</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">Verified</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-xs text-muted">Sample Cart Total</span>
                    <span className="text-xl font-extrabold text-accent font-mono">₦45,000</span>
                  </div>
                </div>

                <Link
                  to="/gateway?tab=simulator"
                  className="w-full py-3 rounded-xl bg-secondary hover:bg-slate-800 border border-slate-700 text-xs font-bold text-text transition flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-accent" />
                  <span>Launch Interactive Simulator</span>
                </Link>
              </div>
            </div>
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
