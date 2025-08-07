
'use client';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTheme } from '@/app/theme-provider';
import { useEffect, useState } from 'react';

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  const Icon = theme.icon;

  return (
    <header className="p-4 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          SHADOW
        </h1>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            {mounted && <Icon className="h-5 w-5 text-primary" />}
          </Button>
          <div className="flex items-center gap-2 text-sm">
            <span>Analyzing</span>
            <div className='flex items-center gap-0.5'>
              <span className='w-1 h-1 rounded-full bg-primary animate-pulse'></span>
              <span className='w-1 h-1 rounded-full bg-primary animate-pulse delay-150'></span>
              <span className='w-1 h-1 rounded-full bg-primary animate-pulse delay-300'></span>
            </div>
            <Badge variant="secondary" className="bg-amber-400/20 text-amber-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className='mr-1'
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 15v-1.89c-1.48-.37-2.69-1.59-3.06-3.07H7.1c.38 2.29 2.28 4.05 4.9 4.25M12 4c2.37 0 4.35 1.76 4.81 4.05h-1.62c-.37-1.3-1.44-2.37-2.74-2.74v-1.6c.15 0 .29.01.44.02C13.62 4.02 12.83 4 12 4m0 5.5c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3m4.9 1.55c.37 1.48 1.59 2.69 3.06 3.07v1.89c-2.62-.2-4.52-1.96-4.9-4.25m-6.42-3.07v1.62c1.3.37 2.37 1.44 2.74 2.74h1.6c0-.15-.01-.29-.02-.44c0-1.02.38-1.95 1-2.72c-.67-.77-1.6-1.28-2.72-1.28c-.01 0-.01 0 0 0c-.83 0-1.62.38-2.16 1s-.86 1.33-1 2.16c-.01.15-.02.3-.02.45h-1.6c.38-2.29 2.28-4.05 4.9-4.25v1.62c-1.48.37-2.69-1.59-3.06 3.07"
                ></path>
              </svg>
              16
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
