'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MomentumIndicatorProps {
  label: string;
  value: number;
  color: string;
}

const MomentumIndicator = ({ label, value, color }: MomentumIndicatorProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-10 h-20 bg-muted rounded-full overflow-hidden relative">
      <div
        className={cn('absolute bottom-0 left-0 right-0', color)}
        style={{ height: `${value}%` }}
      />
    </div>
    <span className="text-sm text-muted-foreground">{label} {value}</span>
  </div>
);

export function MomentumCard() {
  return (
    <Card className='bg-card'>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className='text-base font-semibold text-primary'>Current Trend</CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>05:30 Analysis</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full border-[6px] border-amber-400 bg-amber-400/20 flex items-center justify-center text-center mx-auto">
            <span className="font-semibold text-lg text-foreground">Weak<br />Uptrend</span>
        </div>
        <div className="text-center">
            <p className='text-muted-foreground'>Momentum</p>
            <p className='text-lg font-semibold text-red-400'>Increased Downtrend potential</p>
        </div>
        <div className="grid grid-cols-3 gap-8 items-center w-full">
            <MomentumIndicator label="Uptrend" value={25} color="bg-green-500" />
            <MomentumIndicator label="Downtrend" value={50} color="bg-red-500" />
            <MomentumIndicator label="Consolidation" value={25} color="bg-amber-500" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
            <span>Momentum: Indicates potential gradual trend shift</span>
        </div>
      </CardContent>
    </Card>
  );
}
