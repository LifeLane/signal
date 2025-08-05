'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  change: number;
}

export function PriceDisplay({ price, change }: PriceDisplayProps) {
  const isPositive = change >= 0;
  return (
    <div className="flex items-center justify-between rounded-lg bg-card p-3">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        <span className={cn(
          "text-sm font-medium",
          isPositive ? 'text-green-400' : 'text-red-400'
        )}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
      <Button variant="link" className="text-primary p-0 h-auto text-sm">
        Pluto Noti
      </Button>
    </div>
  );
}
