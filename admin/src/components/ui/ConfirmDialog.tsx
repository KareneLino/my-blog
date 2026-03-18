import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Heading, Text } from './Typography';
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const variantConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-500',
    buttonClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    buttonClass: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white',
  },
  danger: {
    icon: AlertCircle,
    iconClass: 'text-red-500',
    buttonClass: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    buttonClass: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white',
  },
  primary: {
    icon: Info,
    iconClass: 'text-zinc-500',
    buttonClass: 'bg-zinc-900 dark:bg-white border-zinc-950 dark:border-zinc-200 text-white dark:text-zinc-900 hover:opacity-90',
  },
};

export function ConfirmDialog() {
  const { confirmOptions, closeConfirm } = useApp();

  if (!confirmOptions) return null;

  const {
    title,
    content,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    onConfirm
  } = confirmOptions;

  const handleConfirm = () => {
    onConfirm();
    closeConfirm();
  };

  const config = variantConfig[variant as keyof typeof variantConfig] || variantConfig.primary;
  const Icon = config.icon;

  return (
    <Modal
      isOpen={!!confirmOptions}
      onClose={closeConfirm}
      size="sm"
      showCloseButton={false}
    >
      <div className="-m-6 flex flex-col min-h-[200px]">
        {/* Header - Primer 风格功能分区 */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-zinc-200/10 dark:border-zinc-700/20 bg-zinc-900/5 dark:bg-white/5">
          <Icon className={cn("h-5 w-5", config.iconClass)} />
          <Heading as="h3" className="text-base font-bold tracking-tight">
            {title}
          </Heading>
        </div>

        {/* Body - 沉浸式内容 */}
        <div className="flex-1 px-6 py-8">
          <Text className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
            {content}
          </Text>
        </div>

        {/* Footer - 工业级操作区 */}
        <div className="px-6 py-4 flex justify-end items-center gap-2 border-t border-zinc-200/10 dark:border-zinc-700/20">
          <button
            onClick={closeConfirm}
            className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm border",
              config.buttonClass
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
