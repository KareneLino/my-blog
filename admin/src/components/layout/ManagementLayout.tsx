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

  // FilterBar 属性 (可选)
  showFilterBar?: boolean;
  tabs?: { label: string, value: any }[];
  activeTab?: any;
  onTabChange?: (value: any) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  accentColor?: 'purple' | 'zinc' | 'blue' | 'emerald' | 'amber';
  filterActions?: React.ReactNode;

  // 内容
  children: React.ReactNode;
  
  // 动画控制
  animated?: boolean;
}

/**
 * ManagementLayout 统一管理页面容器
 * 采用"Header -> [FilterBar] -> Content"三段式工业标准
 * 
 * 适用层级：
 * - 第一层级：所有导航页（工作台、各类管理页）
 * - 第三层级：部分功能页（如文章编辑的元数据面板）
 * 
 * @param showFilterBar - 是否显示筛选栏，默认为 true
 *                       Dashboard/Settings 等无筛选需求的页面可设为 false
 * @param animated - 是否启用入场动画，默认 true
 */
export function ManagementLayout({
  title,
  subtitle,
  primaryAction,
  headerActions,
  showFilterBar = true,
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  accentColor = 'zinc',
  filterActions,
  children,
  animated = true
}: ManagementLayoutProps) {
  const content = (
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

      {/* 2. Filter Section (可选) */}
      {showFilterBar && (
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
      )}

      {/* 3. Content Section */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {content}
    </motion.div>
  );
}
