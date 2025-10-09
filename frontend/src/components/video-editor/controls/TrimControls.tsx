'use client'

import { Scissors, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrimControlsProps {
  startTime: number
  endTime: number
  duration: number
  onStartTimeChange: (time: number) => void
  onEndTimeChange: (time: number) => void
  onTrim: () => void
  onRemove?: () => void
  hasQueued?: boolean
  disabled?: boolean
  className?: string
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function TrimControls({
  startTime,
  endTime,
  duration,
  onStartTimeChange,
  onEndTimeChange,
  onTrim,
  onRemove,
  hasQueued = false,
  disabled = false,
  className
}: TrimControlsProps) {
  const isValid = startTime < endTime

  const handleStartTimeChange = (time: number) => {
    onStartTimeChange(time)
    // Auto-add to queue when slider changes
    if (isValid) {
      setTimeout(() => onTrim(), 100) // Small delay to batch rapid changes
    }
  }

  const handleEndTimeChange = (time: number) => {
    onEndTimeChange(time)
    // Auto-add to queue when slider changes
    if (isValid) {
      setTimeout(() => onTrim(), 100) // Small delay to batch rapid changes
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">
            Start Time: {formatTime(startTime)}
          </label>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={startTime}
            onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            End Time: {formatTime(endTime)}
          </label>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={endTime}
            onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Duration: {formatTime(endTime - startTime)}
        </p>
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
