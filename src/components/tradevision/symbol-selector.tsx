'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Symbol } from './tradevision-page';

const symbols: { value: Symbol; label: string }[] = [
  { value: 'BTC', label: 'BTC' },
  { value: 'ETH', label: 'ETH' },
  { value: 'XRP', label: 'XRP' },
  { value: 'SOL', label: 'SOL' },
  { value: 'DOGE', label: 'DOGE' },
];

interface SymbolSelectorProps {
  selectedSymbol: Symbol;
  onSelectSymbol: (symbol: Symbol) => void;
}

export function SymbolSelector({
  selectedSymbol,
  onSelectSymbol,
}: SymbolSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
       <label className="text-sm font-medium text-muted-foreground">Select Asset</label>
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 text-lg"
            >
            {selectedSymbol
                ? symbols.find((symbol) => symbol.value === selectedSymbol)?.label
                : 'Select symbol...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
            <CommandInput placeholder="Search symbol..." />
            <CommandEmpty>No symbol found.</CommandEmpty>
            <CommandList>
                <CommandGroup>
                {symbols.map((symbol) => (
                    <CommandItem
                    key={symbol.value}
                    value={symbol.value}
                    onSelect={(currentValue) => {
                        onSelectSymbol(currentValue.toUpperCase() as Symbol);
                        setOpen(false);
                    }}
                    >
                    <Check
                        className={cn(
                        'mr-2 h-4 w-4',
                        selectedSymbol === symbol.value ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                    {symbol.label}
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