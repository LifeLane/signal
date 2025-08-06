
'use client';

import { useState, useTransition, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getTradingSignalAction, getMarketDataAction, type TradingSignalWithTargets } from '@/app/actions';

import { AppHeader } from './header';
import { SymbolSelector } from './symbol-selector';
import { PriceDisplay } from './price-display';
import { MomentumCard } from './momentum-card';
import { PositionRatioCard } from './position-ratio-card';
import { BottomBar, type NavItem } from './bottom-bar';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Bot, Loader } from 'lucide-react';
import { StrategyCard } from './strategy-card';
import { RiskAnalysisCard } from './risk-analysis-card';
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
import type { Theme } from '@/app/theme-provider';

export type Symbol = 'BTC' | 'ETH' | 'XRP' | 'SOL' | 'DOGE';
export type Interval = '5m' | '15m' | '1h' | '4h' | '1d';
export type RiskLevel = 'Low' | 'Medium' | 'High';

interface TradeVisionPageProps {
  theme: Theme | 'neural-pulse';
  handleThemeToggle: () => void;
}


export default function TradeVisionPage({ theme, handleThemeToggle }: TradeVisionPageProps) {
  const [isSignalPending, startSignalTransition] = useTransition();
  const [isDataLoading, setDataLoading] = useState(false);
  const [symbol, setSymbol] = useState<Symbol | null>(null);
  const [interval, setInterval] = useState<Interval>('1d');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [signal, setSignal] = useState<TradingSignalWithTargets | null>(
    null
  );
  const [signalHistory, setSignalHistory] = useState<TradingSignalWithTargets[]>([]);
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<NavItem>('Dashboard');
  const strategyCardRef = useRef<HTMLDivElement>(null);


  const fetchMarketData = useCallback((currentSymbol: Symbol) => {
    setDataLoading(true);
    setSignal(null); // Reset signal when symbol changes
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


  const handleSymbolChange = (newSymbol: Symbol) => {
    setSymbol(newSymbol);
    fetchMarketData(newSymbol);
  };

  const handleIntervalChange = (newInterval: Interval) => {
    setInterval(newInterval);
  };

  const handleGetSignal = async () => {
    if (!symbol || !marketData) return;
    startSignalTransition(async () => {
      try {
        const input = {
          id: Date.now().toString(), // Cache-busting ID
          symbol: symbol,
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
        
        <div className="w-full max-w-sm p-4 rounded-xl border border-primary/20 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
             <IntroHooks />
        </div>
        
        <p className="text-muted-foreground text-lg">Select a symbol to begin analysis.</p>

        <div className="w-full max-w-sm">
            <SymbolSelector selectedSymbol={symbol} onSelectSymbol={handleSymbolChange} />
        </div>
    </div>
  );

  const renderDashboard = () => (
    <main className={cn(
        "flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar transition-all",
        (theme === 'neural-pulse' || theme === 'neon-future') && 'bg-pulse-grid'
      )}>
        
        {!symbol && !isDataLoading && renderIntro()}
        
        {isDataLoading && (
          <div className="h-full flex items-center justify-center">
            <Loader className="animate-spin h-10 w-10 text-primary" />
          </div>
        )}

        {marketData && symbol && !isDataLoading && (
          <>
            <SymbolSelector selectedSymbol={symbol} onSelectSymbol={handleSymbolChange} />
            <PriceDisplay symbol={symbol} price={marketData.price} change={marketData.change} />
            <Separator />

            {/* Pre-signal general analysis */}
            {!signal && !isSignalPending && (
                <>
                    <MomentumCard theme={theme} />
                    <TechnicalAnalysisCard {...marketData} theme={theme} />
                </>
            )}

            <div ref={strategyCardRef} className="scroll-mt-4 space-y-4">
              {/* Show loading state or final strategy card */}
              {isSignalPending || signal ? (
                <StrategyCard strategy={signal} isPending={isSignalPending} theme={theme} />
              ) : null}
              
              {/* Show detailed breakdown only AFTER signal is generated */}
              {signal && !isSignalPending && (
                <div className="grid grid-cols-1 gap-4">
                    <IndicatorCard
                      title="RSI (Relative Strength Index)"
                      value={marketData.rsi.toFixed(2)}
                      interpretation={signal.rsiInterpretation}
                      gaugeValue={marketData.rsi}
                      theme={theme}
                    />
                    <IndicatorCard
                      title="ADX (Average Directional Index)"
                      value={marketData.adx.toFixed(2)}
                      interpretation={signal.adxInterpretation}
                      gaugeValue={marketData.adx}
                      theme={theme}
                    />
                    <IndicatorCard
                      title="EMA (Exponential Moving Average)"
                      value={marketData.ema.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      interpretation={signal.emaInterpretation}
                      theme={theme}
                    />
                    <IndicatorCard
                      title="VWAP (Volume-Weighted Average Price)"
                      value={marketData.vwap.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      interpretation={signal.vwapInterpretation}
                      theme={theme}
                    />
                    <IndicatorCard
                      title="Parabolic SAR"
                      value={marketData.sar.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      interpretation={signal.sarInterpretation}
                      theme={theme}
                    />
                    <IndicatorCard
                      title="Bollinger Bands"
                      value={`${marketData.bollingerBands.lower.toLocaleString(undefined, { maximumFractionDigits: 2 })} - ${marketData.bollingerBands.upper.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                      interpretation={signal.bollingerBandsInterpretation}
                      theme={theme}
                    />
                </div>
              )}
            </div>
            
            <MarketDataCard
              volume={marketData.volume24h}
              marketCap={marketData.marketCap}
              theme={theme}
            />
            <PositionRatioCard
              ratio={marketData.longShortRatio}
              selectedInterval={interval}
              onSelectInterval={handleIntervalChange}
              theme={theme}
            />
            <RiskAnalysisCard
              riskLevel={riskLevel}
              onSetRiskLevel={setRiskLevel}
              riskRating={signal?.riskRating}
              gptConfidence={signal?.gptConfidenceScore}
              theme={theme}
            />
             <Button
                size="lg"
                className="w-full h-12 text-lg font-bold relative group"
                onClick={handleGetSignal}
                disabled={isSignalPending || isDataLoading}
              >
                {isSignalPending ? <SignalLoadingHooks /> : 
                <span className="flex items-center gap-2">
                    <Bot /> Get {symbol ? `${symbol} Signal` : 'SHADOW Signal'}
                </span>
                }
              </Button>
          </>
        )}

        {!isDataLoading && symbol && !marketData && (
             <div className="h-full flex flex-col justify-center items-center text-center">
                <p className='text-destructive'>Could not load data for {symbol}.</p>
                <p className='text-muted-foreground text-sm'>Please check your network or try a different symbol.</p>
            </div>
        )}

        <div className="h-24"></div>
      </main>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'SHADOW':
        return <ShadowPage theme={theme} />;
      case 'Dashboard':
        return renderDashboard();
      case 'Signals':
        return <SignalsHistoryPage signals={signalHistory} theme={theme} />;
      case 'AI News':
        return <AiNewsPage theme={theme} />;
      case 'Premium':
        return <PremiumPage theme={theme} />;
      default:
        return renderDashboard();
    }
  }

  return (
    <div className={"bg-background text-foreground h-full flex flex-col"}>
      <AppHeader onThemeToggle={handleThemeToggle} />
      {renderContent()}
      <Separator className="bg-border/20" />
      <BottomBar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}
