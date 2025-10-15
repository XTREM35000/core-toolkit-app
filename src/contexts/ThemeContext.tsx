import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeName } from '@/types';
import { ThemeKey, resolveTheme } from '@/lib/themes';

interface ThemeContextType {
  theme: ThemeKey; // requested theme (can be 'system')
  resolvedTheme: Exclude<ThemeKey, 'system'>; // concrete theme used
  setTheme: (t: ThemeKey) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeKey>('whatsapp');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeKey | null;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    const resolved = resolveTheme(theme);
    // apply class for styling, keep previous compatibility `theme-<name>`
    document.documentElement.className = `theme-${resolved}`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (t: ThemeKey) => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'whatsapp' ? 'apple' : 'whatsapp'));
  };

  const resolvedTheme = resolveTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
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
