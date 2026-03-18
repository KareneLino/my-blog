import React from 'react';
import { cn } from '../../lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Heading 标题组件
 * 采用衬线体，展现人文与优雅质感
 */
export function Heading({
  children,
  className,
  as: Component = 'h1',
}: TypographyProps) {
  const styles = {
    h1: 'text-3xl font-bold tracking-tight',
    h2: 'text-2xl font-semibold tracking-tight',
    h3: 'text-xl font-semibold tracking-tight',
    h4: 'text-lg font-semibold tracking-tight',
  };

  return (
    <Component
      className={cn(
        'font-serif text-zinc-900 dark:text-zinc-50',
        styles[Component as keyof typeof styles] || styles.h1,
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Text 正文组件
 * 采用现代无衬线体，优化长文阅读体验
 */
export function Text({
  children,
  className,
  as: Component = 'p',
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'font-sans text-zinc-600 dark:text-zinc-400 leading-relaxed',
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Label 微型标签组件
 * 全大写、宽间距、加粗，体现 Pro-sumer 的技术细节感
 */
export function Label({
  children,
  className,
  as: Component = 'span',
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'text-xs uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-500 ml-0.5',
        className
      )}
    >
      {children}
    </Component>
  );
}
