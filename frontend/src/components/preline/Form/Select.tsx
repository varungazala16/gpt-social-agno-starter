'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  success?: boolean;
  helperText?: string;
}

/**
 * Select Component
 *
 * Dropdown select following Preline UI patterns
 * Supports error/success states and helper text
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      error = false,
      success = false,
      helperText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      // Base select styles compatible with @tailwindcss/forms
      'block w-full rounded-md',
      'px-3 py-2 pr-10',
      'text-sm',
      'transition-colors duration-200',
      'appearance-none',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
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
      },
      className
    );

    return (
      <div>
        <div className="relative">
          <select
            className={baseStyles}
            ref={ref}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? `${props.id}-helper` : undefined}
            {...props}
          >
            {children}
          </select>

          {/* Custom dropdown icon */}
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none',
              {
                'text-gray-400 dark:text-gray-500': !error && !success,
                'text-red-500 dark:text-red-400': error,
                'text-green-500 dark:text-green-400': success,
              }
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';

export { Select };
