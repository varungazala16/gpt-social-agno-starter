'use client'

import { useState } from 'react'
import { RotateCw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RotateOptions } from '@/lib/video-editor'

interface RotateControlsProps {
  onRotate: (options: RotateOptions) => void
  onRemove?: () => void
  hasQueued?: boolean
  disabled?: boolean
  className?: string
}

export function RotateControls({
  onRotate,
  onRemove,
  hasQueued = false,
  disabled = false,
  className
}: RotateControlsProps) {
  const [selectedRotation, setSelectedRotation] = useState<0 | 90 | 180 | 270>(90)

  const handleRotationChange = (degrees: 0 | 90 | 180 | 270) => {
    setSelectedRotation(degrees)
    // Auto-add to queue when rotation changes
    if (degrees !== 0) {
      setTimeout(() => onRotate({ degrees }), 100) // Small delay to batch rapid changes
    }
  }

  const canApply = selectedRotation !== 0

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">
            Rotation
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[90, 180, 270].map((degrees) => (
              <button
                key={degrees}
                onClick={() => handleRotationChange(degrees as 90 | 180 | 270)}
                disabled={disabled}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                  selectedRotation === degrees
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {degrees}°
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Rotate the video clockwise by 90°, 180°, or 270°.
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
            Select a rotation angle to apply transformation
          </p>
        </div>
      )}
    </div>
  )
}
