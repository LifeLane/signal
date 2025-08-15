
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { searchSymbolsAction, getTopCoinsAction } from '@/app/actions';
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
  const [topCoins, setTopCoins] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const popularSymbols: SearchResult[] = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC'},
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH'},
      { id: 'solana', name: 'Solana', symbol: 'SOL'},
      { id: 'ripple', name: 'XRP', symbol: 'XRP'},
  ];

  // Fetch top coins when the popover is opened for the first time
  React.useEffect(() => {
    if (open && topCoins.length === 0 && !searchQuery) {
      setIsLoading(true);
      getTopCoinsAction().then(coins => {
        setTopCoins(coins);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    }
  }, [open, topCoins.length, searchQuery]);
  
  // Handle search results
  React.useEffect(() => {
    if (debouncedSearchQuery.length > 1) {
      setIsLoading(true);
      searchSymbolsAction(debouncedSearchQuery).then((results) => {
        setSearchResults(results);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const displayList = debouncedSearchQuery.length > 1 ? searchResults : topCoins;
  const allKnownCoins = [...popularSymbols, ...topCoins, ...searchResults];
  const selectedCoin = allKnownCoins.find(coin => coin.id === selectedSymbol);

  return (
    <div className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
        {popularSymbols.map((symbol) => (
            <div key={symbol.id} className="p-0.5 rounded-lg animate-multi-color-glow">
              <Button
                  variant="outline"
                  className={cn(
                    "text-lg font-bold h-14 w-full",
                    selectedSymbol === symbol.id && "ring-2 ring-primary border-primary"
                  )}
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
                        {selectedCoin
                            ? `${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()})`
                            : "Search or select a coin..."
                        }
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[100]">
                <Command>
                    <CommandInput 
                        placeholder="Search cryptocurrency..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        {isLoading && (
                            <div className="p-4 flex justify-center items-center">
                                <Loader className="animate-spin"/>
                            </div>
                        )}
                        {!isLoading && displayList.length === 0 && (
                             <CommandEmpty>
                                {searchQuery ? "No results found." : "Loading popular coins..."}
                             </CommandEmpty>
                        )}
                        <CommandGroup heading={debouncedSearchQuery.length > 1 ? "Search Results" : "Top 100 by Market Cap"}>
                            {displayList.map((result) => (
                                <CommandItem
                                    key={result.id}
                                    value={result.id}
                                    onSelect={(currentValue) => {
                                      onSelectSymbol(currentValue);
                                      setOpen(false);
                                      setSearchQuery('');
                                    }}
                                >
                                   <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedSymbol === result.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
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
