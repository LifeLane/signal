'use client';
import { Home, Compass, BarChart, User } from 'lucide-react';
import { Button } from '../ui/button';

export function BottomBar() {
  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: Compass, label: 'Discover' },
    { icon: BarChart, label: 'Analytics' },
    { icon: User, label: 'Profile' },
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
