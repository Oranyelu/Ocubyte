import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  Globe, 
  Cpu, 
  Share2, 
  TrendingUp, 
  ArrowUpRight,
  ExternalLink,
  Code,
  Tag
} from 'lucide-react';

const projectsData = [
  {
    id: 1,
    name: 'Mosaik Platform',
    category: 'branding',
    description: 'We created a bold, geometric visual identity, custom typography assets, and built a custom portfolio web application to showcase and manage fine-art bookings.',
    outcome: 'Generated $20,000+ in client bookings in the first 30 days post-launch with a 3.4% site conversion rate.',
    client: 'Mosaik Creative Studio',
    tech: ['Branding', 'Typography', 'React', 'Tailwind', 'Supabase'],
    accentColor: 'from-violet-500 to-fuchsia-600',
    icon: <Palette className="h-5 w-5 text-violet-400" />
  },
  {
    id: 2,
    name: 'Apex Dispatch Hub',
    category: 'automation',
    description: 'We automated operational logistics workflows. The system syncs sales data, schedules dispatch routes, and instantly alerts drivers and customers via automated WhatsApp and SMS messages.',
    outcome: 'Saved the client 25 hours per week of manual data entry and reduced driver dispatch errors to near zero.',
    client: 'Apex Logistics',
    tech: ['Automated Systems', 'Twilio API', 'Stripe Hook', 'Node.js', 'PostgreSQL'],
    accentColor: 'from-cyan-500 to-blue-600',
    icon: <Cpu className="h-5 w-5 text-cyan-400" />
  },
  {
    id: 3,
    name: 'VibeSync Content Hub',
    category: 'social',
    description: 'We designed social templates, crafted copy style guides, and built an automated calendar sync that drafts and publishes visual content on LinkedIn, Instagram, and Twitter.',
    outcome: 'Increased LinkedIn and Instagram organic impression metrics by 140% over a 30-day period.',
    client: 'VibeSync Inc.',
    tech: ['Social Media', 'Content Strategy', 'Brand Assets', 'Automation Builder'],
    accentColor: 'from-rose-500 to-orange-600',
    icon: <Share2 className="h-5 w-5 text-rose-400" />
  },
  {
    id: 4,
    name: 'Aetheria Booking App',
    category: 'development',
    description: 'We designed a complete corporate identity and engineered a custom, high-speed multi-lingual booking system allowing luxury properties to list and capture high-value reservations.',
    outcome: 'Successfully launched a booking portal handling up to 10,000 active users with under 100ms API response latency.',
    client: 'Aetheria Estates',
    tech: ['Websites & Apps', 'Brand Logos', 'React Router', 'Express API', 'Redis'],
    accentColor: 'from-emerald-500 to-teal-600',
    icon: <Globe className="h-5 w-5 text-emerald-400" />
  }
];

const ProjectsPage = () => {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Client <span className="text-accent">Projects</span>
        </h1>
        <p className="text-muted text-lg">
          Explore real partnerships where we redesigned brand systems, built custom applications, and automated operations.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
        {['all', 'branding', 'development', 'automation', 'social'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              filter === cat
                ? 'bg-accent text-white border-accent shadow-lg shadow-accent/15'
                : 'bg-slate-200/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 text-text/80 hover:border-accent/40'
            }`}
          >
            {cat === 'all' ? 'All Work' : cat === 'social' ? 'Social Media' : cat === 'development' ? 'Websites & Apps' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      <div className="grid md:grid-cols-2 gap-8">
        <AnimatePresence mode="wait">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="h-full p-0 overflow-hidden flex flex-col justify-between group hover:border-accent/35">
                {/* Styled CSS/SVG Artwork Card Header */}
                <div className={`relative h-48 bg-gradient-to-tr ${project.accentColor} p-6 flex flex-col justify-between overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:20px_20px]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.55)_100%)]" />
                  
                  {/* Floating Elements mimicking dashboard elements */}
                  <div className="absolute bottom-2 right-4 w-32 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 space-y-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 shadow-lg">
                    <div className="w-10 h-2 bg-white/30 rounded" />
                    <div className="w-16 h-1.5 bg-white/20 rounded" />
                    <div className="w-8 h-1.5 bg-white/20 rounded" />
                    <div className="w-full h-4 bg-white/10 rounded flex items-center justify-end px-1.5">
                      <div className="w-2.5 h-1.5 bg-accent rounded" />
                    </div>
                  </div>

                  <div className="flex justify-between items-start z-10">
                    <span className="flex items-center gap-2 text-[10px] font-bold font-mono tracking-widest text-white uppercase px-2.5 py-1 rounded bg-black/30 border border-white/10">
                      {project.icon}
                      {project.category}
                    </span>
                    <span className="text-white/40 group-hover:text-white transition-colors duration-300">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>

                  <div className="z-10 space-y-0.5">
                    <span className="text-xs text-white/70 font-semibold tracking-wide">{project.client}</span>
                    <h3 className="text-2xl font-black text-white leading-none">{project.name}</h3>
                  </div>
                </div>

                {/* Case Study Content */}
                <div className="p-6 md:p-8 space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-accent flex items-center gap-1.5">
                        <Tag size={12} />
                        What We Upgraded
                      </h4>
                      <p className="text-text/90 text-sm leading-relaxed">{project.description}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-1.5">
                      <h4 className="text-xs uppercase font-black text-accent flex items-center gap-1.5">
                        <TrendingUp size={12} />
                        Measurable Outcome
                      </h4>
                      <p className="text-xs text-text/80 leading-relaxed font-medium">{project.outcome}</p>
                    </div>
                  </div>

                  {/* Footer Stats & Tags */}
                  <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-bold px-2.5 py-1 rounded bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/40 text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Global Partnership Prompter */}
      <section className="premium-card p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 mt-12">
        <h2 className="text-3xl font-extrabold">Have a complex custom project in mind?</h2>
        <p className="text-muted text-sm max-w-xl mx-auto">
          We do not believe in one-size-fits-all. We write custom integrations and design tailormade visual assets that fit your exact business specifications.
        </p>
        <Link to="/contact" className="inline-block">
          <Button className="font-bold px-8 py-3.5 flex items-center gap-2 mx-auto">
            Schedule a Discovery Call <ExternalLink size={15} />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default ProjectsPage;
