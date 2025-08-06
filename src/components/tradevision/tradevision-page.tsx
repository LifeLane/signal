
'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getTradingSignalAction, getMarketDataAction } from '@/app/actions';

import { AppHeader } from './header';
import { SymbolSelector } from './symbol-selector';
import { PriceDisplay } from './price-display';
import { MomentumCard } from './momentum-card';
import { PositionRatioCard } from './position-ratio-card';
import { BottomBar } from './bottom-bar';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Bot, Loader } from 'lucide-react';
import { StrategyCard } from './strategy-card';
import { RiskAnalysisCard } from './risk-analysis-card';
import { MarketDataCard } from './market-data-card';
import type { GenerateTradingSignalOutput } from '@/ai/flows/generate-trading-signal';
import { IndicatorCard } from './indicator-card';
import type { MarketData } from '@/services/market-data';
import { IntroAnimation } from './intro-animation';

export type Symbol = 'BTC' | 'ETH' | 'XRP' | 'SOL' | 'DOGE';
export type Interval = '5m' | '15m' | '1h' | '4h' | '1d';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export default function TradeVisionPage() {
  const [isSignalPending, startSignalTransition] = useTransition();
  const [isDataLoading, setDataLoading] = useState(true);
  const [symbol, setSymbol] = useState<Symbol | null>('BTC');
  const [interval, setInterval] = useState<Interval>('1d');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [signal, setSignal] = useState<GenerateTradingSignalOutput | null>(
    null
  );
  const { toast } = useToast();

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
  }, [toast]);

  useEffect(() => {
    if (symbol) {
        fetchMarketData(symbol)
    }
  }, []);

  const handleSymbolChange = (newSymbol: Symbol) => {
    setSymbol(newSymbol);
    fetchMarketData(newSymbol);
  };

  const handleIntervalChange = (newInterval: Interval) => {
    setInterval(newInterval);
  };

  const handleGetSignal = async () => {
    if (!symbol) return;
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

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        
        {isDataLoading && !marketData ? (
          <div className="h-full flex items-center justify-center">
            <Loader className="animate-spin h-10 w-10 text-primary" />
          </div>
        ) : !symbol ? (
          <div className="h-full flex flex-col justify-center">
            <IntroAnimation />
            <SymbolSelector selectedSymbol={symbol} onSelectSymbol={handleSymbolChange} />
          </div>
        ) : marketData ? (
          <>
            <SymbolSelector selectedSymbol={symbol} onSelectSymbol={handleSymbolChange} />
            <PriceDisplay price={marketData.price} change={marketData.change} />
            {signal ? (
              <>
                <StrategyCard strategy={signal} isPending={isSignalPending}/>
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
             <Button
                size="lg"
                className="w-full h-12 text-lg font-bold relative group transition-transform duration-200 hover:-translate-y-1"
                onClick={handleGetSignal}
                disabled={isSignalPending || isDataLoading || !marketData}
              >
                {isSignalPending ? <Loader className="animate-spin" /> : 
                <span>
                    Get AI Signal
                </span>
                }
              </Button>
          </>
        ) : (
             <div className="h-full flex flex-col justify-center items-center text-center">
                <p className='text-destructive'>Could not load data for {symbol}.</p>
                <p className='text-muted-foreground text-sm'>Please check your network or try a different symbol.</p>
                <SymbolSelector selectedSymbol={symbol} onSelectSymbol={handleSymbolChange} />
            </div>
        )}

        <div className="h-24"></div>
      </main>
      <Separator className="bg-border/20" />
      <BottomBar />
    </div>
  );
}
