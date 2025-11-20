import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaGlassMartini } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themes = ['light', 'dark', 'glass'];

  return (
    <div className="flex items-center bg-gray-200/50 dark:bg-gray-800/50 rounded-full p-1">
      {themes.map(t => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className="relative p-2 rounded-full focus:outline-none"
        >
          {theme === t && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-accent rounded-full"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {t === 'light' && <FaSun className="text-yellow-500" />}
            {t === 'dark' && <FaMoon className="text-blue-500" />}
            {t === 'glass' && <FaGlassMartini className="text-cyan-500" />}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
