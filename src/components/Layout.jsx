import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { cycleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-opacity-50 backdrop-blur-md">
        <Navbar />
      </header>
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
