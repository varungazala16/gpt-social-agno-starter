'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  error?: boolean;
}

/**
 * Label Component
 *
 * Form label following Preline UI patterns
 * Supports required indicator and error states
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, error, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium mb-1.5',
          {
            'text-gray-700 dark:text-gray-300': !error,
            'text-red-600 dark:text-red-400': error,
          },
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
