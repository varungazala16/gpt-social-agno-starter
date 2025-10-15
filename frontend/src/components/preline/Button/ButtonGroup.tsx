import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

/**
 * ButtonGroup Component
 *
 * Container for grouping related buttons
 * Follows Preline button group patterns
 */
export function ButtonGroup({
  className,
  orientation = 'horizontal',
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        '[&>button]:rounded-none',
        '[&>button:first-child]:rounded-l-md',
        '[&>button:last-child]:rounded-r-md',
        orientation === 'vertical' && '[&>button:first-child]:rounded-t-md [&>button:first-child]:rounded-l-none',
        orientation === 'vertical' && '[&>button:last-child]:rounded-b-md [&>button:last-child]:rounded-r-none',
        '[&>button:not(:last-child)]:border-r-0',
        orientation === 'vertical' && '[&>button:not(:last-child)]:border-r [&>button:not(:last-child)]:border-b-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

ButtonGroup.displayName = 'ButtonGroup';
