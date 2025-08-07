
'use client';
import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TradingViewWidgetProps {
    symbol: string;
}

const TV_SCRIPT_ID = 'tradingview-widget-script';
const TV_CONTAINER_ID = 'tradingview-widget-container';

export function PriceChart({ symbol }: TradingViewWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptAddedRef = useRef(false);
    
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
            scriptAddedRef.current = true;
        } else {
            // If script is already there, just create the widget
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
            <CardContent className="p-0 w-full h-full">
                <div id={TV_CONTAINER_ID} ref={containerRef} className="w-full h-full" />
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
