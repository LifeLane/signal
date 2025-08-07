
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { FearAndGreed } from '@/services/market-data';

interface FearAndGreedCardProps {
  index?: number;
  classification?: string;
}

export function FearAndGreedCard({ index, classification }: FearAndGreedCardProps) {
  if (index === undefined || !classification) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Fear & Greed Index</CardTitle>
                <CardDescription>Could not load Fear & Greed data.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  const getIndexColor = (value: number) => {
    if (value <= 20) return 'bg-red-600'; // Extreme Fear
    if (value <= 40) return 'bg-red-500'; // Fear
    if (value <= 60) return 'bg-amber-500'; // Neutral
    if (value <= 80) return 'bg-green-500'; // Greed
    return 'bg-green-600'; // Extreme Greed
  };

  return (
    <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.amber.400/0.5)]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span>Fear & Greed Index</span>
            <span className={cn("text-lg font-bold", getIndexColor(index).replace('bg-','text-'))}>
                {classification}
            </span>
        </CardTitle>
        <CardDescription>Current market sentiment based on multiple factors. (Source: alternative.me)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={index} className={cn("[&>div]:", getIndexColor(index))} />
        <div className="flex justify-between text-xs text-muted-foreground">
            <span>Extreme Fear</span>
            <span>Neutral</span>
            <span>Extreme Greed</span>
        </div>
      </CardContent>
    </Card>
  );
}
