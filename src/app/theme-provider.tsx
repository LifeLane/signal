
'use client';

import { createContext, useContext } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import { Wand2, TreePalm, Sun, Mountain, type LucideIcon } from 'lucide-react';

export type ThemeName = 'neural-pulse' | 'neon-future' | 'forest-reserve' | 'solana-summer' | 'desert-mirage';

export type Theme = {
  name: ThemeName;
  icon: LucideIcon;
};

export const themes: Theme[] = [
    { name: 'neural-pulse', icon: Wand2 },
    { name: 'neon-future', icon: Wand2 },
    { name: 'forest-reserve', icon: TreePalm },
    { name: 'solana-summer', icon: Sun },
    { name: 'desert-mirage', icon: Mountain },
];

interface CustomThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function useTheme() {
  const { theme: currentThemeName, setTheme, resolvedTheme } = useNextTheme();
  
  const theme = themes.find(t => t.name === currentThemeName) || themes[0];
  
  const toggleTheme = () => {
    const currentIndex = themes.findIndex(t => t.name === currentThemeName);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].name);
  };

  return { theme, toggleTheme, resolvedTheme };
}

    