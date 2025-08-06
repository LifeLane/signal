
'use client';
import { Home, History, BarChart, Newspaper, Gem } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';

export type NavItem = 'Prime' | 'Signals' | 'Dashboard' | 'AI News' | 'Premium';

interface BottomBarProps {
  activeView: NavItem;
  setActiveView: Dispatch<SetStateAction<NavItem>>;
}

export function BottomBar({ activeView, setActiveView }: BottomBarProps) {
  const navItems = [
    { icon: Home, label: 'Prime' as NavItem },
    { icon: History, label: 'Signals' as NavItem },
    { icon: BarChart, label: 'Dashboard' as NavItem },
    { icon: Newspaper, label: 'AI News' as NavItem },
    { icon: Gem, label: 'Premium' as NavItem },
  ];

  return (
    <footer className="p-2 bg-background border-t border-border/20">
      <div className="flex items-center justify-around">
        {navItems.map(({ icon: Icon, label }) => (
            <Button 
              key={label} 
              variant="ghost" 
              className={`flex flex-col items-center h-auto p-2 gap-1 text-xs ${activeView === label ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveView(label)}
            >
                <Icon className={`h-6 w-6`} />
                <span>{label}</span>
            </Button>
        ))}
      </div>
    </footer>
  );
}
