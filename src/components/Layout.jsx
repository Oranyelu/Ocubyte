import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const Layout = ({ children }) => {

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
