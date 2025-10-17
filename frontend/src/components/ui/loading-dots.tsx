import { cn } from '@/lib/utils'

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const dotSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
}

export function LoadingDots({ size = 'md', className }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} role="status" aria-label="Loading">
      <span
        className={cn(
          'rounded-full bg-primary',
          dotSizes[size],
          'animate-pulse-subtle'
        )}
        style={{ animationDelay: '0s' }}
      />
      <span
        className={cn(
          'rounded-full bg-primary',
          dotSizes[size],
          'animate-pulse-subtle'
        )}
        style={{ animationDelay: '0.2s' }}
      />
      <span
        className={cn(
          'rounded-full bg-primary',
          dotSizes[size],
          'animate-pulse-subtle'
        )}
        style={{ animationDelay: '0.4s' }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
