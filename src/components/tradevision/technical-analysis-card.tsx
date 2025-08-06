
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, MoveDown, MoveUp, Waves, Gauge, Rss } from 'lucide-react';
import type { Theme } from '@/app/theme-provider';
import { cn } from '@/lib/utils';

interface IndicatorProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}

const Indicator = ({ icon: Icon, label, value, color }: IndicatorProps) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <span className={`font-semibold ${color}`}>{value}</span>
  </div>
);

interface TechnicalAnalysisCardProps {
    rsi: number;
    ema: number;
    vwap: number;
    bollingerBands: { upper: number; lower: number; };
    sar: number;
    adx: number;
    theme: Theme | 'neural-pulse';
}

export function TechnicalAnalysisCard({ rsi, ema, vwap, bollingerBands, sar, adx, theme }: TechnicalAnalysisCardProps) {
  return (
    <Card className={cn(
      'bg-card',
      theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.cyan.400/0.5)]'
    )}>
      <CardHeader>
        <CardTitle>Technical Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Indicator icon={Gauge} label="RSI" value={rsi.toFixed(2)} color={rsi > 70 ? "text-red-400" : rsi < 30 ? "text-green-400" : ""} />
        <Indicator icon={TrendingUp} label="EMA" value={ema.toLocaleString()} />
        <Indicator icon={Waves} label="VWAP" value={vwap.toLocaleString()} />
        <Indicator icon={MoveUp} label="Bollinger Upper" value={bollingerBands.upper.toLocaleString()} />
        <Indicator icon={MoveDown} label="Bollinger Lower" value={bollingerBands.lower.toLocaleString()} />
        <Indicator icon={Rss} label="Parabolic SAR" value={sar.toLocaleString()} />
        <Indicator icon={TrendingUp} label="ADX" value={adx.toFixed(2)} color={adx > 25 ? "text-green-400" : ""} />
      </CardContent>
    </Card>
  );
}
