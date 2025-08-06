
'use client';

import { useEffect, useState } from 'react';

const hooks = [
  'Analyze Market Trends',
  'Predict Price Action',
  'Leverage AI Insights',
  'Trade With Confidence',
];

export function IntroHooks() {
  const [visibleHooks, setVisibleHooks] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < hooks.length) {
        setVisibleHooks((prev) => [...prev, hooks[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isMounted]);

  return (
    <div className="font-mono text-left text-lg text-green-400 w-full space-y-2">
      {hooks.map((line, i) => (
        <p key={i} className="overflow-hidden whitespace-nowrap">
            <span className="text-primary mr-2">&gt;</span>
            <span className={visibleHooks[i] ? 'animate-typing' : 'opacity-0'}>
              {line}
            </span>
        </p>
      ))}
    </div>
  );
}
