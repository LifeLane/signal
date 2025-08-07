
'use client';

import { cn } from "@/lib/utils";

export function AnimatedIntroText() {
  const text = "Select a symbol to begin analysis.";

  return (
    <p className="text-lg text-center whitespace-nowrap">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={cn(
            char === ' ' && 'px-1' // Add space for whitespace characters
          )}
          style={{ animationDelay: `${index * 50}ms, ${index * 70}ms` }}
        >
          {char}
        </span>
      ))}
    </p>
  );
}
