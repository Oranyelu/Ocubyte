import React from 'react';
import { cn } from '../utils/cn';

const GlassCard = ({ children, className }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-md',
        'transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-white/10',
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
