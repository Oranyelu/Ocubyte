import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // 'dark', 'light', 'glass'

  const cycleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'dark') return 'light';
      if (prevTheme === 'light') return 'glass';
      return 'dark';
    });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-ocubyte-dark', 'theme-ocubyte-light', 'theme-glass');
    if (theme === 'dark') {
      root.classList.add('theme-ocubyte-dark');
    } else if (theme === 'light') {
      root.classList.add('theme-ocubyte-light');
    } else {
      root.classList.add('theme-glass');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
