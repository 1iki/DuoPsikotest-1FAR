import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning'
    | 'info';
}

const badgeVariants = {
  default:
    'border-transparent bg-indigo-600 text-white shadow-xs dark:bg-indigo-600 dark:text-white',
  secondary:
    'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  destructive:
    'border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  outline:
    'text-gray-700 border-gray-300 dark:text-gray-300 dark:border-gray-700',
  success:
    'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  warning:
    'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  info:
    'border-transparent bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
};

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
