
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MomentumCardProps {
    trend: string;
    analysis: string;
}

export function MomentumCard({trend, analysis}: MomentumCardProps) {
  return (
    <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.teal-400/0.5)]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Momentum</CardTitle>
          <Badge variant="secondary">1d</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Trend</p>
          <p className="text-lg font-bold text-primary">{trend}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Analysis</p>
          <p className="text-sm text-foreground">{analysis}</p>
        </div>
      </CardContent>
    </Card>
  );
}
