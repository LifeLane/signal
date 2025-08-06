
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Theme } from '@/app/theme-provider';

interface IndicatorCardProps {
  title: string;
  value: string | number;
  interpretation: string;
  gaugeValue?: number;
  theme: Theme;
}

export function IndicatorCard({
  title,
  value,
  interpretation,
  gaugeValue,
  theme,
}: IndicatorCardProps) {
  return (
    <Card className={cn(
      "bg-card/50",
      theme.name === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.primary/0.5)]'
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <span className="text-sm font-semibold text-right">{value}</span>
        </div>
        {gaugeValue !== undefined && (
            <Progress value={gaugeValue} className="h-1 mt-1" />
        )}
      </CardHeader>
      <CardContent>
        <CardDescription className='text-xs'>{interpretation}</CardDescription>
      </CardContent>
    </Card>
  );
}
