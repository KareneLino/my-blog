import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from './Card';
import { Button } from './Button';
import { Heading } from './Typography';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

/**
 * Modal 原子组件
 * 采用高强度背景模糊与沉浸式拟态卡片设计
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  // 禁用背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl transition-all"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn('relative w-full z-10', sizes[size])}
          >
            <Card padding="none" className="overflow-hidden shadow-2xl border-white/30 dark:border-zinc-700/50">
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/20 dark:border-zinc-700/30">
                  {title ? (
                    <Heading as="h3" className="text-xl font-bold">
                      {title}
                    </Heading>
                  ) : <div />}
                  
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="rounded-full -mr-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-8">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200/20 dark:border-zinc-700/30">
                  {footer}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
