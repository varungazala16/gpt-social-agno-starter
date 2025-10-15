import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  hover?: boolean;
}

/**
 * Base Card Component
 * Flexible container following Preline patterns
 * Mobile-first, dark mode compatible
 */
export function Card({
  className,
  variant = 'default',
  hover = false,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
    outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800',
  };

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden',
        'transition-all duration-200',
        variants[variant],
        hover && 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.displayName = 'Card';
