'use client'

import { useState } from 'react'
import { Volume2, VolumeX, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VolumeControlsProps {
  onApplyVolume: (volume: number) => void
  onRemove?: () => void
  hasQueued?: boolean
  disabled?: boolean
  className?: string
}

export function VolumeControls({
  onApplyVolume,
  onRemove,
  hasQueued = false,
  disabled = false,
  className
}: VolumeControlsProps) {
  const [volume, setVolume] = useState(1.0)

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    // Auto-add to queue when volume changes
    if (newVolume !== 1.0) {
      setTimeout(() => onApplyVolume(newVolume), 100) // Small delay to batch rapid changes
    }
  }

  const volumePresets = [
    { value: 0, label: 'Mute' },
    { value: 0.5, label: '50%' },
    { value: 1.0, label: '100%' },
    { value: 1.5, label: '150%' },
    { value: 2.0, label: '200%' },
  ]

  const getVolumeLabel = () => {
    if (volume === 0) return 'Muted'
    if (volume < 1) return 'Reduced'
    if (volume > 1) return 'Amplified'
    return 'Original'
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">
            Volume: {Math.round(volume * 100)}%
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              ({getVolumeLabel()})
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0%</span>
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-5 gap-2">
            {volumePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleVolumeChange(preset.value)}
                disabled={disabled}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                  volume === preset.value
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Adjust audio volume. Set to 0% to mute completely. Values above 100% may cause distortion.
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
