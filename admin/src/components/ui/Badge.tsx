import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  dot?: boolean;
}

/**
 * Badge 原子组件
 * 基于 Primer 语义化色彩与拟态通透感
 */
export function Badge({ 
  children, 
  variant = 'default', 
  className,
  dot = false 
}: BadgeProps) {
  const variants = {
    default: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  const dots = {
    default: 'bg-zinc-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase',
      variants[variant],
      className
    )}>
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dots[variant])} />
      )}
      {children}
    </span>
  );
}
