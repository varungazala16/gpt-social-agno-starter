'use client'

import { Coins } from 'lucide-react'
import { useCredits } from '@/hooks/useCredits'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface CreditsDisplayProps {
  className?: string
}

export function CreditsDisplay({ className }: CreditsDisplayProps) {
  const {
    balance,
    isLoading,
    error
  } = useCredits()

  // Don't render if there's an authentication error
  if (error?.message?.includes('Not authenticated')) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2 w-full', className)}>
      {/* Credits Display */}
      <div className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex-1">
        <Coins className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        {isLoading ? (
          <div className="flex items-center gap-1 flex-1">
            <Skeleton className="h-3 w-10 bg-yellow-200/50 dark:bg-yellow-800/30" />
            <span className="text-xs text-yellow-600 dark:text-yellow-400">
              credits
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200 truncate">
              {error ? '?' : (balance?.toLocaleString() ?? '0')}
            </span>
            <span className="text-xs text-yellow-600 dark:text-yellow-400 flex-shrink-0">
              credits
            </span>
          </div>
        )}
      </div>
    </div>
  )
}