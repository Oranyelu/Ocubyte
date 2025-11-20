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
    },
  },
  plugins: [],
};
