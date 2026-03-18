import React from 'react';
import { Search, Filter, LucideIcon } from 'lucide-react';
import { SegmentedControl } from './SegmentedControl';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface FilterBarProps {
  // Tabs 配置
  tabs?: { label: string, value: any }[];
  activeTab?: any;
  onTabChange?: (value: any) => void;
  
  // 搜索配置
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  
  // 额外操作 (比如 Filter 漏斗按钮)
  extraActions?: React.ReactNode;
  
  // 颜色主题
  accentColor?: 'purple' | 'zinc' | 'blue' | 'emerald';
}

/**
 * FilterBar 增强型过滤搜索条
 * 特征：2.5rem 圆角, 玻璃背板, 左右对齐, 移动端适配
 */
export function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder = "搜索相关内容...",
  searchValue,
  onSearchChange,
  extraActions,
  accentColor = 'zinc'
}: FilterBarProps) {
  
  const accentRing = {
    zinc: "focus:ring-4 ring-zinc-900/10 dark:ring-white/10 focus:border-zinc-900 dark:focus:border-white",
    purple: "focus:ring-4 ring-purple-500/20 focus:border-purple-500",
    blue: "focus:ring-4 ring-blue-500/20 focus:border-blue-500",
    emerald: "focus:ring-4 ring-emerald-500/20 focus:border-emerald-500",
    amber: "focus:ring-4 ring-amber-500/20 focus:border-amber-500",
    indigo: "focus:ring-4 ring-indigo-500/20 focus:border-indigo-500",
  }[accentColor];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/5 dark:bg-zinc-900/5 p-2 rounded-[2.5rem] border border-white/10 shadow-sm">
      {/* 左侧：切换标签 */}
      {tabs && onTabChange && (
        <div className="w-full lg:w-auto overflow-x-auto scrollbar-hidden">
          <SegmentedControl 
            options={tabs}
            value={activeTab}
            onChange={onTabChange}
          />
        </div>
      )}

      {/* 右侧：搜索与操作 */}
      <div className="flex items-center gap-4 w-full lg:w-auto lg:pr-4">
        <div className="relative flex-1 lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input 
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm transition-all outline-none",
              accentRing
            )}
          />
        </div>
        {extraActions ? extraActions : (
          <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl shrink-0">
            <Filter className="h-4.5 w-4.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
