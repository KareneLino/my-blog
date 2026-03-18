import React from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export function Header() {
  const { setIsMobileMenuOpen } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full h-16 flex items-center px-6 lg:px-10">
      <div className="flex items-center gap-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-zinc-500"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-zinc-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-50 dark:border-zinc-950" />
        </Button>
        <ThemeToggle />
        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 overflow-hidden ml-2 cursor-pointer hover:ring-2 ring-zinc-900/10 dark:ring-white/10 transition-all">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Karene"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
