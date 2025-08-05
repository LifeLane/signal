'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface IndicatorCardProps {
  title: string;
  value: string | number;
  interpretation: string;
  gaugeValue?: number;
  gaugeColor?: string;
}

export function IndicatorCard({
  title,
  value,
  interpretation,
  gaugeValue,
  gaugeColor,
}: IndicatorCardProps) {
  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <span className="text-sm font-semibold">{value}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {gaugeValue !== undefined && (
          <div className='space-y-1'>
            <Progress value={gaugeValue} className="h-2" />
          </div>
        )}
        <CardDescription className='text-xs'>{interpretation}</CardDescription>
      </CardContent>
    </Card>
  );
}
