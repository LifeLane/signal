'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { RiskLevel } from './tradevision-page';
import { Flame, HeartPulse, Shield } from 'lucide-react';

interface ControlsPanelProps {
  riskLevel: RiskLevel;
  setRiskLevel: Dispatch<SetStateAction<RiskLevel>>;
}

export function ControlsPanel({ riskLevel, setRiskLevel }: ControlsPanelProps) {
  const indicators = ['RSI', 'EMA', 'VWAP', 'Bollinger Bands', 'SAR', 'ADX'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="risk">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="risk">Risk Level</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
          </TabsList>
          <TabsContent value="risk" className="pt-4">
            <RadioGroup value={riskLevel} onValueChange={(value: RiskLevel) => setRiskLevel(value)} className="space-y-3">
              <Label className="flex items-center justify-between rounded-md border p-3 has-[input:checked]:border-primary">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="font-semibold">Low</span>
                </div>
                <RadioGroupItem value="Low" id="risk-low" />
              </Label>
              <Label className="flex items-center justify-between rounded-md border p-3 has-[input:checked]:border-primary">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">Medium</span>
                </div>
                <RadioGroupItem value="Medium" id="risk-medium" />
              </Label>
              <Label className="flex items-center justify-between rounded-md border p-3 has-[input:checked]:border-primary">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-400" />
                  <span className="font-semibold">High</span>
                </div>
                <RadioGroupItem value="High" id="risk-high" />
              </Label>
            </RadioGroup>
          </TabsContent>
          <TabsContent value="indicators" className="pt-4">
            <div className="space-y-3">
              {indicators.map((indicator) => (
                <div className="flex items-center space-x-2" key={indicator}>
                  <Checkbox id={indicator} defaultChecked={['RSI', 'EMA'].includes(indicator)} />
                  <Label htmlFor={indicator} className="text-sm font-medium leading-none">
                    {indicator}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
