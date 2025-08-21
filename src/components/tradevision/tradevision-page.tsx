
'use client';

import { useState, useTransition, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getTradingSignalAction, getMarketDataAction, type TradingSignalWithTargets } from '@/app/actions';

import { PriceDisplay } from './price-display';
import { PositionRatioCard } from './position-ratio-card';
import { BottomBar, type NavItem } from './bottom-bar';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Bot, Loader } from 'lucide-react';
import { StrategyCard } from './strategy-card';
import { MarketDataCard } from './market-data-card';
import { IndicatorCard } from './indicator-card';
import type { MarketData } from '@/services/market-data';
import { IntroHooks } from './intro-hooks';
import { IntroLogo } from './intro-logo';
import { cn } from '@/lib/utils';
import { TechnicalAnalysisCard } from './technical-analysis-card';
import { SignalsHistoryPage } from './signals-history-page';
import { AiNewsPage } from './ai-news-page';
import { ShadowPage } from './shadow-page';
import { PremiumPage } from './premium-page';
import { SignalLoadingHooks } from './signal-loading-hooks';
import { AnimatedIntroText } from './animated-intro-text';
import { SupportResistanceCard } from './support-resistance-card';
import { CandlestickPatternCard } from './candlestick-pattern-card';
import dynamic from 'next/dynamic';
import { FearAndGreedCard } from './fear-and-greed-card';
import { VolatilityCard } from './volatility-card';
import { VolumeProfileChart } from './volume-profile-chart';
import { StickyRiskSelector } from './sticky-risk-selector';
import { PriceChart } from './price-chart';
import ClientOnly from './client-only';


export type Symbol = string;
export type Interval = '5m' | '15m' | '1h' | '4h' | '1d';
export type RiskLevel = 'Low' | 'Medium' | 'High';

const popularSymbols: { id: string; name: string; symbol: string; }[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC'},
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH'},
    { id: 'solana', name: 'Solana', symbol: 'SOL'},
    { id: 'ripple', name: 'XRP', symbol: 'XRP'},
];

