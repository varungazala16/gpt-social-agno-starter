import * as React from 'react';
import { cn } from '@/lib/utils';

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

export function CardBody({ className, ...props }: CardBodyProps) {
  return (
    <div
      className={cn('p-4 sm:p-6 pt-0', className)}
      {...props}
    />
  );
}

CardBody.displayName = 'CardBody';
