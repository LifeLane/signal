'use client';

import type { Dispatch, SetStateAction } from 'react';
import { BrainCircuit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Symbol, Interval } from './tradevision-page';

interface AppHeaderProps {
  symbol: Symbol;
  setSymbol: Dispatch<SetStateAction<Symbol>>;
  interval: Interval;
  setInterval: Dispatch<SetStateAction<Interval>>;
}

export function AppHeader({ symbol, setSymbol, interval, setInterval }: AppHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <BrainCircuit className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tighter text-foreground">
          TradeVision <span className="text-primary">AI</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Select value={symbol} onValueChange={(value: Symbol) => setSymbol(value)}>
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue placeholder="Symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
            <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
          </SelectContent>
        </Select>
        <Select value={interval} onValueChange={(value: Interval) => setInterval(value)}>
          <SelectTrigger className="w-[120px] h-10">
            <SelectValue placeholder="Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1m</SelectItem>
            <SelectItem value="15m">15m</SelectItem>
            <SelectItem value="1h">1h</SelectItem>
            <SelectItem value="4h">4h</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
