'use client';
import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Interval } from './tradevision-page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface PositionRatioCardProps {
  ratio: number;
  selectedInterval: Interval;
  onSelectInterval: Dispatch<SetStateAction<Interval>>;
}

const intervals: Interval[] = ['5m', '15m', '1h', '4h', '1d'];

export function PositionRatioCard({ ratio, selectedInterval, onSelectInterval }: PositionRatioCardProps) {
  return (
    <Card className='bg-card'>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className='text-base font-semibold'>Long/Short Position Ratio</span>
           <Badge variant="outline" className='rounded-md bg-muted text-muted-foreground'>1d</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="default" className="bg-green-500/20 text-green-400 border-none font-semibold">LONG</Badge>
          <span className="text-xl font-semibold">{ratio}%</span>
        </div>
        <div className="flex items-center gap-2">
          {intervals.map((interval) => (
            <Button
              key={interval}
              variant="secondary"
              size="sm"
              onClick={() => onSelectInterval(interval)}
              className={cn(
                'rounded-lg text-sm font-medium flex-1 h-8',
                'bg-muted hover:bg-primary/20 text-muted-foreground',
                selectedInterval === interval && 'bg-primary text-primary-foreground'
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
