
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

interface VolatilityCardProps {
    atr: number;
    vxi: number;
}

export function VolatilityCard({ atr, vxi }: VolatilityCardProps) {
  return (
    <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.indigo.400/0.5)]">
        <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>Volatility Analysis</span>
                <Flame className="text-primary" />
            </CardTitle>
            <CardDescription>Measures of market price fluctuation.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">ATR</p>
                <p className="text-xl font-bold">{atr.toFixed(4)}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Volatility Index</p>
                <p className="text-xl font-bold">{vxi.toFixed(2)}</p>
            </div>
        </CardContent>
    </Card>
  );
}
