import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const Layout = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { theme } = useTheme();

  // Map theme to logo SVG
  const logoSrc = {
    dark: '/Dark-theme_Logo_Ocubyte.svg',
    light: '/Light-Theme_Logo_Ocubyte.svg',
    glass: '/Liquid-Glass_Logo_Ocubyte.svg'
  }[theme] || '/Dark-theme_Logo_Ocubyte.svg';

  // Check if current view is the third-party payment checkout window
  const isThirdPartyCheckout = 
    location.pathname === '/gateway/checkout' ||
    (location.pathname === '/pay' && (
      searchParams.get('app') === 'obeag' ||
      searchParams.get('merchant_code') === 'obeag_portal' ||
      searchParams.get('merchant_id') === 'obeag_portal' ||
      (searchParams.get('amount') && searchParams.get('reference'))
    ));

  if (isThirdPartyCheckout) {
    return (
      <div className="min-h-screen flex flex-col bg-[#07090e]">
        {/* Header with Ocubyte Logo alone */}
        <header className="w-full py-5 px-6 border-b border-slate-800/80 bg-secondary/40 backdrop-blur-md flex items-center justify-center">
          <Link to="/" className="inline-flex items-center focus:outline-none group">
            <img 
              src={logoSrc} 
              alt="Ocubyte" 
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
        </header>
        <main className="w-full flex-grow flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-opacity-50 backdrop-blur-md">
        <Navbar />
      </header>
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
