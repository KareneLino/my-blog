import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface DetailLayoutProps {
  /** 页面标题 */
  title: string;
  /** 副标题/描述 */
  subtitle?: string;
  /** Hero 区域背景图 */
  coverImage?: string;
  /** 返回按钮目标路径 */
  backPath: string;
  /** 右侧操作区 */
  actions?: React.ReactNode;
  /** 内容区域 */
  children: React.ReactNode;
  /** 是否启用入场动画 */
  animated?: boolean;
}

/**
 * DetailLayout 详情页统一布局
 * 
 * 适用层级：
 * - 第二层级：详情页（CategoryDetail、未来的 AuthorDetail 等）
 * 
 * 布局结构：
 * [返回导航] + [Hero 区域] + [内容区域]
 * 
 * 特点：
 * - 统一的返回导航
 * - 可选的 Hero 封面区
 * - 统一的内容容器
 */
export function DetailLayout({
  title,
  subtitle,
  coverImage,
  backPath,
  actions,
  children,
  animated = true
}: DetailLayoutProps) {
  const navigate = useNavigate();

  const content = (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => navigate(backPath)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Hero 区域（可选） */}
      {(title || coverImage) && (
        <div className="mb-12">
          {coverImage ? (
            <div className="relative h-[300px] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-white/80 text-lg">{subtitle}</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-zinc-500 dark:text-zinc-400 text-lg">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 内容区域 */}
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
