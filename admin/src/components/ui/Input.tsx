import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRight?: React.ReactNode;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Input 原子组件
 * 基于拟态玻璃风格，支持图标插槽与标准状态反馈
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelRight, error, leftIcon, rightElement, className, containerClassName, id, ...props }, ref) => {
    return (
      <div className={cn('space-y-1.5 w-full', containerClassName)}>
        <div className="flex justify-between items-center ml-1">
          {label && (
            <label
              htmlFor={id}
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              {label}
            </label>
          )}
          {labelRight && (
            <div className="text-xs">
              {labelRight}
            </div>
          )}
        </div>
        
        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
              {leftIcon}
            </div>
          )}
          
          <input
            id={id}
            ref={ref}
            className={cn(
              'block w-full rounded-2xl border border-white/40 dark:border-zinc-700/40 bg-white/50 dark:bg-zinc-800/50 py-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white dark:focus:bg-zinc-800 dark:focus:ring-white transition-all shadow-sm',
              leftIcon ? 'pl-12' : 'pl-5',
              rightElement ? 'pr-12' : 'pr-5',
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-1">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
