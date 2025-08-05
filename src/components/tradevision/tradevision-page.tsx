'use client';

import { useState, useEffect, useTransition } from 'react';
import { toast } from '@/hooks/use-toast';
import { getTradingSignalAction } from '@/app/actions';

import { AppHeader } from './header';
import { SymbolSelector } from './symbol-selector';
import { PriceDisplay } from './price-display';
import { CurrentTrendCard } from './current-trend-card';
import { PositionRatioCard } from './position-ratio-card';
import { BottomBar } from './bottom-bar';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';
import { StrategyCard } from './strategy-card';
import { RiskAnalysisCard } from './risk-analysis-card';
import { MarketDataCard } from './market-data-card';
import type { GenerateTradingSignalOutput } from '@/ai/flows/generate-trading-signal';

export type Symbol = 'BTC' | 'ETH' | 'XRP' | 'SOL' | 'DOGE';
export type Interval = '5m' | '15m' | '1h' | '4h' | '1d';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface MarketData {
  price: number;
  change: number;
  volume24h: number;
  marketCap: number;
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
  const price = parseFloat(
    (basePrice + (Math.random() - 0.5) * (basePrice * 0.05))
  );
  const change = parseFloat(((Math.random() - 0.4) * 5).toFixed(2));
  const volume24h = Math.random() * 1000000000;
  const marketCap = Math.random() * 1000000000000;
  return {
    price,
    change,
    volume24h,
    marketCap,
    longShortRatio: parseFloat((50 + (Math.random() - 0.5) * 5).toFixed(2)),
  };
};

export default function TradeVisionPage() {
  const [isPending, startTransition] = useTransition();
  const [symbol, setSymbol] = useState<Symbol>('BTC');
  const [interval, setInterval] = useState<Interval>('1d');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [marketData, setMarketData] = useState<MarketData>(
    generateMockData('BTC')
  );
  const [signal, setSignal] = useState<GenerateTradingSignalOutput | null>(
    null
  );

  useEffect(() => {
    const data = generateMockData(symbol);
    setMarketData(data);
    setSignal(null);
  }, [symbol]);

  const handleGetSignal = async () => {
    startTransition(async () => {
      try {
        const input = {
          symbol: `${symbol}USDT`,
          interval,
          price: marketData.price,
          volume24h: marketData.volume24h,
          marketCap: marketData.marketCap,
          sentiment: 'Bullish', // Mock data
          rsi: 35.7,
          ema: 67000,
          vwap: 67100,
          bollingerBands: { upper: 68000, lower: 66000 },
          sar: 65000,
          adx: 68.2,
          riskLevel,
        };
        const result = await getTradingSignalAction(input);
        setSignal(result);
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: e.message,
        });
      }
    });
  };

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <SymbolSelector selectedSymbol={symbol} onSelectSymbol={setSymbol} />
        <PriceDisplay price={marketData.price} change={marketData.change} />
        
        {signal ? (
          <>
            <StrategyCard strategy={signal} />
            <RiskAnalysisCard
              riskLevel={riskLevel}
              onSetRiskLevel={setRiskLevel}
              riskRating={signal.riskRating}
              gptConfidence={signal.gptConfidenceScore}
            />
          </>
        ) : (
          <>
            <CurrentTrendCard />
            <RiskAnalysisCard
              riskLevel={riskLevel}
              onSetRiskLevel={setRiskLevel}
            />
          </>
        )}

        <MarketDataCard
          volume={marketData.volume24h}
          marketCap={marketData.marketCap}
        />
        <PositionRatioCard
          ratio={marketData.longShortRatio}
          selectedInterval={interval}
          onSelectInterval={setInterval}
        />
        
        <Button
          size="lg"
          className="w-full h-12 text-lg font-bold"
          onClick={handleGetSignal}
          disabled={isPending}
        >
          {isPending ? (
            <Loader className="animate-spin" />
          ) : (
            'Get Signal'
          )}
        </Button>
        <div className="h-24"></div>
      </main>
      <Separator className="bg-border/20" />
      <BottomBar />
    </div>
  );
}
