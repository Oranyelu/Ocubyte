import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  Share2, 
  Sparkles, 
  Instagram, 
  Linkedin, 
  Copy, 
  Check, 
  Image, 
  Type,
  ExternalLink
} from 'lucide-react';

const studioStyles = {
  cyberpunk: {
    name: 'Neon Cyberpunk',
    bg: 'bg-[#120524]',
    cardBg: 'bg-black border-fuchsia-500/30 text-white',
    font: 'font-mono uppercase font-black tracking-widest text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]',
    colors: ['#D946EF', '#06B6D4', '#0F172A'],
    tagline: 'DIGITAL FRONTIER LOGISTICS',
    socialPost: 'Reinventing operations. Smart systems, electric design. We byte hard. ⚡ #cyberpunk #ocubyte #branding'
  },
  luxury: {
    name: 'Luxury Serif',
    bg: 'bg-[#1C1917]',
    cardBg: 'bg-stone-900 border-amber-500/20 text-stone-100',
    font: 'font-serif italic font-light tracking-wide text-amber-300',
    colors: ['#F59E0B', '#78350F', '#1C1917'],
    tagline: 'PREMIUM CHRONICLE ASSOCIATES',
    socialPost: 'Crafting timeless premium identities. Attention to detail is not an option; it is our foundation. 🏛️ #luxury #branding #design'
  },
  minimalist: {
    name: 'Clean Tech',
    bg: 'bg-slate-100 dark:bg-slate-900',
    cardBg: 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50',
    font: 'font-sans font-bold tracking-tight uppercase text-sky-600 dark:text-sky-400',
    colors: ['#0284C7', '#64748B', '#F1F5F9'],
    tagline: 'MINIMAL OPERATION SYSTEMS',
    socialPost: 'Simple scales. Bold solutions in clean visual frameworks. Build fast. Build custom. 💻 #tech #minimalist #uxui'
  },
  bio: {
    name: 'Organic Growth',
    bg: 'bg-[#082822]',
    cardBg: 'bg-zinc-900 border-emerald-500/20 text-emerald-50',
    font: 'font-sans font-semibold tracking-wide text-emerald-400',
    colors: ['#10B981', '#115E59', '#18181B'],
    tagline: 'ECOLOGICAL RESOURCE CO.',
    socialPost: 'Sustainable technology pipelines designed with nature at the center. 🌿 #organic #eco #development'
  }
};

