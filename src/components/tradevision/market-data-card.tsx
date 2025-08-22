
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketDataCardProps {
  volume: number;
  marketCap: number;
}

export function MarketDataCard({ volume, marketCap }: MarketDataCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toString();
  };

  return (
    <Card className="bg-card animate-pulse-glow [--glow-color:hsl(var(--accent)/0.7)]">
      <CardHeader>
        <CardTitle>Market Data</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">24h Volume</p>
            <p className="font-semibold">${formatNumber(volume)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-semibold">${formatNumber(marketCap)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
