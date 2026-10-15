import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import ThemeSwitcher from './ThemeSwitcher';
import { Menu, X, CreditCard, UserCheck, ShieldAlert, LogOut, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentSession, logout } from '../lib/auth';

const Navbar = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(getCurrentSession());
  }, [location.pathname]);

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
    { name: 'Automation', path: '/automation' },
    { name: 'Payment Gateway', path: '/gateway' },
    { name: 'Design Studio', path: '/studio' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLogout = () => {
    logout();
    setSession(null);
    navigate('/login', { replace: true });
  };

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
        <div className="hidden xl:flex items-center gap-3">
          <ThemeSwitcher />
          
          <Link
            to="/pay"
            className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-700/80 hover:border-accent text-text hover:text-accent transition-all duration-300 flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-accent" />
            <span>Pay Online</span>
          </Link>

          {/* Authenticated Session vs Login */}
          {session ? (
            <div className="flex items-center gap-2">
              {session.role === 'super_admin' ? (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>HQ Admin</span>
                </Link>
              ) : (
                <Link
                  to="/merchant/dashboard"
                  className="px-4 py-2 rounded-full text-xs font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full border border-slate-700/80 hover:border-rose-500 text-muted hover:text-rose-400 transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-xs font-semibold border border-accent/30 bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all duration-300 flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          <Link
            to="/contact"
            className="px-5 py-2 rounded-full text-xs font-semibold border border-slate-700 bg-secondary/80 text-text hover:border-accent transition-all duration-300"
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

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link
                  to="/pay"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-4 py-3 rounded-xl border border-slate-700 bg-secondary text-text font-bold text-sm hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span>Pay with MRN</span>
                </Link>

                {session ? (
                  <Link
                    to={session.role === 'super_admin' ? '/admin' : '/merchant/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-3 rounded-xl bg-accent text-primary font-bold text-sm shadow-lg shadow-accent/20 transition flex items-center justify-center gap-1.5"
                  >
                    <span>{session.role === 'super_admin' ? 'HQ Admin' : 'Dashboard'}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-3 rounded-xl bg-accent text-primary font-bold text-sm shadow-lg shadow-accent/20 transition flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