const Studio = () => {
  const [brandName, setBrandName] = useState('Apex Corp');
  const [selectedStyle, setSelectedStyle] = useState('minimalist');
  const [socialFeed, setSocialFeed] = useState('instagram'); // instagram, linkedin
  const [copiedColor, setCopiedColor] = useState('');

  const current = studioStyles[selectedStyle];

  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(''), 1500);
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold">
          <Sparkles size={12} />
          <span>Interactive Brand Canvas</span>
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Visual <span className="text-accent">Design Studio</span>
        </h1>
        <p className="text-muted text-base">
          Customize logo typography, check color sheets, and preview how brand assets scale across social channels instantly.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card p-6 space-y-5">
            <h3 className="text-lg font-bold">Branding Core</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted">
                  Company Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value.slice(0, 24))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-slate-950/20 text-sm focus:outline-none focus:border-accent"
                  placeholder="Apex Logistics"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted">
                  Brand Aesthetics Style
                </label>
                <div className="space-y-2">
                  {Object.keys(studioStyles).map((styleKey) => (
                    <button
                      key={styleKey}
                      onClick={() => setSelectedStyle(styleKey)}
                      className={`w-full py-2.5 px-4 rounded-xl border text-left text-xs font-bold flex justify-between items-center transition-all ${
                        selectedStyle === styleKey 
                          ? 'border-accent bg-accent/5 text-accent font-extrabold' 
                          : 'border-slate-200/30 dark:border-slate-800/30 hover:border-accent/30 text-text/80'
                      }`}
                    >
                      <span>{studioStyles[styleKey].name}</span>
                      <div className="flex gap-1.5">
                        {studioStyles[styleKey].colors.map((c, idx) => (
                          <div 
                            key={idx} 
                            style={{ backgroundColor: c }} 
                            className="w-3.5 h-3.5 rounded-full border border-white/20" 
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-6 space-y-4">
            <h3 className="text-lg font-bold">Social Mockups</h3>
            
            <div className="flex bg-slate-200/40 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
              <button
                onClick={() => setSocialFeed('instagram')}
                className={`flex-grow py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  socialFeed === 'instagram' ? 'bg-accent text-white shadow' : 'text-muted'
                }`}
              >
                <Instagram size={14} /> Instagram Grid
              </button>
              <button
                onClick={() => setSocialFeed('linkedin')}
                className={`flex-grow py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  socialFeed === 'linkedin' ? 'bg-accent text-white shadow' : 'text-muted'
                }`}
              >
                <Linkedin size={14} /> LinkedIn Post
              </button>
            </div>
          </div>
        </div>

        {/* Visual Live Canvas */}
        <div className="lg:col-span-8 space-y-8">
          {/* Logo preview */}
          <div className="premium-card p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold">Generated Brand Assets</h3>
            
            <div className={`w-full h-56 rounded-2xl ${current.bg} flex items-center justify-center relative overflow-hidden shadow-inner`}>
              <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:16px_16px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.5)_100%)]" />
              
              <div className="text-center z-10 p-4">
                <motion.h2 
                  key={brandName + selectedStyle}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-4xl md:text-5xl font-black ${current.font} break-words leading-none`}
                >
                  {brandName || 'Ocubyte'}
                </motion.h2>
                <motion.p
                  key={selectedStyle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-[10px] tracking-widest uppercase font-semibold text-white/50 mt-3 font-mono"
                >
                  {current.tagline}
                </motion.p>
              </div>
            </div>

            {/* Typography & Palettes sheet */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-accent flex items-center gap-1.5">
                  <Palette size={14} /> Brand Color Sheet
                </h4>
                <div className="flex gap-2">
                  {current.colors.map((hex, i) => (
                    <div 
                      key={i}
                      onClick={() => handleCopyHex(hex)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-200/20 dark:bg-slate-900/20 text-center cursor-pointer hover:border-accent/40 transition-all group relative"
                    >
                      <div style={{ backgroundColor: hex }} className="w-full h-8 rounded-lg mb-1.5 border border-white/10" />
                      <span className="text-[10px] font-mono font-bold block">{hex}</span>
                      <span className="text-[8px] text-muted block group-hover:text-accent transition-colors font-bold uppercase">
                        {copiedColor === hex ? 'Copied!' : 'Copy Hex'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-accent flex items-center gap-1.5">
                  <Type size={14} /> Typography Specs
                </h4>
                <div className="p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-200/20 dark:bg-slate-900/20 space-y-1">
                  <p className="text-xs font-bold text-muted">Font Family Choice</p>
                  <p className="text-sm font-extrabold font-mono">
                    {current.font.includes('serif') ? 'Outfit Serif Light' : 
                     current.font.includes('mono') ? 'Plus Jakarta Mono Bold' : 'Outfit Sans ExtraBold'}
                  </p>
                  <p className="text-[10px] text-muted leading-tight">
                    *Handcrafted layouts configured with optical letter-spacing rules.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social post mock */}
          <div className="premium-card p-6 md:p-8">
            <h3 className="text-lg font-bold mb-4">Social Presence Integration</h3>
            
            <AnimatePresence mode="wait">
              {socialFeed === 'instagram' ? (
                <motion.div
                  key="instagram-mock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-md mx-auto border border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-primary overflow-hidden shadow-lg"
                >
                  {/* Inst Profile */}
                  <div className="p-4 flex items-center gap-3 border-b border-slate-200/40 dark:border-slate-800/40">
                    <div className={`w-8 h-8 rounded-full ${current.bg} border border-white/20`} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-extrabold tracking-tight">{brandName.toLowerCase().replace(/\s+/g, '')}</p>
                      <p className="text-[9px] text-muted">Sponsored</p>
                    </div>
                  </div>

                  {/* Inst Visual Post */}
                  <div className={`aspect-square w-full ${current.bg} flex items-center justify-center p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:16px_16px]" />
                    <h4 className={`text-center font-black leading-none drop-shadow ${current.font} text-3xl`}>
                      {brandName}
                    </h4>
                  </div>

                  {/* Inst Actions */}
                  <div className="p-4 space-y-2">
                    <div className="flex gap-4 text-xs font-bold text-accent">
                      <span>♥ 1,240 Likes</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      <span className="font-extrabold mr-1">{brandName.toLowerCase().replace(/\s+/g, '')}</span>
                      <span className="text-text/90 font-medium">{current.socialPost}</span>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="linkedin-mock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-xl mx-auto border border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-primary p-4 space-y-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${current.bg} border border-white/20`} />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold">{brandName}</h4>
                      <p className="text-[9px] text-muted">14,230 followers • Promote</p>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-text/95 font-medium">{current.socialPost}</p>

                  <div className={`w-full h-48 ${current.bg} border border-slate-200/40 dark:border-slate-800/40 rounded-xl flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:16px_16px]" />
                    <h4 className={`font-black text-center leading-none ${current.font} text-2xl`}>
                      {brandName}
                    </h4>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Info FAQs */}
      <section className="premium-card p-8 md:p-12 space-y-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-extrabold text-center">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-accent flex items-center gap-2">
              <Palette size={16} /> What does a "Brand System" include?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              We deliver logo vectors, responsive secondary marks, complete color palette files (with CSS variable codes), specific font pairing rules, and custom templates for your visual and editorial messaging.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-accent flex items-center gap-2">
              <Share2 size={16} /> How is social media managed?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              We design regular content batches, write target copy hooks, and set up automatic calendar posts to publish across Instagram, LinkedIn, and Twitter, so your channels remain highly professional and active.
            </p>
          </div>
        </div>
        <div className="pt-4 text-center">
          <Link to="/contact">
            <Button className="font-bold px-8 py-3.5 flex items-center gap-2 mx-auto">
              Get Started with Your Branding Redesign <ExternalLink size={15} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Studio;
