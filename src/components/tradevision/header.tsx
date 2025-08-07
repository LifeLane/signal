
'use client';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Wand2 } from 'lucide-react';

export function AppHeader() {
  
  return (
    <header className="p-4 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          SHADOW
        </h1>
      </div>
    </header>
  );
}
