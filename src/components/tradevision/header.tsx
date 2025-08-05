'use client';

import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="p-4 space-y-4 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          SHADOW
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
