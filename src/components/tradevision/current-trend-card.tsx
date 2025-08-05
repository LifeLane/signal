'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export function CurrentTrendCard() {
  return (
    <Card className='bg-card'>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className='text-base font-semibold'>Current Trend</CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>1h</span>
          <Info className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 items-center">
        <div className="w-32 h-32 rounded-full border-[6px] border-primary bg-primary/20 flex items-center justify-center text-center mx-auto">
            <span className="font-semibold text-lg text-foreground">Strong<br />Sell</span>
        </div>
        <div className="text-sm space-y-2">
            <div className='flex justify-between'><span>RSI (14)</span> <strong>35.7 (Sell)</strong></div>
            <div className='flex justify-between'><span>STOCH (9,6)</span> <strong>42.1 (Sell)</strong></div>
            <div className='flex justify-between'><span>MACD (12,26)</span> <strong>-2.3 (Sell)</strong></div>
            <div className='flex justify-between'><span>ADX (14)</span> <strong>68.2 (Sell)</strong></div>
        </div>
      </CardContent>
    </Card>
  );
}
