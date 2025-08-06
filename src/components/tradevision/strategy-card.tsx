
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { TradingSignalWithTargets } from '@/app/actions';
import { Bot, Info, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import type { Theme } from './tradevision-page';

interface StrategyCardProps {
  strategy: TradingSignalWithTargets | null;
  isPending: boolean;
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

const PendingContent = () => (
    <div className='space-y-3 text-sm'>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Entry Zone</span>
            <span className="font-semibold text-muted-foreground/50">Calculating...</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Stop Loss</span>
            <span className="font-semibold text-muted-foreground/50">Calculating...</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Take Profit</span>
            <span className="font-semibold text-muted-foreground/50">Calculating...</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-semibold text-muted-foreground/50">...%</span>
        </div>
    </div>
);


export function StrategyCard({ strategy, isPending, theme }: StrategyCardProps) {
    const signalClasses = getSignalClass(strategy?.signal);
    const cardTitle = strategy?.symbol ? `AI Strategy for ${strategy.symbol}` : 'AI Strategy';

    if (isPending || !strategy) {
        return (
            <Card className={cn(
                'transition-all',
                theme === 'holographic' && 'border-primary/50 animate-pulse',
                theme === 'neural-pulse' && 'animate-none border-primary/50',
                theme === 'glitch' && 'animate-snap-in',
            )}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="text-primary" /> 
                            <span>{isPending ? 'AI Strategy' : cardTitle}</span>
                        </div>
                         <Badge
                            className={cn(
                                'text-base',
                                theme === 'glitch' ? 'animate-glitch text-transparent' : 'text-primary/80 bg-primary/20'
                            )}
                            variant="secondary"
                        >
                           ANALYZING...
                        </Badge>
                    </CardTitle>
                    <CardDescription>Processing signal based on market data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <PendingContent/>
                </CardContent>
            </Card>
        )
    }

    return (
    <Card
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
            <Bot className="text-primary" /> {cardTitle}
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
        <CardDescription>{strategy.justification}</CardDescription>
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

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className="flex items-center gap-2 text-xs">
                        <Cpu className="w-4 h-4" />
                        Analysis Breakdown
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ul className="space-y-2 text-xs text-muted-foreground p-2">
                        <li><span className='font-semibold text-foreground'>RSI:</span> {strategy.rsiInterpretation}</li>
                        <li><span className='font-semibold text-foreground'>EMA:</span> {strategy.emaInterpretation}</li>
                        <li><span className='font-semibold text-foreground'>ADX:</span> {strategy.adxInterpretation}</li>
                        <li><span className='font-semibold text-foreground'>VWAP:</span> {strategy.vwapInterpretation}</li>
                        <li><span className='font-semibold text-foreground'>Bollinger Bands:</span> {strategy.bollingerBandsInterpretation}</li>
                        <li><span className='font-semibold text-foreground'>Parabolic SAR:</span> {strategy.sarInterpretation}</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex gap-2 items-start">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>{strategy.disclaimer}</span>
      </CardFooter>
    </Card>
  );
}
