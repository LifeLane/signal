
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { searchSymbolsAction } from '@/app/actions';
import type { SearchResult } from '@/services/market-data';
import type { Symbol } from './tradevision-page';
import { cn } from '@/lib/utils';

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
            <div key={symbol.id} className="p-0.5 rounded-lg animate-multi-color-glow">
              <Button
                  variant="outline"
                  className="text-lg font-bold h-14 w-full"
                  onClick={() => onSelectSymbol(symbol.id)}
              >
                  {symbol.symbol}
              </Button>
            </div>
        ))}
      </div>

      <div className="p-0.5 rounded-lg animate-multi-color-glow">
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-14 text-lg"
                >
                    <div className='flex items-center gap-2'>
                        <Search className='h-5 w-5' />
                        {selectedSymbol 
                            ? `Selected: ${selectedSymbol.toUpperCase()}`
                            : "Search symbols..."
                        }
                    </div>
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
                                    value={result.id}
                                    onSelect={(currentValue) => {
                                        onSelectSymbol(currentValue);
                                        setOpen(false);
                                        setSearchQuery('');
                                    }}
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
    </div>
  );
}
