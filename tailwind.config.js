/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocubyte: {
          primary: "#002855",   // Navy base
          accent: "#D72638",    // Vibe Red
          cloud: "#e8f0ff",     // Daytime blue
          dark: "#111827",      // Dark solid
          light: "#f0faff",     // Light bg
        },
      },
      animation: {
        'cloud-drift': 'cloudDrift 40s linear infinite',
        'shimmer': 'shimmer 2s infinite ease-in-out',
        'pulseCloud': 'pulseCloud 8s ease-in-out infinite',
        'floatClouds': 'cloudLoop 30s linear infinite',
      },
      keyframes: {
        cloudDrift: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        cloudLoop: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        pulseCloud: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
          '50%': { transform: 'scale(1.2)', opacity: 1 },
        },
      }
    },
  },
  plugins: [],
}
