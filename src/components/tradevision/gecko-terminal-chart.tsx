
'use client';
import { Card, CardContent } from '@/components/ui/card';

const GECKO_TERMINAL_EMBED_URL = 'https://www.geckoterminal.com/solana/pools/3rwADkcUfcGWW2j2u3SXSdhJDRMDzWVVUgycnPSFg97o?embed=1&info=1&swaps=1&grayscale=0&light_chart=0&chart_type=price&resolution=5m';

export function GeckoTerminalChart() {
    return (
        <Card className="bg-card w-full h-[250px] overflow-hidden">
            <CardContent className="p-0 w-full h-full relative">
                <iframe
                    height="100%"
                    width="100%"
                    id="geckoterminal-embed"
                    title="GeckoTerminal Embed"
                    src={GECKO_TERMINAL_EMBED_URL}
                    frameBorder="0"
                    allow="clipboard-write"
                    allowFullScreen
                ></iframe>
            </CardContent>
        </Card>
    );
}

    

