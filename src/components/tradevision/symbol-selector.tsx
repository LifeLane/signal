
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { searchSymbolsAction } from '@/app/actions';
import type { SearchResult } from '@/services/market-data';
import type { Symbol } from './tradevision-page';

interface SymbolSelectorProps {
  selectedSymbol: Symbol | null;
  onSelectSymbol: (symbol: Symbol) => void;
}

export function SymbolSelector({ selectedSymbol, onSelectSymbol }: SymbolSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    if (debouncedSearchQuery.length > 1) {
      setIsSearching(true);
      searchSymbolsAction(debouncedSearchQuery).then((results) => {
        setSearchResults(results);
        setIsSearching(false);
      });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const handleSelect = (symbol: SearchResult) => {
    // We use the ID for fetching data as it's more reliable than the symbol/ticker
    onSelectSymbol(symbol.id); 
    setOpen(false);
    setSearchQuery('');
  };
  
  const popularSymbols: SearchResult[] = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC'},
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH'},
      { id: 'solana', name: 'Solana', symbol: 'SOL'},
      { id: 'ripple', name: 'XRP', symbol: 'XRP'},
  ];

  return (
    <div className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
        {popularSymbols.map((symbol) => (
            <Button
                key={symbol.id}
                variant="outline"
                className="text-lg font-bold h-14"
                onClick={() => onSelectSymbol(symbol.id)}
            >
                {symbol.symbol}
            </Button>
        ))}
      </div>

        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-14 text-lg"
                >
                    {selectedSymbol 
                        ? `Selected: ${selectedSymbol.toUpperCase()}`
                        : "Search by name, ticker, or address..."
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput 
                        placeholder="Search for a cryptocurrency..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        {isSearching && (
                            <div className="p-4 flex justify-center items-center">
                                <Loader className="animate-spin"/>
                            </div>
                        )}
                        <CommandEmpty>{!isSearching && "No results found."}</CommandEmpty>
                        <CommandGroup>
                            {searchResults.map((result) => (
                                <CommandItem
                                    key={result.id}
                                    value={`${result.name} ${result.symbol}`} // Use a unique value for filtering
                                    onSelect={() => handleSelect(result)}
                                >
                                    {result.name} ({result.symbol.toUpperCase()})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    </div>
  );
}
