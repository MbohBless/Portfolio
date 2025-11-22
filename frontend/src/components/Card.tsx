import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all rounded-lg',
        hoverable && 'hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}
