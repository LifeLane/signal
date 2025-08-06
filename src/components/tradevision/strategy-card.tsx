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
        border: 'border-green-400/50 shadow-green-400/20',
      };
    case 'SELL':
      return {
        text: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-400/50 shadow-red-400/20',
      };
    default:
      return {
        text: 'text-gray-400',
        bg: 'bg-gray-500/20',
        border: 'border-primary/50 shadow-primary/10',
      };
  }
};

export function StrategyCard({ strategy, isPending }: StrategyCardProps) {
    const signalClasses = getSignalClass(strategy.signal);

    return (
    <Card
      className={cn(
        'shadow-lg transition-all',
        isPending
          ? 'border-primary/80 animate-pulse-glow'
          : signalClasses.border
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
