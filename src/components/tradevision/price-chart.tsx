
'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PriceChartProps {
  symbol: string; // e.g., 'BTC', 'ETH'
}

export function PriceChart({ symbol }: PriceChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!container.current || hasRun.current) {
      return;
    }
    
    // Prevent the script from being added multiple times
    if (document.getElementById('tradingview-widget-script')) {
        // If script exists, just create the widget
        if (window.TradingView) {
             new window.TradingView.widget({
                autosize: true,
                symbol: `BINANCE:${symbol.toUpperCase()}USDT`,
                interval: 'D',
                timezone: 'Etc/UTC',
                theme: 'dark',
                style: '1',
                locale: 'en',
                enable_publishing: false,
                hide_side_toolbar: true,
                allow_symbol_change: false,
                container_id: container.current.id,
            });
            hasRun.current = true;
        }
        return;
    };


    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (container.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol.toUpperCase()}USDT`,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          hide_side_toolbar: true,
          allow_symbol_change: false,
          container_id: container.current.id,
        });
        hasRun.current = true;
      }
    };
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
        const existingScript = document.getElementById('tradingview-widget-script');
        if (existingScript) {
            // It's generally better to leave the script in the DOM if other components might need it,
            // but for this specific single-page app structure, cleanup might be desired on full page change.
            // For now, we will not remove it to prevent re-downloads.
        }
        if (container.current) {
            container.current.innerHTML = '';
        }
        hasRun.current = false;
    };
  }, [symbol]);

  return (
    <Card className="bg-card w-full h-[450px] overflow-hidden">
        <CardContent className="p-0 w-full h-full">
            <div 
                id={`tradingview-widget-container-${symbol}`}
                ref={container} 
                className="tradingview-widget-container h-full w-full"
            />
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
