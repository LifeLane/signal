
'use client';
import { Home, History, Newspaper, Gem, LineChart } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';

export type NavItem = 'SHADOW' | 'Dashboard' | 'Signals' | 'AI News' | 'Premium';

interface BottomBarProps {
  activeView: NavItem;
  setActiveView: Dispatch<SetStateAction<NavItem>>;
}

export function BottomBar({ activeView, setActiveView }: BottomBarProps) {
  const navItems: { icon: React.ElementType, label: NavItem }[] = [
    { icon: Home, label: 'SHADOW' },
    { icon: LineChart, label: 'Dashboard' },
    { icon: History, label: 'Signals' },
    { icon: Newspaper, label: 'AI News' },
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
