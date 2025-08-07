
'use client';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, MousePointerClick } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradingViewWidgetProps {
    symbol: string;
}

const TV_SCRIPT_ID = 'tradingview-widget-script';
const TV_CONTAINER_ID = 'tradingview-widget-container';

export function PriceChart({ symbol }: TradingViewWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInteractionEnabled, setIsInteractionEnabled] = useState(false);
    
    useEffect(() => {
        const createWidget = () => {
            if (window.TradingView && containerRef.current && containerRef.current.id === TV_CONTAINER_ID) {
                 new window.TradingView.widget({
                    autosize: true,
                    symbol: `COINBASE:${symbol}USD`,
                    interval: 'D',
                    timezone: 'Etc/UTC',
                    theme: 'dark',
                    style: '1',
                    locale: 'en',
                    enable_publishing: false,
                    hide_side_toolbar: true,
                    allow_symbol_change: false,
                    container_id: TV_CONTAINER_ID,
                    // Disable scrolling when the chart is focused.
                    // This is handled by our overlay now.
                });
            }
        };

        const onScriptLoad = () => {
             if(containerRef.current) {
                containerRef.current.innerHTML = '';
             }
            createWidget();
        }

        if (!document.getElementById(TV_SCRIPT_ID)) {
            const script = document.createElement('script');
            script.id = TV_SCRIPT_ID;
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = onScriptLoad;
            document.body.appendChild(script);
        } else {
             if(containerRef.current) {
                containerRef.current.innerHTML = '';
             }
            createWidget();
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        }

    }, [symbol]);

    return (
        <Card className="bg-card w-full h-[400px]">
            <CardContent className="p-0 w-full h-full relative">
                <div 
                    id={TV_CONTAINER_ID} 
                    ref={containerRef} 
                    className={cn(
                        "w-full h-full",
                        !isInteractionEnabled && 'pointer-events-none'
                    )}
                />
                {!isInteractionEnabled && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                        <MousePointerClick className='text-primary w-10 h-10' />
                        <h3 className="text-lg font-semibold">Interaction Locked</h3>
                        <p className='text-sm text-muted-foreground'>Click the button below to interact with the chart.</p>
                        <Button onClick={() => setIsInteractionEnabled(true)}>
                            <Unlock className="mr-2" />
                            Enable Chart Interaction
                        </Button>
                    </div>
                )}
                {isInteractionEnabled && (
                     <Button 
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 z-10 bg-red-600/80 hover:bg-red-600"
                        onClick={() => setIsInteractionEnabled(false)}
                     >
                        <Lock className="mr-2" />
                        Lock Scrolling
                     </Button>
                )}
            </CardContent>
        </Card>
    );
}

// Extend the global Window interface for the TradingView widget
declare global {
  interface Window {
    TradingView?: any;
  }
}
