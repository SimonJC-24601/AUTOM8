
'use client';

import { useState } from 'react';
import { Search, Menu, X, Zap, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface HeaderProps {
  onSearch: (query: string) => void;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function Header({ onSearch, onMenuToggle, sidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Left section - Logo and menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                N8N Workflows
              </h1>
              <p className="text-xs text-muted-foreground">LifejacketAI Directory</p>
            </div>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
            />
          </form>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Settings className="h-4 w-4 mr-2" />
            API
          </Button>
          <ModeToggle />
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden border-t border-border/40 p-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </form>
      </div>
    </header>
  );
}
