'use client'

import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VolumeControlsProps {
  onApplyVolume: (volume: number) => void
  disabled?: boolean
  className?: string
}

export function VolumeControls({
  onApplyVolume,
  disabled = false,
  className
}: VolumeControlsProps) {
  const [volume, setVolume] = useState(1.0)

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    // Always notify parent of volume changes (parent handles removal when volume is 1.0)
    setTimeout(() => onApplyVolume(newVolume), 100) // Small delay to batch rapid changes
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
    <div className={cn('space-y-3', className)}>
      <div>
        <label className="block text-sm mb-1.5">
          Volume: {Math.round(volume * 100)}% <span className="text-xs opacity-70">({getVolumeLabel()})</span>
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full h-2 cursor-pointer"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {volumePresets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handleVolumeChange(preset.value)}
            disabled={disabled}
            className={cn(
              'px-2 py-1.5 text-xs rounded bg-gray-700 hover:bg-gray-600',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
