'use client';

import { useState, useEffect, useTransition } from 'react';
import type { GenerateTradingSignalOutput } from '@/ai/flows/generate-trading-signal';
import { getTradingSignalAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from './header';
import { MarketDataCard } from './market-data-card';
import { ControlsPanel } from './controls-panel';
import { StrategyCard } from './strategy-card';
import TradingViewWidget from './trading-view-widget';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

export type Symbol = 'BTCUSDT' | 'ETHUSDT';
export type Interval = '1m' | '15m' | '1h' | '4h';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface MarketData {
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  sentiment: string;
  rsi: number;
  ema: number;
  vwap: number;
  bollingerBands: { upper: number; lower: number };
  sar: number;
  adx: number;
}

const generateMockData = (symbol: Symbol): MarketData => {
  const basePrice = symbol === 'BTCUSDT' ? 67215.4 : 3400.5;
  const price = parseFloat((basePrice + (Math.random() - 0.5) * (basePrice * 0.05)).toFixed(2));
  const change = parseFloat(((Math.random() - 0.4) * 5).toFixed(2));
  const volume = Math.floor(Math.random() * 5000) + 1000;
  const marketCap = symbol === 'BTCUSDT' ? 1.3e12 : 400e9;
  return {
    price,
    change,
    volume,
    marketCap,
    sentiment: change > 0 ? 'Bullish' : 'Bearish',
    rsi: Math.floor(Math.random() * 60) + 20,
    ema: parseFloat((price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
    vwap: parseFloat((price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
    bollingerBands: {
      upper: parseFloat((price * 1.05).toFixed(2)),
      lower: parseFloat((price * 0.95).toFixed(2)),
    },
    sar: parseFloat((price * (1 - Math.sign(change) * 0.02)).toFixed(2)),
    adx: Math.floor(Math.random() * 40) + 15,
  };
};

const intervalMapping: { [key in Interval]: string } = {
  '1m': '1',
  '15m': '15',
  '1h': '60',
  '4h': '240',
};

export default function TradeVisionPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [symbol, setSymbol] = useState<Symbol>('BTCUSDT');
  const [interval, setInterval] = useState<Interval>('15m');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [marketData, setMarketData] = useState<MarketData>(generateMockData('BTCUSDT'));
  const [aiSignal, setAiSignal] = useState<GenerateTradingSignalOutput | null>(null);

  useEffect(() => {
    setMarketData(generateMockData(symbol));
    setAiSignal(null);
  }, [symbol]);

  const handleGenerateSignal = () => {
    startTransition(async () => {
      try {
        const result = await getTradingSignalAction({
          symbol,
          interval,
          riskLevel,
          ...marketData,
        });
        setAiSignal(result);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Signal',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl">
        <AppHeader symbol={symbol} setSymbol={setSymbol} interval={interval} setInterval={setInterval} />
        
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-9">
            <TradingViewWidget symbol={symbol} interval={intervalMapping[interval]} />
          </div>
          
          <div className="lg:col-span-4 xl:col-span-3 space-y-8">
            <MarketDataCard symbol={symbol} data={marketData} />
            <ControlsPanel riskLevel={riskLevel} setRiskLevel={setRiskLevel} />
            <Button onClick={handleGenerateSignal} disabled={isPending} className="w-full h-12 text-lg font-bold">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Signal
                </>
              )}
            </Button>
            <StrategyCard signal={aiSignal} isLoading={isPending} />
          </div>
        </div>
      </div>
    </main>
  );
}
