
'use client';

import { cn } from "@/lib/utils";

export function AnimatedIntroText() {
  const text = "Select a symbol to begin analysis.";

  return (
    <p className="text-lg text-center whitespace-nowrap font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[200%_auto] animate-text-shimmer">
      {text}
    </p>
  );
}
