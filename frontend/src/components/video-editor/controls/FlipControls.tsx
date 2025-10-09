'use client'

import { useState } from 'react'
import { FlipHorizontal, FlipVertical, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FlipOptions } from '@/lib/video-editor'

interface FlipControlsProps {
  onFlip: (options: FlipOptions) => void
  onRemove?: () => void
  hasQueued?: boolean
  disabled?: boolean
  className?: string
}

export function FlipControls({
  onFlip,
  onRemove,
  hasQueued = false,
  disabled = false,
  className
}: FlipControlsProps) {
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  const handleFlipHChange = () => {
    const newFlipH = !flipH
    setFlipH(newFlipH)
    // Auto-add to queue when flip changes (only if at least one flip is active)
    if (newFlipH || flipV) {
      setTimeout(() => onFlip({ horizontal: newFlipH, vertical: flipV }), 100)
    }
  }

  const handleFlipVChange = () => {
    const newFlipV = !flipV
    setFlipV(newFlipV)
    // Auto-add to queue when flip changes (only if at least one flip is active)
    if (flipH || newFlipV) {
      setTimeout(() => onFlip({ horizontal: flipH, vertical: newFlipV }), 100)
    }
  }

  const canApply = flipH || flipV

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">
            Flip Direction
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleFlipHChange}
              disabled={disabled}
              className={cn(
                'flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border-2 transition-all',
                flipH
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <FlipHorizontal className="w-4 h-4" />
              Horizontal
            </button>
            <button
              onClick={handleFlipVChange}
              disabled={disabled}
              className={cn(
                'flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border-2 transition-all',
                flipV
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <FlipVertical className="w-4 h-4" />
              Vertical
            </button>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Flip the video horizontally (mirror) or vertically. You can select both directions at once.
          </p>
        </div>
      </div>

      {hasQueued && onRemove && (
        <button
          onClick={onRemove}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
            'bg-red-600 hover:bg-red-700 text-white',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <X className="w-4 h-4" />
          <span>Remove from Queue</span>
        </button>
      )}

      {!canApply && (
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Select a flip direction to apply transformation
          </p>
        </div>
      )}
    </div>
  )
}
