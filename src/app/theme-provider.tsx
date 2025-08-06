
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Theme } from '@/components/tradevision/tradevision-page';

const themes: Theme[] = ['neural-pulse', 'holographic', 'glitch', 'neon-future', 'forest-reserve', 'solana-summer', 'desert-mirage'];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('neural-pulse');

  useEffect(() => {
    document.documentElement.className = cn('dark', `theme-${theme}`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const currentIndex = themes.indexOf(prevTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
