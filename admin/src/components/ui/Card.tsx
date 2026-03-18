import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sidebar' | 'flat';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card 原子组件
 * 基于拟态玻璃风格设计，支持 Framer Motion 动效
 */
export function Card({
  children,
  className,
  variant = 'default',
  hoverable = false,
  padding = 'md',
  ...props
}: CardProps) {
  const variants = {
    default: 'glass-panel',
    sidebar: 'glass-sidebar',
    flat: 'bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  return (
    <motion.div
      className={cn(
        variants[variant],
        paddings[padding],
        hoverable && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
