'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
}

function TradingViewWidget({ symbol, interval }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const isScriptAppended = useRef(false);

  useEffect(() => {
    const createWidget = () => {
      if (container.current && 'TradingView' in window) {
        container.current.innerHTML = '';
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: false,
          studies: ['RSI@tv-basicstudies', 'EMA@tv-basicstudies'],
          container_id: container.current.id,
        });
      }
    };

    if (!isScriptAppended.current) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);
      isScriptAppended.current = true;
    } else {
      createWidget();
    }
  }, [symbol, interval]);

  return (
    <div className="tradingview-widget-container h-[500px] lg:h-[600px] rounded-lg shadow-lg overflow-hidden border border-border">
      <div ref={container} id="tradingview_widget" className='h-full w-full' />
    </div>
  );
}

export default memo(TradingViewWidget);
