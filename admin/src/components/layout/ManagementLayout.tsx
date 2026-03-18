import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { PageAction } from '../ui/PageAction';
import { FilterBar } from '../ui/FilterBar';

interface ManagementLayoutProps {
  // Header 属性
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
  headerActions?: React.ReactNode;

  // FilterBar 属性
  tabs?: { label: string, value: any }[];
  activeTab?: any;
  onTabChange?: (value: any) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  accentColor?: 'purple' | 'zinc' | 'blue' | 'emerald';
  filterActions?: React.ReactNode;

  // 内容
  children: React.ReactNode;
}

/**
 * ManagementLayout 统一管理页面容器
 * 采用“Header -> FilterBar -> Content”三段式工业标准
 */
export function ManagementLayout({
  title,
  subtitle,
  primaryAction,
  headerActions,
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  accentColor = 'zinc',
  filterActions,
  children
}: ManagementLayoutProps) {
  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 px-4 md:px-0">
      {/* 1. Header Section */}
      <PageHeader 
        title={title} 
        subtitle={subtitle}
        actions={
          <>
            {headerActions}
            {primaryAction && (
              <PageAction icon={primaryAction.icon} onClick={primaryAction.onClick}>
                {primaryAction.label}
              </PageAction>
            )}
          </>
        }
      />

      {/* 2. Filter Section */}
      <FilterBar 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        accentColor={accentColor}
        extraActions={filterActions}
      />

      {/* 3. Content Section */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
