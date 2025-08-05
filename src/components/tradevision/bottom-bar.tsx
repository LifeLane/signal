'use client';
import { LayoutGrid, Star, BarChart, Newspaper, Gem } from 'lucide-react';
import { Button } from '../ui/button';

export function BottomBar() {
  const navItems = [
    { icon: LayoutGrid, label: 'Prime' },
    { icon: Star, label: 'Favorites' },
    { icon: BarChart, label: 'Dashboard' },
    { icon: Newspaper, label: 'AI News' },
    { icon: Gem, label: 'Premium' },
  ];

  return (
    <footer className="p-2 bg-background border-t border-border/20">
      <div className="flex items-center justify-around">
        {navItems.map(({ icon: Icon, label }, index) => (
            <Button key={label} variant="ghost" className={`flex flex-col items-center h-auto p-2 gap-1 text-xs ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                <Icon className={`h-6 w-6`} />
                <span>{label}</span>
            </Button>
        ))}
      </div>
    </footer>
  );
}
