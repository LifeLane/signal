
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Wand2, TreePalm, Sun, Mountain, type LucideIcon } from 'lucide-react';


export type Theme = {
  name: 'neural-pulse' | 'neon-future' | 'forest-reserve' | 'solana-summer' | 'desert-mirage';
  icon: LucideIcon;
};

// The 'neural-pulse' theme is now the base style applied by default.
// The toggle will cycle through these alternate color layouts.
const themes: Theme[] = [
    { name: 'neural-pulse', icon: Wand2 },
    { name: 'neon-future', icon: Wand2 }, // Assuming neon-future still uses the wand or a similar icon
    { name: 'forest-reserve', icon: TreePalm },
    { name: 'solana-summer', icon: Sun },
    { name: 'desert-mirage', icon: Mountain },
];


interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Set 'neural-pulse' as the default theme.
  const [theme, setTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    // Base classes are always applied. The specific theme class overrides the colors.
    document.documentElement.className = cn('dark', `theme-${theme.name}`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const currentIndex = themes.findIndex(t => t.name === prevTheme.name);
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
