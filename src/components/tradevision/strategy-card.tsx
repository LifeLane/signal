'use client';

import { Bot, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import type { GenerateTradingSignalOutput } from '@/ai/flows/generate-trading-signal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StrategyCardProps {
  signal: GenerateTradingSignalOutput | null;
  isLoading: boolean;
}

const SignalDisplay = ({ signal }: { signal: GenerateTradingSignalOutput['signal'] }) => {
  const isBuy = signal === 'BUY';
  const isSell = signal === 'SELL';
  return (
    <span
      className={cn(
        'font-bold text-2xl flex items-center gap-2',
        isBuy && 'text-green-400',
        isSell && 'text-red-400',
      )}
    >
      {isBuy && <TrendingUp />}
      {isSell && <TrendingDown />}
      {signal}
    </span>
  );
};

export function StrategyCard({ signal, isLoading }: StrategyCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary" /> AI Strategy
          </CardTitle>
          <CardDescription>Generating quantum-fueled insights...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!signal) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[200px]">
        <Sparkles className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Ready for a Signal?</h3>
        <p className="mt-1 text-sm text-muted-foreground">Click "Generate Signal" to get your AI-powered trading strategy.</p>
      </Card>
    );
  }

  return (
    <Card className="border-primary/50 shadow-lg shadow-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Bot className="text-primary" /> AI Strategy</div>
          <Badge variant="outline" className="text-base">Confidence: {signal.confidence}</Badge>
        </CardTitle>
        <CardDescription>
          {signal.sentiment}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center bg-card-foreground/5 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Signal</p>
          <SignalDisplay signal={signal.signal} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="bg-card-foreground/5 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Entry Zone</p>
                <p className="font-mono font-semibold">{signal.entryZone}</p>
            </div>
            <div className="bg-card-foreground/5 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Take Profit</p>
                <p className="font-mono font-semibold text-green-400">{signal.takeProfit}</p>
            </div>
        </div>
         <div className="bg-red-500/10 p-3 rounded-md text-center">
            <p className="text-xs text-red-400/80">Stop Loss</p>
            <p className="font-mono font-semibold text-red-400">{signal.stopLoss}</p>
        </div>
        
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs">
         <div className='flex justify-between w-full'>
            <Badge variant={signal.riskRating === 'Low' ? 'default' : signal.riskRating === 'Medium' ? 'secondary' : 'destructive'}>
                AI Risk: {signal.riskRating}
            </Badge>
            <Badge variant="secondary">GPT Confidence: {signal.gptConfidenceScore}%</Badge>
        </div>
        <p className="text-muted-foreground pt-2 italic">"{signal.disclaimer}"</p>
      </CardFooter>
    </Card>
  );
}
