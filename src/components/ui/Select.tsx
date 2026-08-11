import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, containerClassName, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50',
            error ? 'border-red-500 dark:border-red-500/80' : 'border-slate-200 dark:border-slate-800',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-red-500 dark:text-red-400">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
