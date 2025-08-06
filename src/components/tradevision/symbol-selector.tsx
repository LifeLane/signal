
'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Symbol } from './tradevision-page';

interface SymbolSelectorProps {
  selectedSymbol: Symbol | null;
  onSelectSymbol: (symbol: Symbol) => void;
}

const popularSymbols: Symbol[] = ['BTC', 'ETH', 'SOL', 'XRP'];
const allSymbols: { value: Symbol; label: string }[] = [
    { value: 'BTC', label: 'BTC' },
    { value: 'ETH', label: 'ETH' },
    { value: 'SOL', label: 'SOL' },
    { value: 'XRP', label: 'XRP' },
    { value: 'DOGE', label: 'DOGE' },
];


export function SymbolSelector({ selectedSymbol, onSelectSymbol }: SymbolSelectorProps) {
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<{ value: Symbol; label: string }[]>([]);


  React.useEffect(() => {
    if (search) {
      const results = allSymbols.filter(s => s.label.toLowerCase().includes(search.toLowerCase()));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const handleSelect = (symbol: Symbol) => {
    setSearch('');
    setSearchResults([]);
    onSelectSymbol(symbol);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {popularSymbols.map((symbol) => (
          <Button
            key={symbol}
            variant={selectedSymbol === symbol ? 'default' : 'outline'}
            onClick={() => handleSelect(symbol)}
            className={cn(
                "h-12 text-base transition-all",
                selectedSymbol === symbol && "animate-pulse-glow [--glow-color:theme(colors.primary/0.7)]"
            )}
          >
            {symbol}
          </Button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for other symbols..."
          className="h-12 pl-10 text-base focus-visible:animate-pulse-glow [--glow-color:theme(colors.primary/0.7)]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-md border bg-card text-card-foreground shadow-lg z-10">
                {searchResults.map((symbol) => (
                    <div
                        key={symbol.value}
                        className="p-4 hover:bg-muted cursor-pointer"
                        onClick={() => handleSelect(symbol.value)}
                    >
                        {symbol.label}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
