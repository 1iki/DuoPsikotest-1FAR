import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'success';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const buttonVariants = {
  variant: {
    default:
      'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-700',
    destructive:
      'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800',
    outline:
      'border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 focus-visible:ring-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800',
    secondary:
      'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    ghost:
      'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700',
    link: 'text-indigo-600 underline-offset-4 hover:underline p-0 h-auto dark:text-indigo-400',
    success:
      'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-700',
  },
  size: {
    default: 'h-11 px-4 py-2 text-sm font-medium rounded-xl',
    sm: 'h-9 px-3 text-xs font-medium rounded-lg',
    lg: 'h-13 px-6 text-base font-semibold rounded-2xl',
    icon: 'h-10 w-10 p-0 rounded-xl flex items-center justify-center',
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const variantClass = buttonVariants.variant[variant];
    const sizeClass = buttonVariants.size[size];

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variantClass,
          sizeClass,
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
