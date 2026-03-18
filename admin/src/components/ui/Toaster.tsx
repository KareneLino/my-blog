import { Toaster as Sonner } from 'sonner';
import { useTheme } from '../ThemeProvider';

/**
 * Toaster 原子组件
 * 封装 sonner，提供符合 Pro-sumer 规范的全局提示功能
 */
export function Toaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as 'light' | 'dark' | 'system'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast glass-panel rounded-2xl border-white/20 dark:border-white/10 shadow-2xl p-4 flex gap-3 items-center',
          title: 'text-sm font-semibold text-zinc-900 dark:text-zinc-50',
          description: 'text-xs text-zinc-500 dark:text-zinc-400',
          actionButton: 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-bold px-3 py-1.5 rounded-lg text-xs',
          cancelButton: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold px-3 py-1.5 rounded-lg text-xs',
          success: 'text-emerald-500',
          error: 'text-red-500',
          info: 'text-blue-500',
          warning: 'text-amber-500',
        },
      }}
    />
  );
}
