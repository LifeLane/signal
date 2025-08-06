
'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

const analysisSteps = [
  'Connecting to market data feed...',
  'Fetching real-time price...',
  'Analyzing 24h volume...',
  'Calculating RSI...',
  'Evaluating EMA trends...',
  'Reviewing Bollinger Bands...',
  'Scanning news feeds...',
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
    <div className="flex items-center gap-3 text-primary-foreground font-medium text-sm overflow-hidden whitespace-nowrap">
      <Loader className="animate-spin h-5 w-5" />
      <div className="relative h-5 w-full">
        {analysisSteps.map((step, index) => (
             <span
                key={step}
                className={cn(
                    "absolute transition-all duration-500 ease-in-out",
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
