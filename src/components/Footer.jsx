import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={cn(
        'py-6 px-4 mt-12 border-t border-slate-800/60',
        theme === 'glass' ? 'bg-white/5 backdrop-blur-md' : 'bg-secondary/70'
      )}
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-text font-semibold">&copy; {new Date().getFullYear()} Ocubyte. All rights reserved.</span>
          <span className="text-muted/60">|</span>
          <span className="font-mono">RC - 9677104</span>
        </div>

        <div className="flex items-center gap-4 font-medium">
          <a href="/pay" className="hover:text-accent transition">Pay Online</a>
          <span className="text-muted/40">•</span>
          <a href="/gateway" className="hover:text-accent transition">Payment Gateway</a>
          <span className="text-muted/40">•</span>
          <a href="/login" className="hover:text-accent transition">Portal Sign In</a>
          <span className="text-muted/40">•</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-text/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Paystack Integrated
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
