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
 * 
 * 响应式设计：
 * - 移动端: 标题 2xl (24px)，垂直堆叠
 * - 桌面端: 标题 4xl/5xl，水平排列
 * 
 * 核心基准：items-center 对齐，pl-2 视错觉修正，无内边距干扰
 */
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pl-1 sm:pl-2",
      className
    )}>
      <div className="space-y-1">
        <Heading 
          as="h1" 
          className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl"
        >
          {title}
        </Heading>
        {subtitle && (
          <Text className="text-sm sm:text-base text-zinc-500 font-sans">
            {subtitle}
          </Text>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
