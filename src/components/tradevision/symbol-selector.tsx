
'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Symbol } from './tradevision-page';
import { Card, CardContent } from '../ui/card';

interface SymbolSelectorProps {
  selectedSymbol: Symbol | null;
  onSelectSymbol: (symbol: Symbol) => void;
}

const popularSymbols: Symbol[] = ['BTC', 'ETH', 'SOL', 'XRP'];

export function SymbolSelector({ selectedSymbol, onSelectSymbol }: SymbolSelectorProps) {
  const [search, setSearch] = React.useState('');

  const handleSelect = (symbol: Symbol) => {
    setSearch('');
    onSelectSymbol(symbol);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onSelectSymbol(search.trim().toUpperCase());
      setSearch('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {popularSymbols.map((symbol) => (
            <Card 
                key={symbol}
                onClick={() => handleSelect(symbol)}
                className={cn(
                    "cursor-pointer transition-all bg-card/50 animate-multi-color-glow",
                    "hover:bg-primary/20",
                    selectedSymbol === symbol && "ring-2 ring-primary"
                )}
            >
                <CardContent className="p-4 flex items-center justify-center">
                    <span className="text-xl font-bold">{symbol}</span>
                </CardContent>
            </Card>
        ))}
      </div>
      <form onSubmit={handleSearch} className="relative flex justify-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, ticker, or address..."
            className="h-12 pl-10 text-base text-center animate-multi-color-glow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
