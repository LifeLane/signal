
'use client';

import type { TradingSignalWithTargets } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import type { Theme } from './tradevision-page';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Bot, Info } from 'lucide-react';

interface SignalsHistoryPageProps {
  signals: TradingSignalWithTargets[];
  theme: Theme;
}

const getSignalClass = (signal?: 'BUY' | 'SELL' | 'HOLD') => {
  switch (signal) {
    case 'BUY':
      return {
        text: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-400/50',
        glow: '[--glow-color:theme(colors.green.400)]'
      };
    case 'SELL':
      return {
        text: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-400/50',
        glow: '[--glow-color:theme(colors.red.400)]'
      };
    default:
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-400/50',
        glow: '[--glow-color:theme(colors.amber.400)]'
      };
  }
};


export function SignalsHistoryPage({ signals, theme }: SignalsHistoryPageProps) {
    if (signals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                <Bot className="w-16 h-16 text-primary" />
                <h2 className="text-2xl font-bold mt-4">No Signals Yet</h2>
                <p className="text-muted-foreground">Your generated trading signals will appear here.</p>
            </div>
        );
    }
    
  return (
    <div className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1">
        <h1 className="text-2xl font-bold text-foreground">Signal History</h1>
        {signals.map((signal) => {
            const signalClasses = getSignalClass(signal.signal);
            return (
                <Card
                key={signal.id}
                className={cn(
                    'shadow-lg transition-all',
                    theme === 'holographic' && signalClasses.border,
                    theme === 'neural-pulse' && `animate-pulse-glow ${signalClasses.glow}`,
                    theme === 'glitch' && 'animate-snap-in'
                )}
                >
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bot className="text-primary" /> {signal.symbol} Strategy
                    </div>
                    <Badge
                        className={cn(
                        'text-base',
                        signalClasses.text,
                        signalClasses.bg
                        )}
                        variant="secondary"
                    >
                        {signal.signal}
                    </Badge>
                    </CardTitle>
                    <CardDescription>{signal.justification}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Entry Zone</span>
                        <span className="font-semibold">{signal.entryZone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Stop Loss</span>
                        <span className={cn('font-semibold', getSignalClass('SELL').text)}>
                            {signal.stopLoss}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Take Profit</span>
                        <span className={cn('font-semibold', getSignalClass('BUY').text)}>
                            {signal.takeProfit}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-semibold">{signal.confidence}</span>
                    </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground flex gap-2 items-start">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{signal.disclaimer}</span>
                </CardFooter>
                </Card>
            )
        })}
    </div>
  );
}
