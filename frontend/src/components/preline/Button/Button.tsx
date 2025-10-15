import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  cn(
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-md',
    'transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        // Solid - Primary blue button (Preline solid style)
        solid:
          cn(
            'bg-blue-600 text-white shadow-sm',
            'hover:bg-blue-700',
            'focus-visible:ring-blue-600',
            'dark:bg-blue-600 dark:hover:bg-blue-700'
          ),
        // Primary - Semantic primary using theme colors
        primary:
          cn(
            'bg-primary text-primary-foreground shadow-sm',
            'hover:bg-primary/90',
            'focus-visible:ring-primary'
          ),
        // Destructive - Danger/delete actions
        destructive:
          cn(
            'bg-red-600 text-white shadow-sm',
            'hover:bg-red-700',
            'focus-visible:ring-red-600',
            'dark:bg-red-700 dark:hover:bg-red-800'
          ),
        // Outline - Secondary actions (Preline outline style)
        outline:
          cn(
            'border-2 border-gray-300 bg-transparent',
            'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'hover:border-gray-400 dark:hover:border-gray-600',
            'focus-visible:ring-gray-600'
          ),
        // Secondary - Soft gray background
        secondary:
          cn(
            'bg-gray-100 text-gray-900',
            'hover:bg-gray-200',
            'focus-visible:ring-gray-600',
            'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
          ),
        // Ghost - Minimal style (Preline ghost style)
        ghost:
          cn(
            'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'focus-visible:ring-gray-600'
          ),
        // Soft - Subtle with color (Preline soft style)
        soft:
          cn(
            'bg-blue-50 text-blue-600',
            'hover:bg-blue-100',
            'focus-visible:ring-blue-600',
            'dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900'
          ),
        // Link - Text link style (Preline link style)
        link:
          cn(
            'text-blue-600 underline-offset-4',
            'hover:underline',
            'focus-visible:ring-blue-600',
            'dark:text-blue-400'
          ),
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

/**
 * Button Component
 *
 * Flexible button following Preline UI patterns
 * Supports multiple variants, sizes, and states
 * Mobile-first with full accessibility support
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
