import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import ThemeSwitcher from './ThemeSwitcher';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Map theme to logo SVG
  const logoSrc = {
    dark: '/Dark-theme_Logo_Ocubyte.svg',
    light: '/Light-Theme_Logo_Ocubyte.svg',
    glass: '/Liquid-Glass_Logo_Ocubyte.svg'
  }[theme] || '/Dark-theme_Logo_Ocubyte.svg';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Automation Studio', path: '/automation' },
    { name: 'Design Studio', path: '/studio' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 border-b',
        theme === 'glass' 
          ? 'bg-[#05050e]/30 border-white/5 backdrop-blur-xl' 
          : 'bg-primary border-slate-200/50 dark:border-slate-800/50'
      )}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <img 
            src={logoSrc} 
            alt="Ocubyte Logo" 
            className="h-9 w-auto transition-transform duration-500 group-hover:scale-110" 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden xl:flex gap-8 items-center font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative text-sm transition-colors duration-300 py-1 px-2 rounded-md hover:text-accent',
                  isActive ? 'text-accent' : 'text-text/80'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="hidden xl:flex items-center gap-4">
          <ThemeSwitcher />
          <Link
            to="/contact"
            className="px-5 py-2 rounded-full text-sm font-semibold border border-accent/20 bg-accent/5 hover:bg-accent hover:text-white transition-all duration-300"
          >
            Start Project
          </Link>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex xl:hidden items-center gap-3">
          <ThemeSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-text hover:text-accent transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden w-full bg-primary border-t border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'text-lg font-semibold py-2 transition-colors duration-200 hover:text-accent',
                      isActive ? 'text-accent border-l-2 border-accent pl-3' : 'text-text/80 pl-3'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-center px-6 py-3 rounded-xl bg-accent text-white font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start a Partnership
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
