import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverEffect?: boolean
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-300',
        hoverEffect && 'hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6 border-b border-slate-100 dark:border-slate-800/60', className)} {...props}>
    {children}
  </div>
)

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
)

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/60', className)} {...props}>
    {children}
  </div>
)
