'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import type { GenerateTradingSignalOutput } from '@/ai/flows/generate-trading-signal';
import { Bot, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface StrategyCardProps {
  strategy: GenerateTradingSignalOutput;
  isPending: boolean;
}

const getSignalClass = (signal: 'BUY' | 'SELL' | 'HOLD') => {
  switch (signal) {
    case 'BUY':
      return {
        text: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-400/50',
      };
    case 'SELL':
      return {
        text: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-400/50',
      };
    default:
      return {
        text: 'text-gray-400',
        bg: 'bg-gray-500/20',
        border: 'border-primary/50',
      };
  }
};

const GlitchingContent = () => (
    <div className='space-y-3 text-sm'>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground glitch-text" data-text="Entry Zone">Entry Zone</span>
            <span className="font-semibold glitch-text" data-text="Calculating...">Calculating...</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground glitch-text" data-text="Stop Loss">Stop Loss</span>
            <span className="font-semibold text-red-400/50 glitch-text" data-text="Calculating...">Calculating...</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground glitch-text" data-text="Take Profit">Take Profit</span>
            <span className="font-semibold text-green-400/50 glitch-text" data-text="Calculating...">Calculating...</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground glitch-text" data-text="Confidence">Confidence</span>
            <span className="font-semibold glitch-text" data-text="...% ...%">...%</span>
        </div>
    </div>
);


export function StrategyCard({ strategy, isPending }: StrategyCardProps) {
    const signalClasses = getSignalClass(strategy.signal);

    if (isPending) {
        return (
            <Card className='border-primary/80 animate-pulse'>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="text-primary" /> 
                            <span className='glitch-text' data-text="AI Strategy">AI Strategy</span>
                        </div>
                        <Badge
                            className={cn('text-base text-primary/80 bg-primary/20 glitch-text')}
                            data-text="...АНАЛИЗ..."
                            variant="secondary"
                        >
                           ...ANALYZING...
                        </Badge>
                    </CardTitle>
                    <CardDescription className='glitch-text' data-text="Processing signal...">Processing signal...</CardDescription>
                </CardHeader>
                <CardContent>
                    <GlitchingContent/>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground flex gap-2 items-start">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className='glitch-text' data-text="Please wait. Signal is being computed.">Please wait. Signal is being computed.</span>
                </CardFooter>
            </Card>
        )
    }

    return (
    <Card
      className={cn(
        'shadow-lg animate-snap-in',
        signalClasses.border
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-primary" /> AI Strategy
          </div>
          <Badge
            className={cn(
              'text-base',
              signalClasses.text,
              signalClasses.bg
            )}
            variant="secondary"
          >
            {strategy.signal}
          </Badge>
        </CardTitle>
        <CardDescription>{strategy.sentiment}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Entry Zone</span>
          <span className="font-semibold">{strategy.entryZone}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Stop Loss</span>
          <span className={cn('font-semibold', getSignalClass('SELL').text)}>
            {strategy.stopLoss}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Take Profit</span>
          <span className={cn('font-semibold', getSignalClass('BUY').text)}>
            {strategy.takeProfit}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-semibold">{strategy.confidence}</span>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex gap-2 items-start">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>{strategy.disclaimer}</span>
      </CardFooter>
    </Card>
  );
}
