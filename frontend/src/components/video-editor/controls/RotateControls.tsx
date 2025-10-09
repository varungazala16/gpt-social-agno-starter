'use client'

import { useState } from 'react'
import { RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RotateOptions, FlipOptions } from '@/lib/video-editor'

interface RotateControlsProps {
  onRotate: (options: RotateOptions) => void
  onFlip: (options: FlipOptions) => void
  disabled?: boolean
  queueMode?: boolean
  className?: string
}

export function RotateControls({
  onRotate,
  onFlip,
  disabled = false,
  queueMode = false,
  className
}: RotateControlsProps) {
  const [selectedRotation, setSelectedRotation] = useState<0 | 90 | 180 | 270>(90)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  const canApply = (selectedRotation !== 0) || flipH || flipV

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
                onClick={() => setSelectedRotation(degrees as 90 | 180 | 270)}
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

        <div>
          <label className="block text-sm font-medium mb-2">
            Flip
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFlipH(!flipH)}
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
              onClick={() => setFlipV(!flipV)}
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
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onRotate({ degrees: selectedRotation })}
          disabled={disabled || selectedRotation === 0}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
            'bg-blue-600 hover:bg-blue-700 text-white',
            (disabled || selectedRotation === 0) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RotateCw className="w-4 h-4" />
          <span>{queueMode ? 'Add to Queue' : `Rotate ${selectedRotation}°`}</span>
        </button>

        {(flipH || flipV) && (
          <button
            onClick={() => onFlip({ horizontal: flipH, vertical: flipV })}
            disabled={disabled}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
              'bg-blue-600 hover:bg-blue-700 text-white',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {flipH && <FlipHorizontal className="w-4 h-4" />}
            {flipV && <FlipVertical className="w-4 h-4" />}
            <span>{queueMode ? 'Add to Queue' : 'Flip'}</span>
          </button>
        )}
      </div>

      {!canApply && (
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Select a rotation angle or flip option to apply transformation
          </p>
        </div>
      )}
    </div>
  )
}
