
'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Replace } from 'lucide-react';
import type { Symbol } from './tradevision-page';
import { Card, CardContent } from '../ui/card';

interface PriceDisplayProps {
  symbol: Symbol;
  price: number;
  change: number;
  onChangeSymbol: () => void;
}

export function PriceDisplay({ symbol, price, change, onChangeSymbol }: PriceDisplayProps) {
  const isPositive = change >= 0;
  return (
    <Card className="animate-multi-color-glow bg-card/50">
        <CardContent className='p-4'>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                    <h2 className="text-2xl font-semibold">{price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                    <span className="text-sm text-muted-foreground">{symbol} / USD</span>
                    </div>
                    <div className={cn(
                    "text-sm font-medium",
                    isPositive ? 'text-green-400' : 'text-red-400'
                    )}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </div>
                </div>
                <Button variant='ghost' size='icon' onClick={onChangeSymbol}>
                    <Replace className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
