
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const GECKO_TERMINAL_BASE_URL = 'https://www.geckoterminal.com/solana/pools';

// This map allows us to direct to a specific, known-good pool for popular tokens.
const SYMBOL_TO_POOL_MAP: Record<string, string> = {
    'SHADOW': '3rwADkcUfcGWW2j2u3SXSdhJDRMDzWVVUgycnPSFg97o',
    'SOL': '58oQChx4yWmvKdwLLZzBi4ChoCc2fqbAaGvG6E9cc7Ux', // SOL/USDC
    'BTC': '3H9dxA5N3WNJZg1x9v5n6MM32jGg2gV12s241x3osF12', // WBTC/USDC
    'ETH': '2cZp14Fa55xBS1K36k6W3a2jFp3gH1b2i7jdVfK4S6p1', // WETH/USDC
    'XRP': '67W3nS2T63gce2yM3sV2aa1x2pD6tJAf24f4t8p2g2gA', // WXRP/USDC - Example, may need real pool
};

interface PriceChartProps {
    symbol: string;
}

export function PriceChart({ symbol }: PriceChartProps) {
    // We default to the SHADOW pool if the symbol is not in our map
    const poolId = SYMBOL_TO_POOL_MAP[symbol.toUpperCase()] || SYMBOL_TO_POOL_MAP['SHADOW'];
    
    // Construct the embed URL
    const embedUrl = `${GECKO_TERMINAL_BASE_URL}/${poolId}?embed=1&info=1&swaps=1&grayscale=0&light_chart=0&chart_type=price&resolution=5m`;

    return (
        <Card className="bg-card w-full h-[450px] overflow-hidden">
            <CardContent className="p-0 w-full h-full relative">
                <iframe
                    height="100%"
                    width="100%"
                    id="geckoterminal-embed"
                    title="GeckoTerminal Embed"
                    src={embedUrl}
                    frameBorder="0"
                    allow="clipboard-write"
                    allowFullScreen
                ></iframe>
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
