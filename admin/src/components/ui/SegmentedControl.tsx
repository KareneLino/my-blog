import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface Option {
  label: string;
  value: any;
}

interface SegmentedControlProps {
  id?: string; // 唯一标识，防止多实例下的 Framer Motion 冲突
  options: Option[];
  value: any;
  onChange: (value: any) => void;
  className?: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

/**
 * SegmentedControl 原子组件
 * 修复了多实例下的 layoutId 冲突问题
 */
export function SegmentedControl({
  id = "default",
  options,
  value,
  onChange,
  className,
  size = 'md',
  fullWidth = false
}: SegmentedControlProps) {
  return (
    <div className={cn(
      "flex items-center gap-1 p-1 bg-zinc-900/5 dark:bg-white/5 rounded-2xl shrink-0",
      fullWidth ? "w-full" : "w-fit",
      className
    )}>
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "relative px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer whitespace-nowrap",
              fullWidth ? "flex-1" : "min-w-fit",
              isActive 
                ? "text-zinc-900 dark:text-white" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200",
              size === 'sm' && "px-4 py-1.5 text-xs rounded-lg"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`segment-${id}`}
                className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-xl shadow-sm border border-white/50 dark:border-zinc-600/50 z-0"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
