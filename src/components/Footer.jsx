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
      <div className="container mx-auto text-center text-text">
        <p>&copy; {new Date().getFullYear()} Ocubyte. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
