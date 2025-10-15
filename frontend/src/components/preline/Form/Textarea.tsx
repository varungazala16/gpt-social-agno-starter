'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * Textarea Component
 *
 * Multi-line text input following Preline UI patterns
 * Supports error/success states and helper text
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error = false,
      success = false,
      helperText,
      resize = 'vertical',
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      // Base textarea styles compatible with @tailwindcss/forms
      'block w-full rounded-md',
      'px-3 py-2',
      'text-sm',
      'transition-colors duration-200',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      // Resize behavior
      {
        'resize-none': resize === 'none',
        'resize-y': resize === 'vertical',
        'resize-x': resize === 'horizontal',
        resize: resize === 'both',
      },
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
        <textarea
          className={baseStyles}
          ref={ref}
          disabled={disabled}
          rows={rows}
          aria-invalid={error}
          aria-describedby={helperText ? `${props.id}-helper` : undefined}
          {...props}
        />

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

Textarea.displayName = 'Textarea';

export { Textarea };
