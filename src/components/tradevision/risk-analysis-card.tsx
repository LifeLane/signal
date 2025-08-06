
'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { RiskLevel, Theme } from './tradevision-page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shield, Zap, TrendingUp } from 'lucide-react';

interface RiskAnalysisCardProps {
  riskLevel: RiskLevel;
  onSetRiskLevel: Dispatch<SetStateAction<RiskLevel>>;
  riskRating?: 'Low' | 'Medium' | 'High';
  gptConfidence?: string;
  theme: Theme;
}

const riskLevels: RiskLevel[] = ['Low', 'Medium', 'High'];

export function RiskAnalysisCard({
  riskLevel,
  onSetRiskLevel,
  riskRating,
  gptConfidence,
  theme,
}: RiskAnalysisCardProps) {
  return (
    <Card className={cn(
      'bg-card',
      theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.purple.400/0.5)]'
    )}>
      <CardHeader>
        <CardTitle>Risk Analysis</CardTitle>
        <CardDescription>Select your risk appetite.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
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
                  'bg-primary text-primary-foreground'
              )}
            >
              {level}
            </Button>
          ))}
        </div>
        {riskRating && gptConfidence && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Shield className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">AI Risk Rating</p>
                <p className="font-semibold">{riskRating}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
                <p className="font-semibold">{gptConfidence}%</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
