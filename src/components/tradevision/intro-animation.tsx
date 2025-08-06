
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

const lines = [
  'Parsing real-time market data...',
  'Detecting anomalous volume spikes...',
  'Analyzing whale wallet movements...',
  'Cross-referencing insider trade reports...',
  'Calibrating sentiment shifts...',
  'Signal lock acquired.',
];

export function IntroAnimation() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        setVisibleLines((prev) => [...prev, lines[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-card h-full">
        <div className="flex-1 flex flex-col items-center justify-center">
            <Bot className="w-16 h-16 text-primary animate-pulse" />
            <h2 className="text-2xl font-bold mt-4">SHADOW AI</h2>
            <p className="text-muted-foreground">Your Unfair Advantage in Volatile Markets.</p>
        </div>
        <div className="font-mono text-left text-sm text-green-400 w-full max-w-xs space-y-1 h-48">
            {visibleLines.map((line, i) => (
            <p key={i} className="animate-typing overflow-hidden whitespace-nowrap border-r-2 border-r-green-400">
                <span className="text-primary mr-2">&gt;</span>{line}
            </p>
            ))}
        </div>
    </div>
  );
}
