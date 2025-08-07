
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CandlestickPattern } from '@/services/market-data';

interface CandlestickPatternCardProps {
  patterns: CandlestickPattern[];
}

export function CandlestickPatternCard({ patterns }: CandlestickPatternCardProps) {
  if (!patterns || patterns.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.amber.400/0.5)]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Candlestick Patterns</CardTitle>
          <Badge variant="secondary">1d</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {patterns.map((pattern, index) => (
          <div key={index} className={index > 0 ? "border-t border-border/50 pt-4" : ""}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-primary">{pattern.name}</p>
                <p className="text-sm font-bold text-green-400">
                  Confidence {pattern.confidence.toFixed(2)}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{pattern.timestamp}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {pattern.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
