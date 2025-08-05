'use client';
import { Button } from '../ui/button';

export function BottomBar() {
  return (
    <footer className="p-4 bg-background border-t border-border/20">
      <div className="flex items-center justify-around gap-2">
        <Button className="flex-1 text-lg" size="lg">Analyze</Button>
        <Button className="flex-1 text-lg" size="lg">Request</Button>
        <Button className="flex-1 text-lg" size="lg">Ask</Button>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2">AI Realtime Insights</p>
    </footer>
  );
}
