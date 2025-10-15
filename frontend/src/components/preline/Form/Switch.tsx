'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Switch Component
 *
 * Toggle switch following Preline UI patterns
 * Built on Radix UI primitives for accessibility
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-7',
    default: 'h-5 w-9',
    lg: 'h-6 w-11',
  };

  const thumbSizeClasses = {
    sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
    default: 'h-4 w-4 data-[state=checked]:translate-x-4',
    lg: 'h-5 w-5 data-[state=checked]:translate-x-5',
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent shadow-sm',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700',
        sizeClasses[size],
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-lg ring-0',
          'transition-transform duration-200',
          'data-[state=unchecked]:translate-x-0',
          thumbSizeClasses[size]
        )}
      />
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
