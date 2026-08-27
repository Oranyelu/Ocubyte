import React from 'react';
import { cn } from '../utils/cn';

const GlassCard = ({ children, className }) => {
  return (
    <div
      className={cn(
        'premium-card p-8',
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
