'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ASPECT_RATIO_PRESETS, type AspectRatio } from '@/lib/video-editor'

interface CropControlsProps {
  onCrop: (aspectRatio: AspectRatio, mode: 'letterbox' | 'crop') => void
  disabled?: boolean
  className?: string
}

export function CropControls({
  onCrop,
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
    <div className={cn('space-y-3', className)}>
      <div>
        <label className="block text-sm mb-1.5">Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-1.5">
          {ASPECT_RATIO_PRESETS.map((ratio) => (
            <button
              key={ratio.label}
              onClick={() => handleAspectRatioChange(ratio)}
              disabled={disabled}
              className={cn(
                'px-3 py-2 text-sm rounded',
                selectedAspectRatio.label === ratio.label ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1.5">Mode</label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => handleModeChange('letterbox')}
            disabled={disabled}
            className={cn(
              'px-3 py-2 text-sm rounded',
              mode === 'letterbox' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            Letterbox
          </button>
          <button
            onClick={() => handleModeChange('crop')}
            disabled={disabled}
            className={cn(
              'px-3 py-2 text-sm rounded',
              mode === 'crop' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  )
}
