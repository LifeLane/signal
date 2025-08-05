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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold">{price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
        <div className={cn(
          "text-sm font-medium",
          isPositive ? 'text-green-400' : 'text-red-400'
        )}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
      <Button variant='link' className='text-muted-foreground'>
        Notifications
      </Button>
    </div>
  );
}
