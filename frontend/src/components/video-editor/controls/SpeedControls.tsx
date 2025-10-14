'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SpeedControlsProps {
  onApplySpeed: (speed: number) => void
  disabled?: boolean
  className?: string
}

export function SpeedControls({
  onApplySpeed,
  disabled = false,
  className
}: SpeedControlsProps) {
  const [speed, setSpeed] = useState(1.0)

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    // Always notify parent of speed changes (parent handles removal when speed is 1.0)
    setTimeout(() => onApplySpeed(newSpeed), 100) // Small delay to batch rapid changes
  }

  const speedPresets = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2.0, label: '2x' },
  ]

  const getSpeedLabel = () => {
    if (speed < 1) return 'Slow Motion'
    if (speed > 1) return 'Fast Forward'
    return 'Normal Speed'
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <label className="block text-sm mb-1.5">
          Speed: {speed.toFixed(2)}x <span className="text-xs opacity-70">({getSpeedLabel()})</span>
        </label>
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.05"
          value={speed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          className="w-full h-2 cursor-pointer"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {speedPresets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handleSpeedChange(preset.value)}
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
