import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: LucideIcon;
  underlineColor?: string;
  saveText?: string;
  onSave?: () => void;
  children: React.ReactNode;
}

/**
 * 工业化配置项容器 (原子级)
 */
export function SettingField({ 
  icon: Icon, 
  label, 
  children,
  activeColorClass = "group-focus-within:text-zinc-900 dark:group-focus-within:text-white"
}: { 
  icon: LucideIcon, 
  label: string, 
  children: React.ReactNode,
  activeColorClass?: string
}) {
  return (
    <div className="group space-y-4 text-left">
      <div className="flex items-center px-1">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-8 w-8 rounded-xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/10 dark:border-white/10 flex items-center justify-center text-zinc-400 transition-colors",
            activeColorClass
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans">{label}</span>
        </div>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

/**
 * SettingsDrawer 通用配置侧边栏组件
 * 采用统一的“悬浮曲面控制台”视觉规范
 */
export function SettingsDrawer({
  isOpen,
  onClose,
  title,
  icon: Icon = Sparkles,
  underlineColor = "bg-zinc-900 dark:bg-white",
  saveText = "保存全部设置",
  onSave,
  children
}: SettingsDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 深度拟态遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 w-full h-full bg-zinc-950/40 backdrop-blur-xl z-[70]"
          />

          {/* 悬浮曲面控制台 */}
          <motion.div
            initial={{ x: '110%', scale: 0.95 }}
            animate={{ x: 0, scale: 1 }}
            exit={{ x: '110%', scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 180 }}
            className={cn(
              "fixed right-0 inset-y-0 w-full max-w-lg z-[80]",
              "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl",
              "border-l border-white/30 dark:border-zinc-800/50 shadow-[-20px_0_50px_rgba(0,0,0,0.3)]",
              "rounded-l-[4rem] p-12 flex flex-col gap-12 overflow-y-auto scrollbar-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex flex-col gap-2 text-left">
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-6 w-6", underlineColor.replace('bg-', 'text-'))} />
                  <h2 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">{title}</h2>
                </div>
                <div className={cn("w-12 h-1 rounded-full", underlineColor)} />
              </div>
              <button 
                onClick={onClose}
                className="h-12 w-12 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* 表单主体 */}
            <div className="flex-1 space-y-10">
              {children}
            </div>

            {/* Footer Action */}
            <div className="pt-2 shrink-0">
              <Button 
                variant="primary" 
                onClick={onSave || onClose} 
                className="w-full h-16 rounded-[2.5rem] text-lg font-bold shadow-2xl shadow-zinc-900/20 dark:shadow-zinc-950/50 border border-white/10"
              >
                {saveText}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
