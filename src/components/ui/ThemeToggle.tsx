import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="rounded px-2 py-1 border"
        aria-label="Sélection du thème"
      >
        <option value="system">Système</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="apple">Clair</option>
      </select>
      <button onClick={toggleTheme} className="px-2 py-1 rounded border">
        Basculer ({resolvedTheme})
      </button>
    </div>
  );
};

export default ThemeToggle;
