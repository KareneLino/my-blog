import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  label: string;
  className?: string;
  children?: React.ReactNode;
}

export function ToolbarButton({ icon: Icon, onClick, label, className, children }: ToolbarButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={onClick}
        title={label}
        className={cn("p-2.5 hover:bg-zinc-900/10 dark:hover:bg-white/20 rounded-xl transition-all cursor-pointer group", className)}
      >
        <Icon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
      </button>
      {children}
    </div>
  );
}

interface EditorToolbarProps {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export function EditorToolbar({
  leftContent,
  centerContent,
  rightContent,
  className,
  sticky = true,
}: EditorToolbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!sticky) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  return (
    <div className={cn(
      "fixed top-6 left-1/2 -translate-x-1/2 z-[60] transition-all duration-700 w-full px-6 flex justify-center pointer-events-none",
      className
    )}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "flex items-center justify-between pointer-events-auto transition-all duration-700 ease-out",
          "glass-panel px-3 py-2 gap-4",
          "rounded-[2.5rem] border border-white/30 dark:border-zinc-700/50 shadow-2xl",
          "bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl",
          isScrolled ? "scale-[0.98] shadow-zinc-950/20 translate-y-[-4px]" : "scale-100 translate-y-0",
          "w-fit min-w-[600px] max-w-full"
        )}
      >
        {/* 左侧控制区 */}
        <div className="flex items-center">
          {leftContent}
        </div>

        {/* 中间工具区 */}
        <div className="flex items-center gap-1">
          {centerContent}
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      </motion.div>
    </div>
  );
}
