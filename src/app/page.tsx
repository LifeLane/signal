
'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import type { Theme } from '@/components/tradevision/tradevision-page';
import { cn } from '@/lib/utils';

const TradeVisionPageWithNoSSR = dynamic(
  () => import('@/components/tradevision/tradevision-page'),
  {
    ssr: false,
    loading: () => (
      <div className="h-dvh flex items-center justify-center bg-background">
        <Loader className="animate-spin h-10 w-10 text-primary" />
      </div>
    ),
  }
);

const themes: Theme[] = ['holographic', 'neural-pulse', 'glitch', 'neon-future', 'forest-reserve', 'solana-summer', 'desert-mirage'];

export default function Home() {
  const [theme, setTheme] = useState<Theme>('neural-pulse');

  const handleThemeToggle = () => {
    setTheme(prevTheme => {
      const currentIndex = themes.indexOf(prevTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    })
  }
  
  useEffect(() => {
    // On the client side, set the theme class on the html element
    document.documentElement.className = cn("dark", `theme-${theme}`);
  }, [theme]);

  return <TradeVisionPageWithNoSSR theme={theme} handleThemeToggle={handleThemeToggle} />;
}
