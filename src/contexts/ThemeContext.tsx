import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeName } from '@/types';

interface ThemeContextType {
  theme: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeName>('whatsapp');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeName;
    if (stored && (stored === 'whatsapp' || stored === 'apple')) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'whatsapp' ? 'apple' : 'whatsapp');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
