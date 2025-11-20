import React from 'react';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';

const Button = ({ onClick, children, className }) => {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out',
        theme === 'glass'
          ? 'bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20'
          : 'bg-accent text-white hover:scale-105',
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
