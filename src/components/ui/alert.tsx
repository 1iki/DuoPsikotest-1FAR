import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
}

const alertVariants = {
  default: 'bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100',
  destructive: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/60 dark:border-red-900/60 dark:text-red-200',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-900/60 dark:text-emerald-200',
  warning: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/60 dark:border-amber-900/60 dark:text-amber-200',
  info: 'bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950/60 dark:border-sky-900/60 dark:text-sky-200',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-xl border p-4 text-sm leading-relaxed flex items-start gap-3',
        alertVariants[variant],
        className
      )}
      {...props}
    />
  )
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight mb-1', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed opacity-90', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';
