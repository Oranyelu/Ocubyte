import React from 'react';
import { motion } from 'framer-motion';

export const HeroIllustration = () => {
  return (
    <svg viewBox="0 0 500 400" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="illustration-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200/10 dark:text-slate-800/10" />
        </pattern>
        <linearGradient id="gradient-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      
      {/* Grid background */}
      <rect width="100%" height="100%" fill="url(#illustration-grid)" />
      
      {/* Main Browser Window Mockup */}
      <rect x="50" y="60" width="400" height="280" rx="12" fill="var(--color-card-bg)" stroke="var(--color-border)" strokeWidth="1.5" className="shadow-lg transition-colors duration-500" />
      
      {/* Browser header */}
      <line x1="50" y1="100" x2="450" y2="100" stroke="var(--color-border)" strokeWidth="1.5" className="transition-colors duration-500" />
      
      {/* Browser window controls */}
      <circle cx="75" cy="80" r="5" fill="#ef4444" />
      <circle cx="95" cy="80" r="5" fill="#f59e0b" />
      <circle cx="115" cy="80" r="5" fill="#10b981" />
      
      {/* Wireframe columns */}
      {/* Left navigation menu */}
      <rect x="70" y="120" width="80" height="15" rx="4" fill="currentColor" className="text-slate-200/20 dark:text-slate-800/25" />
      <rect x="70" y="145" width="80" height="12" rx="4" fill="currentColor" className="text-slate-200/10 dark:text-slate-800/15" />
      <rect x="70" y="165" width="80" height="12" rx="4" fill="currentColor" className="text-slate-200/10 dark:text-slate-800/15" />
      <rect x="70" y="185" width="80" height="12" rx="4" fill="currentColor" className="text-slate-200/10 dark:text-slate-800/15" />
      <rect x="70" y="205" width="80" height="12" rx="4" fill="currentColor" className="text-slate-200/10 dark:text-slate-800/15" />

      {/* Middle chart block */}
      <rect x="170" y="120" width="260" height="100" rx="8" fill="var(--color-card-bg)" stroke="var(--color-border)" strokeWidth="1" className="transition-colors duration-500" />
      
      {/* Animated Chart path */}
      <motion.path
        d="M 180 200 L 220 150 L 260 170 L 300 135 L 340 180 L 380 140 L 420 160"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      
      {/* Pulse node */}
      <motion.circle
        cx="380"
        cy="140"
        r="6"
        fill="var(--color-accent)"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Bottom widget cards */}
      <rect x="170" y="235" width="120" height="85" rx="8" fill="currentColor" className="text-slate-200/10 dark:text-slate-800/15" />
      <rect x="310" y="235" width="120" height="85" rx="8" fill="currentColor" className="text-slate-200/10 dark:text-slate-800/15" />

      {/* Mini progress bars inside widgets */}
      <rect x="185" y="255" width="90" height="8" rx="4" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
      <rect x="185" y="275" width="60" height="8" rx="4" fill="var(--color-accent)" opacity="0.8" />

      <circle cx="370" cy="275" r="22" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-300 dark:text-slate-700" />
      <motion.circle
        cx="370"
        cy="275"
        r="22"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="4"
        strokeDasharray="138"
        strokeDashoffset="35"
        strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="origin-[370px_275px]"
      />
      
      {/* Floating decorative elements */}
      <motion.g
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Code pill */}
        <rect x="320" y="30" width="120" height="36" rx="18" fill="var(--color-card-bg)" stroke="var(--color-accent)" strokeWidth="1.5" className="shadow-lg transition-colors duration-500" />
        <text x="380" y="52" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="monospace" fontWeight="bold">{"<Developer />"}</text>
      </motion.g>

      <motion.g
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Automation flow indicator */}
        <rect x="20" y="280" width="110" height="36" rx="18" fill="var(--color-card-bg)" stroke="var(--color-border)" strokeWidth="1.5" className="shadow-lg transition-colors duration-500" />
        <circle cx="45" cy="298" r="5" fill="#10b981" />
        <text x="85" y="302" textAnchor="middle" fill="currentColor" fontSize="10" fontFamily="sans-serif" fontWeight="bold" className="text-text">Active Flow</text>
      </motion.g>
    </svg>
  );
};