export default function TradeVisionPage() {
  const [isSignalPending, startSignalTransition] = useTransition();
  const [isDataLoading, setDataLoading] = useState(false);
  const [symbol, setSymbol] = useState<Symbol | null>(null);
  const [interval, setInterval] = useState<Interval>('1d');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [marketData, setMarketData] = useState<MarketData | null>(
    null
  );
  const [signal, setSignal] = useState<TradingSignalWithTargets | null>(
    null
  );
  const [signalHistory, setSignalHistory] = useState<TradingSignalWithTargets[]>([]);
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<NavItem>('Dashboard');
  const strategyCardRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const fetchMarketData = useCallback((currentSymbol: Symbol) => {
    setDataLoading(true);
    setMarketData(null); // Clear old data immediately
    setSignal(null); // Clear old signal
    
    if (pageContainerRef.current) {
        pageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

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
        setMarketData(null); // Ensure data is null on error
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [toast]);
  
  const handleSymbolChange = (newSymbol: Symbol | null) => {
    if (newSymbol) {
      setSymbol(newSymbol);
      fetchMarketData(newSymbol);
    } else {
      setSymbol(null);
      setMarketData(null);
      setSignal(null);
    }
  };

  const handleIntervalChange = (newInterval: Interval) => {
    setInterval(newInterval);
  };

  const handleGetSignal = async () => {
    if (!symbol || !marketData) return;
    setSignal(null); // Clear previous signal before fetching new one
    startSignalTransition(async () => {
      try {
        const input = {
          id: Date.now().toString(), // Cache-busting ID
          symbol: marketData.name, // Use the full name for AI context
          riskLevel,
        };
        const result = await getTradingSignalAction(input);
        const newSignal = { ...result, symbol, id: result.id };
        setSignal(newSignal);
        setSignalHistory(prev => [newSignal, ...prev]);
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Signal',
          description: e.message,
        });
      }
    });
  };

  useEffect(() => {
    if (signal && !isSignalPending && strategyCardRef.current) {
        strategyCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }
  }, [signal, isSignalPending]);
  
  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full space-y-6">
        <div className="border border-primary/20 rounded-xl p-4 w-full max-w-sm animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
            <IntroLogo />
        </div>
        
        <p className="text-base md:text-lg font-semibold text-primary whitespace-nowrap">Your Unfair Advantage.</p>
        
        <ClientOnly>
          <div className="w-full max-w-sm p-4 rounded-xl border border-primary/20 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
              <IntroHooks />
          </div>
          
          <div className="w-full whitespace-nowrap">
              <AnimatedIntroText />
          </div>
        </ClientOnly>

        <div className="w-full max-w-sm space-y-4">
             <div className="grid grid-cols-2 gap-4">
              {popularSymbols.map((s) => (
                  <div key={s.id} className="p-0.5 rounded-lg animate-multi-color-glow">
                    <Button
                        variant="outline"
                        className={cn(
                          "text-lg font-bold h-14 w-full",
                          symbol === s.id && "ring-2 ring-primary border-primary"
                        )}
                        onClick={() => handleSymbolChange(s.id)}
                    >
                        {s.symbol}
                    </Button>
                  </div>
              ))}
            </div>
        </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div ref={pageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar transition-all bg-pulse-grid">
          
          {!symbol && !isDataLoading && renderIntro()}
          
          {isDataLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <Loader className="animate-spin h-10 w-10 text-primary" />
              <p className='text-muted-foreground'>Fetching live data for {symbol?.toUpperCase()}...</p>
            </div>
          )}

          {marketData && symbol && !isDataLoading && (
            <>
              <PriceDisplay symbol={marketData.name} price={marketData.price} change={marketData.change} onChangeSymbol={() => handleSymbolChange(null)} />
              <Separator />
              <PriceChart symbol={marketData.symbol} />

              {/* Pre-signal general analysis */}
              {!signal && !isSignalPending && (
                  <>
                      <SupportResistanceCard support={marketData.support} resistance={marketData.resistance} />
                      <MarketDataCard
                        volume={marketData.volume24h}
                        marketCap={marketData.marketCap}
                      />
                      <PositionRatioCard
                        ratio={marketData.longShortRatio}
                        selectedInterval={interval}
                        onSelectInterval={handleIntervalChange}
                      />
                      <TechnicalAnalysisCard {...marketData} />
                      {marketData.fearAndGreed && <FearAndGreedCard index={marketData.fearAndGreed.value} classification={marketData.fearAndGreed.classification} />}
                      {marketData.volumeProfile && <VolumeProfileChart data={marketData.volumeProfile} />}
                      {marketData.volatility && <VolatilityCard atr={marketData.volatility.atr} vxi={marketData.volatility.vxi} />}
                  </>
              )}

              <div ref={strategyCardRef} className="scroll-mt-4 space-y-4">
                {/* Show loading state or final strategy card */}
                {isSignalPending || signal ? (
                  <StrategyCard strategy={signal} isPending={isSignalPending} />
                ) : null}
                
                {/* Show detailed breakdown only AFTER signal is generated */}
                {signal && !isSignalPending && (
                  <>
                  <CandlestickPatternCard patterns={marketData.patterns} />
                  <div className="grid grid-cols-1 gap-4">
                      <IndicatorCard
                        title="RSI (Relative Strength Index)"
                        value={marketData.rsi.toFixed(2)}
                        interpretation={signal.rsiInterpretation}
                        gaugeValue={marketData.rsi}
                      />
                      <IndicatorCard
                        title="ADX (Average Directional Index)"
                        value={marketData.adx.toFixed(2)}
                        interpretation={signal.adxInterpretation}
                        gaugeValue={marketData.adx}
                      />
                      <IndicatorCard
                        title="EMA (Exponential Moving Average)"
                        value={marketData.ema.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        interpretation={signal.emaInterpretation}
                      />
                      <IndicatorCard
                        title="VWAP (Volume-Weighted Average Price)"
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
                )}
              </div>
            </>
          )}

          {!isDataLoading && symbol && !marketData && (
              <div className="h-full flex flex-col justify-center items-center text-center">
                  <p className='text-destructive'>Could not load data for {symbol.toUpperCase()}.</p>
                  <p className='text-muted-foreground text-sm'>Please check the symbol or try another.</p>
                  <Button variant="outline" size="sm" onClick={() => handleSymbolChange(null)} className="mt-4">
                      Change Symbol
                  </Button>
              </div>
          )}

          <div className="h-24"></div>
        </div>

        {symbol && marketData && (
            <div className="sticky bottom-[73px] p-4 bg-background/80 backdrop-blur-sm space-y-2">
                <StickyRiskSelector riskLevel={riskLevel} onSetRiskLevel={setRiskLevel}/>
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-bold"
                  onClick={handleGetSignal}
                  disabled={isSignalPending || isDataLoading || !marketData}
                >
                  {isSignalPending ? 
                    <SignalLoadingHooks /> : 
                    <span>
                      {`ANALYZE ${marketData.name.toUpperCase()} NOW`}
                    </span>
                  }
                </Button>
            </div>
          )}
    </>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'SHADOW':
        return <ShadowPage />;
      case 'Dashboard':
        return renderDashboard();
      case 'Signals':
        return <SignalsHistoryPage signals={signalHistory} />;
      case 'AI News':
        return <AiNewsPage />;
      case 'Premium':
        return <PremiumPage />;
      default:
        return renderDashboard();
    }
  }

  return (
    <div className={"bg-background text-foreground h-full flex flex-col"}>
      {renderContent()}
      <Separator className="bg-border/20" />
      <BottomBar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}
