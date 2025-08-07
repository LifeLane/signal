
'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { RiskLevel } from './tradevision-page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shield, Zap, TrendingUp } from 'lucide-react';

interface StickyRiskSelectorProps {
  riskLevel: RiskLevel;
  onSetRiskLevel: Dispatch<SetStateAction<RiskLevel>>;
}

const riskLevels: RiskLevel[] = ['Low', 'Medium', 'High'];

export function StickyRiskSelector({
  riskLevel,
  onSetRiskLevel,
}: StickyRiskSelectorProps) {
  return (
    <Card className="bg-card/80 animate-pulse-glow [--glow-color:theme(colors.purple.400/0.5)] border-primary/20">
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
            <p className='text-sm font-semibold text-muted-foreground'>Risk:</p>
            {riskLevels.map((level) => (
                <Button
                key={level}
                variant="secondary"
                size="sm"
                onClick={() => onSetRiskLevel(level)}
                className={cn(
                    'rounded-lg text-xs font-medium flex-1 h-8',
                    'bg-muted hover:bg-primary/20 text-muted-foreground',
                    riskLevel === level &&
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                >
                {level}
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
