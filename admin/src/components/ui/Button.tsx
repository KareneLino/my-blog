import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

/**
 * Button 原子组件
 * 集成 Pro-sumer 风格动效与拟态质感
 */
export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-950/10 dark:shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-100',
    secondary: 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50',
    ghost: 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100',
    glass: 'glass-panel bg-white/20 dark:bg-zinc-800/20 text-zinc-900 dark:text-white border-white/30 dark:border-zinc-700/30 hover:bg-white/30 dark:hover:bg-zinc-800/40',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl font-semibold',
    lg: 'px-10 py-4 text-lg rounded-2xl font-bold',
    icon: 'p-3 rounded-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:y-0',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          处理中...
        </span>
      ) : children}
    </motion.button>
  );
}
