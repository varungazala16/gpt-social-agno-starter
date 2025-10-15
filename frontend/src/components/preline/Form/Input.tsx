'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Input Component
 *
 * Flexible input field following Preline UI patterns
 * Supports error/success states, icons, and helper text
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      error = false,
      success = false,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      // Base input styles compatible with @tailwindcss/forms
      'block w-full rounded-md',
      'text-sm',
      'transition-colors duration-200',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      // Padding adjustments for icons
      leftIcon ? 'pl-10' : 'px-3',
      rightIcon ? 'pr-10' : 'px-3',
      'py-2',
      // State-specific styles
      {
        // Default state
        'border border-gray-300 dark:border-gray-700': !error && !success,
        'bg-white dark:bg-gray-900': !error && !success,
        'text-gray-900 dark:text-gray-100': !error && !success,
        'focus:border-blue-500 focus:ring-blue-500': !error && !success,

        // Error state
        'border-red-500 dark:border-red-600': error,
        'bg-red-50 dark:bg-red-950': error,
        'text-red-900 dark:text-red-100': error,
        'focus:border-red-500 focus:ring-red-500': error,

        // Success state
        'border-green-500 dark:border-green-600': success,
        'bg-green-50 dark:bg-green-950': success,
        'text-green-900 dark:text-green-100': success,
        'focus:border-green-500 focus:ring-green-500': success,

        // Disabled state
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800':
          disabled,
      }
    );

    const containerClasses = cn('relative', className);

    const iconClasses = (position: 'left' | 'right') =>
      cn(
        'absolute top-1/2 -translate-y-1/2 pointer-events-none',
        position === 'left' ? 'left-3' : 'right-3',
        {
          'text-gray-400 dark:text-gray-500': !error && !success,
          'text-red-500 dark:text-red-400': error,
          'text-green-500 dark:text-green-400': success,
        },
        '[&_svg]:w-4 [&_svg]:h-4'
      );

    return (
      <div className={containerClasses}>
        <div className="relative">
          {leftIcon && (
            <div className={iconClasses('left')}>{leftIcon}</div>
          )}

          <input
            type={type}
            className={baseStyles}
            ref={ref}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? `${props.id}-helper` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className={iconClasses('right')}>{rightIcon}</div>
          )}
        </div>

        {helperText && (
          <p
            id={`${props.id}-helper`}
            className={cn('mt-1.5 text-xs', {
              'text-gray-500 dark:text-gray-400': !error && !success,
              'text-red-600 dark:text-red-400': error,
              'text-green-600 dark:text-green-400': success,
            })}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
