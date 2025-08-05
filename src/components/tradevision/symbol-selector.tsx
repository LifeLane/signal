'use client';

import type { Symbol } from './tradevision-page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SymbolSelectorProps {
  selectedSymbol: Symbol;
  onSelectSymbol: (symbol: Symbol) => void;
}

const symbols: Symbol[] = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE'];

export function SymbolSelector({ selectedSymbol, onSelectSymbol }: SymbolSelectorProps) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            variant="secondary"
            size="sm"
            onClick={() => onSelectSymbol(symbol)}
            className={cn(
              "rounded-full px-4 py-1 h-auto text-base font-medium whitespace-nowrap",
              "bg-muted text-muted-foreground hover:bg-primary/20",
              selectedSymbol === symbol && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {symbol}
          </Button>
        ))}
      </div>
       <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none bg-gradient-to-l from-background to-transparent pl-8">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mx-1"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mx-1"></span>
        </div>
    </div>
  );
}