export const AboutIllustration = () => {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="about-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200/5 dark:text-slate-800/10" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#about-grid)" />

      {/* Intertwined creative-automation pipelines */}
      <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="text-slate-200 dark:text-slate-800" />
      <circle cx="200" cy="200" r="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-200 dark:text-slate-800" opacity="0.5" />
      
      {/* Central Sphere */}
      <motion.circle
        cx="200"
        cy="200"
        r="40"
        fill="var(--color-card-bg)"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        className="shadow-xl transition-colors duration-500"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <text x="200" y="205" textAnchor="middle" fill="var(--color-accent)" fontSize="16" fontFamily="monospace" fontWeight="extrabold">{"{O}"}</text>

      {/* Connected orbiting nodes */}
      {/* Branding */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="origin-[200px_200px]"
      >
        <g transform="translate(200, 60)">
          <circle r="20" fill="var(--color-card-bg)" stroke="var(--color-accent)" strokeWidth="1.5" className="transition-colors duration-500 shadow-md" />
          <circle cx="-5" cy="-5" r="3" fill="#ec4899" />
          <circle cx="5" cy="-5" r="3" fill="#3b82f6" />
          <circle cx="0" cy="5" r="3" fill="#eab308" />
        </g>
      </motion.g>

      {/* Web Development */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="origin-[200px_200px]"
      >
        <g transform="translate(110, 200)">
          <circle r="20" fill="var(--color-card-bg)" stroke="var(--color-border)" strokeWidth="1.5" className="transition-colors duration-500 shadow-md" />
          <text y="4" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="monospace" fontWeight="bold" className="text-text">{"</>"}</text>
        </g>
      </motion.g>

      {/* Automation */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="origin-[200px_200px]"
      >
        <g transform="translate(290, 200)">
          <circle r="20" fill="var(--color-card-bg)" stroke="var(--color-accent)" strokeWidth="1.5" className="transition-colors duration-500 shadow-md" opacity="0.9" />
          <path d="M -6 -2 L -6 2 L -2 6 L 2 6 L 6 2 L 6 -2 L 2 -6 L -2 -6 Z" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
          <circle r="3" fill="var(--color-accent)" />
        </g>
      </motion.g>

      {/* Social Growth */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="origin-[200px_200px]"
      >
        <g transform="translate(200, 340)">
          <circle r="20" fill="var(--color-card-bg)" stroke="var(--color-border)" strokeWidth="1.5" className="transition-colors duration-500 shadow-md" />
          <path d="M -8 5 L -3 -2 L 2 2 L 8 -6" fill="none" stroke="currentColor" strokeWidth="2" className="text-text" />
        </g>
      </motion.g>
      
      {/* Connected strands */}
      <path d="M 200 100 L 200 160" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-800" strokeDasharray="3 3" />
      <path d="M 200 240 L 200 300" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-800" strokeDasharray="3 3" />
      <path d="M 130 200 L 160 200" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-800" strokeDasharray="3 3" />
      <path d="M 240 200 L 270 200" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-800" strokeDasharray="3 3" />
    </svg>
  );
};

export const BrandingIllustration = () => {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 select-none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="32" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 4" />
      <rect x="24" y="24" width="32" height="32" rx="6" fill="none" stroke="currentColor" strokeWidth="2" className="text-text/70" />
      <circle cx="40" cy="40" r="8" fill="var(--color-accent)" opacity="0.8" />
      <path d="M 10 10 L 20 10 L 20 20" fill="none" stroke="var(--color-accent)" strokeWidth="1" />
      <path d="M 70 70 L 60 70 L 60 60" fill="none" stroke="var(--color-accent)" strokeWidth="1" />
    </svg>
  );
};

export const WebIllustration = () => {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 select-none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="16" width="56" height="48" rx="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-text/70" />
      <line x1="12" y1="28" x2="68" y2="28" stroke="currentColor" strokeWidth="1.5" className="text-text/70" />
      <circle cx="20" cy="22" r="2" fill="#ef4444" />
      <circle cx="26" cy="22" r="2" fill="#f59e0b" />
      <circle cx="32" cy="22" r="2" fill="#10b981" />
      <rect x="20" y="36" width="40" height="6" rx="2" fill="var(--color-accent)" opacity="0.8" />
      <rect x="20" y="48" width="24" height="6" rx="2" fill="currentColor" className="text-text/30" />
    </svg>
  );
};

export const AutomationIllustration = () => {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 select-none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="40" r="12" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
      <circle cx="54" cy="40" r="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-text/70" />
      <path d="M 26 40 L 54 40" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3 3" />
      {/* Animated pulsing node on flow line */}
      <motion.circle
        cx="26"
        cy="40"
        r="4"
        fill="var(--color-accent)"
        animate={{ cx: [26, 54, 26] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
};

export const SocialIllustration = () => {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 select-none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 16 64 L 32 40 L 48 52 L 68 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="68" cy="24" r="5" fill="var(--color-accent)" />
      <circle cx="32" cy="40" r="4" fill="currentColor" className="text-text/60" />
      <circle cx="48" cy="52" r="4" fill="currentColor" className="text-text/60" />
      <line x1="16" y1="64" x2="68" y2="64" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-text/40" />
    </svg>
  );
};
