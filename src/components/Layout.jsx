import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const Layout = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

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
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#07090e]">
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
