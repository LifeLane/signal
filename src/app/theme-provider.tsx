
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

// The 'neural-pulse' theme is now the base style applied by default.
// The toggle will cycle through these alternate color layouts.
const themes = ['neon-future', 'forest-reserve', 'solana-summer', 'desert-mirage'];
export type Theme = (typeof themes)[number];


interface ThemeContextType {
  theme: Theme | 'neural-pulse';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Set 'neural-pulse' as the default theme.
  const [theme, setTheme] = useState<Theme | 'neural-pulse'>('neural-pulse');

  useEffect(() => {
    // Base classes are always applied. The specific theme class overrides the colors.
    document.documentElement.className = cn('dark', `theme-${theme}`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
        if (prevTheme === 'neural-pulse') {
            return themes[0];
        }
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
