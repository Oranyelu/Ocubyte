import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Tag, TrendingUp } from 'lucide-react';
import GlassCard from './GlassCard';
import { getSocialIcon, getSocialColor } from './SocialIcons';

const ProjectCard = ({ project, onOpenSocials }) => {
  // Filter active socials
  const activeSocials = Object.entries(project.socials || {}).filter(
    ([_, url]) => url && url.trim() !== ''
  );

  const hasSocials = activeSocials.length > 0;

  const handleCardClick = () => {
    if (hasSocials) {
      if (onOpenSocials) {
        onOpenSocials(project);
      }
    } else if (project.website) {
      window.open(project.website, '_blank');
    }
  };

  // Human-readable categories list
  const categoryLabel = Array.isArray(project.category)
    ? project.category.join(' + ')
    : project.category;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onClick={handleCardClick}
      className={`h-full cursor-pointer select-none`}
    >
      <GlassCard className="h-full p-0 overflow-hidden flex flex-col justify-between group hover:border-accent/35 transition-all duration-300">
        {/* Styled Card Header */}
        <div className={`relative h-48 ${project.accentColor} p-6 flex flex-col justify-between overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.55)_100%)]" />
          
          {/* Floating dashboard visual mockup on hover */}
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
              {categoryLabel}
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

            {project.outcome && (
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-1.5">
                <h4 className="text-xs uppercase font-black text-accent flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  Measurable Outcome
                </h4>
                <p className="text-xs text-text/80 leading-relaxed font-medium">{project.outcome}</p>
              </div>
            )}
          </div>

          {/* Footer Stats & Tags & Socials */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

            {/* Quick-links to socials */}
            {hasSocials && (
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {activeSocials.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`p-1.5 rounded-lg border border-slate-200/40 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-900/40 text-muted transition-all duration-300 ${getSocialColor(platform)}`}
                    title={`View ${platform}`}
                  >
                    {getSocialIcon(platform, "h-3.5 w-3.5")}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ProjectCard;
