'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { getTradingSignalAction, getMarketDataAction } from '@/app/actions';

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
import { IndicatorCard } from './indicator-card';
import type { MarketData } from '@/services/market-data';

export type Symbol = 'BTC' | 'ETH' | 'XRP' | 'SOL' | 'DOGE';
export type Interval = '5m' | '15m' | '1h' | '4h' | '1d';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export default function TradeVisionPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSignalPending, startSignalTransition] = useTransition();
  const [isDataLoading, setDataLoading] = useState(true);
  const [symbol, setSymbol] = useState<Symbol>('BTC');
  const [interval, setInterval] = useState<Interval>('1d');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [signal, setSignal] = useState<GenerateTradingSignalOutput | null>(
    null
  );

  const fetchMarketData = useCallback((currentSymbol: Symbol) => {
    setDataLoading(true);
    setSignal(null);
    getMarketDataAction(currentSymbol)
      .then((data) => {
        setMarketData(data);
      })
      .catch((e) => {
        toast({
          variant: 'destructive',
          title: 'Error fetching market data',
          description: e.message,
        });
        setMarketData(null);
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, []);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsMounted(true);
    fetchMarketData(symbol);
  }, [symbol, fetchMarketData]);


  const handleSymbolChange = (newSymbol: Symbol) => {
    setSymbol(newSymbol);
    // Data will be refetched by the useEffect hook
  };

  const handleIntervalChange = (newInterval: Interval) => {
    setInterval(newInterval);
    // Refetch or update data based on interval if necessary
  };

  const handleGetSignal = async () => {
    if (!marketData) return;
    startSignalTransition(async () => {
      try {
        const input = {
          symbol: symbol,
          riskLevel,
        };
        const result = await getTradingSignalAction(input);
        setSignal(result);
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Signal',
          description: e.message,
        });
      }
    });
  };
  
  if (!isMounted) {
    return (
      <div className="bg-background text-foreground h-full flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
        <Separator className="bg-border/20" />
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <SymbolSelector selectedSymbol={symbol} onSelectSymbol={handleSymbolChange} />
        
        {isDataLoading && !marketData ? (
           <div className="h-48 flex items-center justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : !marketData ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-4">
            <p className="text-destructive mb-4">Failed to load market data.</p>
            <Button onClick={() => fetchMarketData(symbol)}>Retry</Button>
          </div>
        ) : (
          <>
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
              onSelectInterval={handleIntervalChange}
            />
          </>
        )}

        <Button
          size="lg"
          className="w-full h-12 text-lg font-bold"
          onClick={handleGetSignal}
          disabled={isSignalPending || isDataLoading}
        >
          {isSignalPending || isDataLoading ? <Loader className="animate-spin" /> : 'Get Signal'}
        </Button>
        <div className="h-24"></div>
      </main>
      <Separator className="bg-border/20" />
      <BottomBar />
    </div>
  );
}
