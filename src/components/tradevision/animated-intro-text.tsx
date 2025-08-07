
'use client';

import { cn } from "@/lib/utils";

export function AnimatedIntroText() {
  const text = "Select a symbol to begin analysis.";

  return (
    <p className="text-lg text-center whitespace-nowrap animate-zoom-in-out-glow" data-text={text}>
      {text}
    </p>
  );
}
