
'use client';

import { Card, CardContent } from '@/components/ui/card';

interface SupportResistanceCardProps {
  support: number;
  resistance: number;
}

export function SupportResistanceCard({ support, resistance }: SupportResistanceCardProps) {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-0 flex justify-center gap-4">
        <div className="bg-green-500/20 text-green-400 text-sm font-semibold px-4 py-2 rounded-lg">
          Support Line {support.toFixed(2)}
        </div>
        <div className="bg-red-500/20 text-red-400 text-sm font-semibold px-4 py-2 rounded-lg">
          Resistance Line {resistance.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
}
