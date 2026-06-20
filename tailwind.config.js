/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        text: 'var(--color-text)',
        ocubyte: {
          'dark-blue': '#0A1018',
          'orange': '#F59E0B',
          'red-pink': '#FF5E57',
          'light-gray': '#E5E7EB',
          'cyan': '#00B7EF',
          'green-cyan': '#00FFAB',
        },
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite',
        'neon-flicker': 'flicker 1.5s infinite alternate',
        'background-shift': 'move-bg 15s ease infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(var(--color-accent), 0.2), 0 0 10px rgba(var(--color-accent), 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(var(--color-accent), 0.6), 0 0 30px rgba(var(--color-accent), 0.4)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            opacity: 1,
            filter: 'drop-shadow(0 0 8px var(--color-accent))',
          },
          '20%, 24%, 55%': {
            opacity: 0.7,
            filter: 'none',
          },
        },
        'move-bg': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
