import * as React from 'react';
import { cn } from '@/lib/utils';

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('p-4 sm:p-6', className)}
      {...props}
    />
  );
}

CardHeader.displayName = 'CardHeader';
