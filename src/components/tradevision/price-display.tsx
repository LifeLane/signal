'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface PriceDisplayProps {
  price: number;
  change: number;
}

export function PriceDisplay({ price, change }: PriceDisplayProps) {
  const isPositive = change >= 0;
  return (
    <div className="flex items-center justify-between rounded-lg bg-card p-3">
      <div className='flex items-center gap-4'>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-lg">
          B
        </div>
        <div>
          <h2 className="text-lg font-semibold">Bitcoin</h2>
          <p className="text-sm text-muted-foreground">BTC/USDT</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-semibold">{price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        <div className={cn(
          "text-sm font-medium",
          isPositive ? 'text-green-400' : 'text-red-400'
        )}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
