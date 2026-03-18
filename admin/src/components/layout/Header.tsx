import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

/**
 * Header - 顶部导航栏
 * 
 * 响应式设计：
 * - 移动端 (<lg): 显示汉堡菜单 + Logo，有背景横条
 * - 桌面端 (>=lg): 仅显示右侧工具按钮，透明无横条（Sidebar 已提供导航）
 */
export function Header() {
  const { setIsMobileMenuOpen } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full h-16 flex items-center px-4 sm:px-6 lg:px-10 lg:bg-transparent lg:backdrop-blur-none lg:border-b-0 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border-b border-white/20 dark:border-zinc-800/20">
      {/* 左侧：移动端汉堡菜单 + Logo */}
      <div className="flex items-center gap-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
          className="h-10 w-10 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50"
          aria-label="打开导航菜单"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* 移动端显示 Logo 文字 */}
        <span className="text-lg font-serif font-bold text-zinc-900 dark:text-white">
          字里行间
        </span>
      </div>

      {/* 右侧：工具按钮组（始终显示） */}
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-xl text-zinc-500 hover:bg-white/50 dark:hover:bg-zinc-800/50 relative"
          aria-label="通知"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
        </Button>
        
        <ThemeToggle />
        
        {/* 用户头像 */}
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-700 overflow-hidden ml-1 cursor-pointer hover:ring-2 ring-zinc-900/10 dark:ring-white/10 transition-all">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Karene"
            alt="用户头像"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
