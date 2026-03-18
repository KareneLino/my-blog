import React from 'react';
import { cn } from '../../lib/utils';
import { Heading, Text } from './Typography';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader 统一页面标题框架组件
 * 核心基准：items-center 对齐，pl-2 视错觉修正，无内边距干扰
 */
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-6 pl-2 sm:pl-3",
      className
    )}>
      <div className="space-y-1">
        <Heading as="h1" className="text-4xl md:text-5xl">{title}</Heading>
        {subtitle && <Text className="text-lg text-zinc-500 font-sans">{subtitle}</Text>}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
