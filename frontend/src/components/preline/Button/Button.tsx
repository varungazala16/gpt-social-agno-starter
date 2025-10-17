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
        // Solid - Primary button using design system primary color
        solid:
          cn(
            'bg-primary text-white shadow-sm',
            'hover:bg-primary/90',
            'focus-visible:ring-primary focus-visible:ring-offset-2',
            'dark:focus-visible:ring-offset-gray-900',
            'transition-smooth'
          ),
        // Primary - Same as solid for consistency
        primary:
          cn(
            'bg-primary text-white shadow-sm',
            'hover:bg-primary/90',
            'focus-visible:ring-primary focus-visible:ring-offset-2',
            'dark:focus-visible:ring-offset-gray-900',
            'transition-smooth'
          ),
        // Destructive - Danger/delete actions using design system negative color
        destructive:
          cn(
            'bg-negative text-white shadow-sm',
            'hover:bg-negative/90',
            'focus-visible:ring-negative focus-visible:ring-offset-2',
            'dark:focus-visible:ring-offset-gray-900',
            'transition-smooth'
          ),
        // Outline - Secondary actions
        outline:
          cn(
            'border-2 border-gray-300 dark:border-gray-700 bg-transparent',
            'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'hover:border-primary dark:hover:border-primary',
            'focus-visible:ring-primary focus-visible:ring-offset-2',
            'dark:focus-visible:ring-offset-gray-900',
            'transition-smooth'
          ),
        // Secondary - Soft gray background
        secondary:
          cn(
            'bg-gray-100 text-gray-900',
            'hover:bg-gray-200',
            'focus-visible:ring-gray-600 focus-visible:ring-offset-2',
            'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
            'dark:focus-visible:ring-offset-gray-900',
            'transition-smooth'
          ),
        // Ghost - Minimal style
        ghost:
          cn(
            'text-gray-700 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'focus-visible:ring-primary focus-visible:ring-offset-2',
            'dark:focus-visible:ring-offset-gray-900',
            'transition-smooth'
          ),
        // Soft - Subtle with primary color
        soft:
          cn(
            'bg-subtle-prime text-primary',
            'hover:bg-primary/10',
            'focus-visible:ring-primary focus-visible:ring-offset-2',
            'dark:bg-primary/10 dark:hover:bg-primary/20',
            'dark:focus-visible:ring-offset-gray-900',
            'transition-smooth'
          ),
        // Link - Text link style with primary color
        link:
          cn(
            'text-primary underline-offset-4',
            'hover:underline',
            'focus-visible:ring-primary focus-visible:ring-offset-2',
            'dark:focus-visible:ring-offset-gray-900'
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
