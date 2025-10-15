import * as React from 'react';
import { cn } from '@/lib/utils';

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'p-4 sm:p-6 pt-0',
        'flex items-center gap-2',
        className
      )}
      {...props}
    />
  );
}

CardFooter.displayName = 'CardFooter';
