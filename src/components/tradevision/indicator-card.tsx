
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface IndicatorCardProps {
  title: string;
  value: string | number;
  interpretation: string;
  gaugeValue?: number;
}

export function IndicatorCard({
  title,
  value,
  interpretation,
  gaugeValue,
}: IndicatorCardProps) {
  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <span className="text-sm font-semibold">{value}</span>
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
