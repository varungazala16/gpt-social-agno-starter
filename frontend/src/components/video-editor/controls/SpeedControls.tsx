'use client'

import { useState } from 'react'
import { Gauge } from 'lucide-react'
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
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">
            Playback Speed: {speed.toFixed(2)}x
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              ({getSpeedLabel()})
            </span>
          </label>
          <input
            type="range"
            min="0.25"
            max="4"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0.25x</span>
            <span>1x</span>
            <span>4x</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-4 gap-2">
            {speedPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setSpeed(preset.value)}
                disabled={disabled}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                  speed === preset.value
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
            Speed adjustment affects both video and audio. Values below 1x create slow motion, above 1x create fast forward.
          </p>
        </div>
      </div>

      <button
        onClick={() => onApplySpeed(speed)}
        disabled={disabled || speed === 1.0}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
          'bg-blue-600 hover:bg-blue-700 text-white',
          (disabled || speed === 1.0) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Gauge className="w-4 h-4" />
        <span>Apply Speed</span>
      </button>
    </div>
  )
}
