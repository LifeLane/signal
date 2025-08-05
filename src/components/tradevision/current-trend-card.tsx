'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const TrendMeter = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-12 h-20 bg-muted rounded-full overflow-hidden flex flex-col-reverse">
      <div style={{ height: `${value}%` }} className={color} />
    </div>
    <span className="text-sm text-muted-foreground">{label} {value}</span>
  </div>
);

export function CurrentTrendCard() {
  return (
    <Card className='bg-card'>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className='text-base font-semibold text-primary'>Current Trend</CardTitle>
        <span className="text-xs text-muted-foreground">05:30 Analysis</span>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-yellow-400/20 flex items-center justify-center text-center">
          <div className="w-28 h-28 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="font-semibold text-lg text-background">Weak<br />Uptrend</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Momentum</p>
          <p className="text-red-400 font-semibold text-lg">Increased Downtrend potential</p>
        </div>
        <div className="flex justify-around w-full">
          <TrendMeter value={25} label="Uptrend" color="bg-green-500" />
          <TrendMeter value={50} label="Downtrend" color="bg-red-500" />
          <TrendMeter value={25} label="Consolidation" color="bg-yellow-500" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Momentum: Indicates potential gradual trend shift</span>
          <HelpCircle className="w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  );
}
