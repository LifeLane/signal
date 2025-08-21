
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTopCoinsAction, searchSymbolsAction, type SearchResult } from '@/app/actions';
import { useDebounce } from '@/hooks/use-debounce';

interface SymbolSelectorProps {
  selectedSymbol: string | null;
  onSelectSymbol: (symbol: string | null) => void;
}

export function SymbolSelector({ selectedSymbol, onSelectSymbol }: SymbolSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [topCoins, setTopCoins] = React.useState<SearchResult[]>([]);
  const [isLoadingTopCoins, setIsLoadingTopCoins] = React.useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    async function fetchTopCoins() {
      setIsLoadingTopCoins(true);
      const coins = await getTopCoinsAction();
      setTopCoins(coins);
      setIsLoadingTopCoins(false);
    }
    fetchTopCoins();
  }, []);

  React.useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true);
      searchSymbolsAction(debouncedSearchQuery).then((results) => {
        setSearchResults(results);
        setIsSearching(false);
      });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const handleSelect = (coinName: string) => {
    onSelectSymbol(coinName);
    setOpen(false);
  };
  
  const currentCoin = topCoins.find(coin => coin.name === selectedSymbol);
  const displayLabel = currentCoin ? `${currentCoin.name} (${currentCoin.symbol})` : "Select a symbol...";
  const coinList = searchQuery ? searchResults : topCoins;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 text-base"
        >
          {selectedSymbol ? displayLabel : 'Select symbol...'}
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
            {(isSearching || isLoadingTopCoins) && (
              <div className='p-4 flex justify-center items-center'>
                  <Loader className='animate-spin' />
              </div>
            )}
            
            {!isSearching && coinList.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
            )}

            {!isSearching && coinList.length > 0 && (
              <CommandGroup>
                {coinList.map((coin) => (
                  <CommandItem
                    key={coin.id}
                    value={coin.name}
                    onSelect={(currentValue) => {
                      handleSelect(currentValue);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedSymbol === coin.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {coin.name} ({coin.symbol})
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
