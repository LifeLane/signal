
'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

const analysisSteps = [
  'Shadow Engine Engaged...',
  'Connecting to market data feed...',
  'Fetching real-time price...',
  'Analyzing 24h volume...',
  'Calculating RSI & EMA...',
  'Reviewing Bollinger Bands...',
  'Scanning news feeds for sentiment...',
  'Synthesizing final signal...',
];

export function SignalLoadingHooks() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < analysisSteps.length - 1) {
          return prevStep + 1;
        }
        clearInterval(interval);
        return prevStep;
      });
    }, 900); // How long each step is visible

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center text-center gap-3 font-medium text-sm overflow-hidden whitespace-nowrap">
      <Loader className="animate-spin h-5 w-5" />
      <div className="relative h-5 w-full text-center">
        {analysisSteps.map((step, index) => (
             <span
                key={step}
                className={cn(
                    "absolute w-full left-0 transition-all duration-500 ease-in-out",
                    currentStep === index ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                )}
             >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
