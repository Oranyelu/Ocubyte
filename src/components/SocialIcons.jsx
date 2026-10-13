import React from 'react';
import { Instagram, Facebook, Linkedin, Youtube, Globe } from 'lucide-react';

export const XIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const TikTokIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.99 1.13 2.37 1.93 3.86 2.23.01 1.25.01 2.5.01 3.75-.92-.09-1.84-.36-2.69-.74-.91-.42-1.74-1.02-2.39-1.77v6.62c.04 1.48-.32 2.97-1.05 4.26-.81 1.34-2.07 2.38-3.56 2.87-1.46.46-3.08.38-4.49-.24-1.48-.68-2.68-1.94-3.32-3.48-.65-1.63-.58-3.48.21-5.04.81-1.52 2.27-2.65 3.95-3.07.38-.09.77-.14 1.17-.15v3.77c-.55.05-1.09.24-1.54.58-.64.49-1.03 1.25-1.05 2.05-.03.88.38 1.74 1.09 2.24.71.49 1.63.58 2.41.22.75-.36 1.29-1.09 1.38-1.92.05-1.64.02-3.28.03-4.93V0h.02z" />
  </svg>
);

export const getSocialIcon = (platform, className = 'h-5 w-5') => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram className={className} />;
    case 'x':
    case 'twitter':
      return <XIcon className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'tiktok':
      return <TikTokIcon className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    default:
      return <Globe className={className} />;
  }
};

export const getSocialColor = (platform) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'hover:text-pink-500 hover:bg-pink-500/10 border-pink-500/20';
    case 'x':
    case 'twitter':
      return 'hover:text-slate-100 hover:bg-slate-100/10 border-slate-100/20';
    case 'facebook':
      return 'hover:text-blue-500 hover:bg-blue-500/10 border-blue-500/20';
    case 'tiktok':
      return 'hover:text-teal-400 hover:bg-teal-400/10 border-teal-400/20';
    case 'linkedin':
      return 'hover:text-sky-500 hover:bg-sky-500/10 border-sky-500/20';
    case 'youtube':
      return 'hover:text-red-500 hover:bg-red-500/10 border-red-500/20';
    default:
      return 'hover:text-accent hover:bg-accent/10 border-accent/20';
  }
};
