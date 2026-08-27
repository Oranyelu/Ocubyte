import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={cn(
        'p-4 mt-8',
        theme === 'glass' ? 'bg-white/5 backdrop-blur-md' : 'bg-secondary'
      )}
    >
      <div className="container mx-auto text-center text-text flex flex-row flex-wrap justify-center items-center gap-x-3 text-sm">
        <span>&copy; {new Date().getFullYear()} Ocubyte. All rights reserved.</span>
        <span className="text-muted font-light">|</span>
        <span className="text-muted font-mono">RC - 9677104</span>
      </div>
    </footer>
  );
};

export default Footer;
