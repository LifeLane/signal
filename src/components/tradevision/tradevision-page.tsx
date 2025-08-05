'use client';

import { useState, useEffect } from 'react';

import { AppHeader } from './header';
import { SymbolSelector } from './symbol-selector';
import { PriceDisplay } from './price-display';
import { CurrentTrendCard } from './current-trend-card';
import { PositionRatioCard } from './position-ratio-card';
import { BottomBar } from './bottom-bar';
import { Separator } from '../ui/separator';

export type Symbol = 'BTC' | 'ETH' | 'XRP' | 'SOL' | 'DOGE';
export type Interval = '5m' | '15m' | '1h' | '4h' | '1d';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface MarketData {
  price: number;
  change: number;
  longShortRatio: number;
}

const generateMockData = (symbol: Symbol): MarketData => {
  const basePrices: Record<Symbol, number> = {
    BTC: 67215.4,
    ETH: 3400.5,
    XRP: 0.48,
    SOL: 150.2,
    DOGE: 0.15,
  };
  const basePrice = basePrices[symbol];
  const price = parseFloat((basePrice + (Math.random() - 0.5) * (basePrice * 0.05)));
  const change = parseFloat(((Math.random() - 0.4) * 5).toFixed(2));
  return {
    price,
    change,
    longShortRatio: parseFloat((50 + (Math.random() - 0.5) * 5).toFixed(2)),
  };
};

export default function TradeVisionPage() {
  const [symbol, setSymbol] = useState<Symbol>('BTC');
  const [interval, setInterval] = useState<Interval>('1d');
  const [marketData, setMarketData] = useState<MarketData>(generateMockData('BTC'));

  useEffect(() => {
    const data = generateMockData(symbol)
    setMarketData(data);
  }, [symbol]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMarketData(generateMockData(symbol));
    }, 5000);
    return () => clearInterval(intervalId);
  }, [symbol]);

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <SymbolSelector selectedSymbol={symbol} onSelectSymbol={setSymbol} />
        <PriceDisplay price={marketData.price} change={marketData.change} />
        <CurrentTrendCard />
        <PositionRatioCard
          ratio={marketData.longShortRatio}
          selectedInterval={interval}
          onSelectInterval={setInterval}
        />
        <div className="h-24"></div>
      </main>
      <Separator className="bg-border/20"/>
      <BottomBar />
    </div>
  );
}
