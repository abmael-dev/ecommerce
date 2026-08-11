import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 text-sm transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-red-500 dark:border-red-500/80 focus:ring-red-500/50 focus:border-red-500'
                : 'border-slate-200 dark:border-slate-800',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
