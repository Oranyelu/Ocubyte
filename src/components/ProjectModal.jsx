import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Globe, Tag, TrendingUp } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';
import { getSocialIcon, getSocialColor } from './SocialIcons';

const ProjectModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  // Filter out social links that are empty
  const activeSocials = Object.entries(project.socials || {}).filter(
    ([_, url]) => url && url.trim() !== ''
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal content wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-xl z-10"
        >
          <GlassCard className="p-0 overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative">
            {/* Styled header with project accent color */}
            <div className={`relative p-8 ${project.accentColor} text-white overflow-hidden`}>
              <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:20px_20px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.55)_100%)]" />
              
              <div className="flex justify-between items-start z-10 relative">
                <span className="flex items-center gap-2 text-[10px] font-bold font-mono tracking-widest text-white uppercase px-2.5 py-1 rounded bg-black/30 border border-white/10">
                  {project.icon}
                  {Array.isArray(project.category) ? project.category.join(' + ') : project.category}
                </span>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all border border-white/10"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="z-10 relative mt-6 space-y-1">
                <span className="text-xs text-white/70 font-semibold tracking-wide">{project.client}</span>
                <h3 className="text-3xl font-black leading-tight">{project.name}</h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-6 bg-slate-50 dark:bg-[#111317]">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-accent flex items-center gap-1.5">
                  <Tag size={12} />
                  Project Overview
                </h4>
                <p className="text-text/90 text-sm leading-relaxed">{project.description}</p>
              </div>

              {/* Outcome */}
              {project.outcome && (
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-1.5">
                  <h4 className="text-xs uppercase font-black text-accent flex items-center gap-1.5">
                    <TrendingUp size={12} />
                    Measurable Outcome
                  </h4>
                  <p className="text-xs text-text/80 leading-relaxed font-medium">{project.outcome}</p>
                </div>
              )}

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
                {project.tech.map((t, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] font-bold px-2.5 py-1 rounded bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/40 text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Social Channels & Website Links */}
              <div className="space-y-4 pt-2">
                {activeSocials.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-muted text-center">
                      Connect on Social Media
                    </h4>
                    <div className="flex justify-center gap-4">
                      {activeSocials.map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-900/60 text-muted transition-all duration-300 ${getSocialColor(platform)}`}
                          title={`View ${platform}`}
                        >
                          {getSocialIcon(platform, "h-6 w-6")}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Website Link */}
                {project.website && (
                  <div className="pt-2 flex justify-center">
                    <Button 
                      onClick={() => window.open(project.website, '_blank')}
                      className="font-bold px-6 py-2.5 text-sm flex items-center gap-2 shadow-lg shadow-accent/15"
                    >
                      <Globe size={16} /> Visit Project Website <ExternalLink size={12} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
