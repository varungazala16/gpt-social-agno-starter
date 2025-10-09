'use client'

import { useState } from 'react'
import { Crop, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ASPECT_RATIO_PRESETS, type AspectRatio } from '@/lib/video-editor'

interface CropControlsProps {
  onCrop: (aspectRatio: AspectRatio, mode: 'letterbox' | 'crop') => void
  onRemove?: () => void
  hasQueued?: boolean
  disabled?: boolean
  className?: string
}

export function CropControls({
  onCrop,
  onRemove,
  hasQueued = false,
  disabled = false,
  className
}: CropControlsProps) {
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(
    ASPECT_RATIO_PRESETS[0]
  )
  const [mode, setMode] = useState<'letterbox' | 'crop'>('letterbox')

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setSelectedAspectRatio(ratio)
    // Auto-add to queue when aspect ratio changes
    setTimeout(() => onCrop(ratio, mode), 100) // Small delay to batch rapid changes
  }

  const handleModeChange = (newMode: 'letterbox' | 'crop') => {
    setMode(newMode)
    // Auto-add to queue when mode changes
    setTimeout(() => onCrop(selectedAspectRatio, newMode), 100) // Small delay to batch rapid changes
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ASPECT_RATIO_PRESETS.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => handleAspectRatioChange(ratio)}
                disabled={disabled}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                  selectedAspectRatio.label === ratio.label
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fit Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleModeChange('letterbox')}
              disabled={disabled}
              className={cn(
                'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                mode === 'letterbox'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              Letterbox
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add black bars
              </span>
            </button>
            <button
              onClick={() => handleModeChange('crop')}
              disabled={disabled}
              className={cn(
                'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                mode === 'crop'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              Crop
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                Fill to fit
              </span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            {mode === 'letterbox'
              ? 'Letterbox mode adds black bars to maintain the selected aspect ratio without cropping.'
              : 'Crop mode fills the selected aspect ratio by cropping parts of the video.'}
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
    </div>
  )
}
