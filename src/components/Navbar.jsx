import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 p-4',
        theme === 'glass' ? 'bg-white/5 backdrop-blur-md' : 'bg-secondary'
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Ocubyte</Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <Link to="/about" className="hover:text-accent transition-colors">About</Link>
          <Link to="/projects" className="hover:text-accent transition-colors">Projects</Link>
          <Link to="/services" className="hover:text-accent transition-colors">Services</Link>
          <Link to="/automation" className="hover:text-accent transition-colors">Automation</Link>
          <Link to="/studio" className="hover:text-accent transition-colors">Studio</Link>
          <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
        </div>
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
