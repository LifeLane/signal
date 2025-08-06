'use client';
import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Interval } from './tradevision-page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

interface PositionRatioCardProps {
  ratio: number;
  selectedInterval: Interval;
  onSelectInterval: Dispatch<SetStateAction<Interval>>;
}

const intervals: Interval[] = ['5m', '15m', '1h', '4h', '1d'];

export function PositionRatioCard({ ratio, selectedInterval, onSelectInterval }: PositionRatioCardProps) {
  const longRatio = ratio;
  const shortRatio = 100 - ratio;

  return (
    <Card className='bg-card'>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className='text-base font-semibold'>Long/Short Position Ratio</span>
        </CardTitle>
        <CardDescription>Overall market sentiment based on open positions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400 font-semibold">Long {longRatio.toFixed(2)}%</span>
            <span className="text-red-400 font-semibold">Short {shortRatio.toFixed(2)}%</span>
          </div>
          <Progress value={longRatio} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-red-500" />
        </div>
        <div className="flex items-center gap-2">
          {intervals.map((interval) => (
            <Button
              key={interval}
              variant="secondary"
              size="sm"
              onClick={() => onSelectInterval(interval)}
              className={cn(
                'rounded-lg text-xs font-medium flex-1 h-8',
                'bg-muted hover:bg-primary/20 text-muted-foreground',
                selectedInterval === interval && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {interval}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
