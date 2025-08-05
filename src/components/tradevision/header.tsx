'use client';

import { Heart, LayoutDashboard, Newspaper, Crown, Shapes } from 'lucide-react';

export function AppHeader() {
  const navItems = [
    { icon: Shapes, label: 'Prime' },
    { icon: Heart, label: 'Favorites' },
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Newspaper, label: 'AI News' },
    { icon: Crown, label: 'Premium' },
  ];

  return (
    <header className="p-4 space-y-4 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shapes className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Pluto <span className="text-primary">AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>Analyzing</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-pulse delay-150"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse delay-300"></span>
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.515 11.124a1.125 1.125 0 010-1.996l3.266-1.042a1.125 1.125 0 011.363 1.363l-1.042 3.266a1.125 1.125 0 01-1.996 0l-.303-.955-.955-.303z"
                clipRule="evenodd"
              />
              <path d="M12.655 5.564a.75.75 0 01 .325 1.259l-2.25 1.35a.75.75 0 01-1.03-.625V5.25a.75.75 0 01.75-.75h.75a.75.75 0 01.575.26l.25.354z" />
              <path d="M13.435 15.485a.75.75 0 01-1.06-1.06l1.352-1.352a.75.75 0 011.06 1.06l-1.352 1.352z" />
            </svg>
            <span className="font-semibold">16</span>
          </div>
        </div>
      </div>
      <nav>
        <ul className="flex justify-around">
          {navItems.map(({ icon: Icon, label }, index) => (
            <li key={label} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <div className={`p-2 rounded-full ${index === 2 ? 'bg-primary/20' : ''}`}>
                <Icon className={`h-6 w-6 ${index === 2 ? 'text-primary' : ''}`} />
              </div>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
