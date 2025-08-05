'use client';

import { useState, useEffect, useTransition } from 'react';
import { toast } from '@/hooks/use-toast';
import { getTradingSignalAction } from '@/app/actions';

import { AppHeader } from './header';
import { SymbolSelector } from './symbol-selector';
import { PriceDisplay } from './price-display';
import { MomentumCard } from './momentum-card';
import { PositionRatioCard } from './position-ratio-card';
import { BottomBar } from './bottom-bar';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';
import { StrategyCard } from './strategy-card';
import { RiskAnalysisCard } from './risk-analysis-card';
import { MarketDataCard } from './market-data-card';
import type { GenerateTradingSignalOutput } from '@/ai/flows/generate-trading-signal';
import { TechnicalAnalysisCard } from './technical-analysis-card';
import { IndicatorCard } from './indicator-card';

export type Symbol = 'BTC' | 'ETH' | 'XRP' | 'SOL' | 'DOGE';
export type Interval = '5m' | '15m' | '1h' | '4h' | '1d';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface MarketData {
  price: number;
  change: number;
  volume24h: number;
  marketCap: number;
  longShortRatio: number;
  rsi: number;
  ema: number;
  vwap: number;
  bollingerBands: { upper: number; lower: number };
  sar: number;
  adx: number;
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
    rsi: parseFloat((30 + Math.random() * 40).toFixed(2)),
    ema: price * (1 - 0.01 * (Math.random() - 0.5)),
    vwap: price * (1 - 0.01 * (Math.random() - 0.5)),
    bollingerBands: {
      upper: price * 1.05,
      lower: price * 0.95,
    },
    sar: price * (1 - 0.02 * (Math.random() > 0.5 ? 1 : -1)),
    adx: parseFloat((10 + Math.random() * 40).toFixed(2)),
  };
};

export default function TradeVisionPage() {
  const [isPending, startTransition] = useTransition();
  const [symbol, setSymbol] = useState<Symbol>('BTC');
  const [interval, setInterval] = useState<Interval>('1d');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [signal, setSignal] = useState<GenerateTradingSignalOutput | null>(
    null
  );

  useEffect(() => {
    const data = generateMockData(symbol);
    setMarketData(data);
    setSignal(null);
  }, [symbol]);

  useEffect(() => {
    if (interval) {
        const data = generateMockData(symbol);
        setMarketData(data);
        setSignal(null);
    }
  }, [interval, symbol]);

  const handleGetSignal = async () => {
    if (!marketData) return;
    startTransition(async () => {
      try {
        const input = {
          symbol: `${symbol}USDT`,
          interval,
          price: marketData.price,
          volume24h: marketData.volume24h,
          marketCap: marketData.marketCap,
          sentiment: 'Bullish', // Mock data
          rsi: marketData.rsi,
          ema: marketData.ema,
          vwap: marketData.vwap,
          bollingerBands: marketData.bollingerBands,
          sar: marketData.sar,
          adx: marketData.adx,
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

  if (!marketData) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IndicatorCard
                title="RSI"
                value={marketData.rsi.toFixed(2)}
                interpretation={signal.rsiInterpretation}
                gaugeValue={marketData.rsi}
              />
              <IndicatorCard
                title="ADX"
                value={marketData.adx.toFixed(2)}
                interpretation={signal.adxInterpretation}
                gaugeValue={marketData.adx}
              />
              <IndicatorCard
                title="EMA"
                value={marketData.ema.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                interpretation={signal.emaInterpretation}
              />
              <IndicatorCard
                title="VWAP"
                value={marketData.vwap.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                interpretation={signal.vwapInterpretation}
              />
              <IndicatorCard
                title="Parabolic SAR"
                value={marketData.sar.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                interpretation={signal.sarInterpretation}
              />
              <IndicatorCard
                title="Bollinger Bands"
                value={`${marketData.bollingerBands.lower.toLocaleString(undefined, { maximumFractionDigits: 2 })} - ${marketData.bollingerBands.upper.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                interpretation={signal.bollingerBandsInterpretation}
              />
            </div>
          </>
        ) : (
          <>
            <MomentumCard />
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
        {!signal && <TechnicalAnalysisCard
          rsi={marketData.rsi}
          ema={marketData.ema}
          vwap={marketData.vwap}
          bollingerBands={marketData.bollingerBands}
          sar={marketData.sar}
          adx={marketData.adx}
        />}

        <Button
          size="lg"
          className="w-full h-12 text-lg font-bold"
          onClick={handleGetSignal}
          disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin" /> : 'Get Signal'}
        </Button>
        <div className="h-24"></div>
      </main>
      <Separator className="bg-border/20" />
      <BottomBar />
    </div>
  );
}
