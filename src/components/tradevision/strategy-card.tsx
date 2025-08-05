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
import { Bot, Check, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface StrategyCardProps {
  strategy: GenerateTradingSignalOutput;
}

const getSignalClass = (signal: 'BUY' | 'SELL' | 'HOLD') => {
  switch (signal) {
    case 'BUY':
      return 'text-green-400';
    case 'SELL':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export function StrategyCard({ strategy }: StrategyCardProps) {
  return (
    <Card className="border-primary/50 shadow-lg shadow-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-primary" /> AI Strategy
          </div>
          <Badge
            className={cn(
              'text-base',
              getSignalClass(strategy.signal),
              strategy.signal === 'BUY' && 'bg-green-500/20',
              strategy.signal === 'SELL' && 'bg-red-500/20',
              strategy.signal === 'HOLD' && 'bg-gray-500/20'
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
          <span className="font-semibold text-red-400">
            {strategy.stopLoss}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Take Profit</span>
          <span className="font-semibold text-green-400">
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
