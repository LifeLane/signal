'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, BarChartBig, GanttChart, TrendingUp, Wallet } from 'lucide-react';
import type { MarketData, Symbol } from './tradevision-page';

interface MarketDataCardProps {
  symbol: Symbol;
  data: MarketData;
}

const formatCurrency = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

export function MarketDataCard({ symbol, data }: MarketDataCardProps) {
  const isPositive = data.change >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{symbol.replace('USDT', '/USDT')}</span>
          <span className="text-2xl font-bold">{data.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2"><ArrowUpRight className="h-4 w-4" /> 24h Change</span>
          <span className={`font-semibold flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
            {data.change.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2"><BarChartBig className="h-4 w-4" /> 24h Volume</span>
          <span>{data.volume.toLocaleString()} {symbol.replace('USDT', '')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2"><Wallet className="h-4 w-4" /> Market Cap</span>
          <span>{formatCurrency(data.marketCap)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Sentiment</span>
          <span className={`font-semibold ${data.sentiment === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
            {data.sentiment}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
