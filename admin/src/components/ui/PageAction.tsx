import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface PageActionProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

/**
 * PageAction 统一页面顶级动作组件
 * 核心特征：h-12, px-8, rounded-2xl, shadow-xl, font-bold
 * 采用极致黑白高对比度设计 (High-Contrast Monochrome)
 */
export function PageAction({ 
  icon: Icon, 
  children, 
  onClick, 
  className,
  variant = 'primary',
  disabled = false
}: PageActionProps) {
  
  // 极致黑白配色逻辑
  const variants = {
    // 亮色模式下是黑底白字，暗色模式下是白底黑字
    primary: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-none shadow-xl hover:scale-105 active:scale-95 transition-all",
    // 亮色模式下是浅灰，暗色模式下是深灰
    secondary: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-700",
  };

  return (
    <Button 
      variant={variant === 'secondary' ? 'secondary' : 'primary'}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-12 px-8 text-base font-bold rounded-2xl",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5 mr-2 shrink-0" />}
      {children}
    </Button>
  );
}
