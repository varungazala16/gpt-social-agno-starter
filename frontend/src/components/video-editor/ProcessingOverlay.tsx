'use client'

import { X, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProcessingOverlayProps {
  isProcessing: boolean
  progress: {
    current: number
    total: number
    operation: string
    subProgress?: number
  } | null
  error: string | null
  onCancel: () => void
  className?: string
}

export function ProcessingOverlay({
  isProcessing,
  progress,
  error,
  onCancel,
  className
}: ProcessingOverlayProps) {
  if (!isProcessing && !error) return null

  // Calculate overall progress
  // If subProgress is available, incorporate it into the calculation
  const progressPercent = progress
    ? Math.round(
        ((progress.current + (progress.subProgress || 0)) / progress.total) * 100
      )
    : 0

  // Get the sub-progress percentage for display
  const subProgressPercent = progress?.subProgress
    ? Math.round(progress.subProgress * 100)
    : 0

  return (
    <div
      className={cn(
        'absolute inset-0 bg-black/90 backdrop-blur-sm z-50',
        'flex items-center justify-center',
        'animate-in fade-in duration-200',
        'rounded-lg',
        className
      )}
    >
      <div className="w-full max-w-md mx-4">
        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 backdrop-blur-md rounded-lg border-2 border-red-500 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Processing Error
                </h3>
                <p className="text-red-200 text-sm">
                  {error}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'bg-red-600 hover:bg-red-700',
                'text-white font-medium',
                'transition-colors'
              )}
            >
              Close
            </button>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && !error && progress && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg border-2 border-white/20 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Loader2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1 animate-spin" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Processing Video
                </h3>
                <p className="text-gray-300 text-sm">
                  {progress.operation}
                  {progress.subProgress !== undefined && progress.subProgress > 0 && subProgressPercent > 0 && (
                    <span className="text-blue-300 ml-2">({subProgressPercent}%)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>
                  {progress.current >= progress.total
                    ? 'Saving...'
                    : `Operation ${progress.current + 1} of ${progress.total}`
                  }
                </span>
                {progressPercent > 0 && <span>{progressPercent}%</span>}
              </div>
              <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                  style={{ width: progressPercent > 0 ? `${progressPercent}%` : '0%' }}
                />
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'bg-white/10 hover:bg-white/20',
                'text-white font-medium',
                'transition-colors',
                'flex items-center justify-center gap-2'
              )}
            >
              <X className="w-5 h-5" />
              Cancel Processing
            </button>

            {/* Info Text */}
            <p className="text-xs text-center text-gray-400 mt-3">
              Processing happens in your browser. Do not close this tab.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
