'use client'

import { Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrimControlsProps {
  startTime: number
  endTime: number
  duration: number
  onStartTimeChange: (time: number) => void
  onEndTimeChange: (time: number) => void
  onTrim: () => void
  disabled?: boolean
  queueMode?: boolean
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
  disabled = false,
  queueMode = false,
  className
}: TrimControlsProps) {
  const isValid = startTime < endTime

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
            onChange={(e) => onStartTimeChange(parseFloat(e.target.value))}
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
            onChange={(e) => onEndTimeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Duration: {formatTime(endTime - startTime)}
        </p>
      </div>

      <button
        onClick={onTrim}
        disabled={disabled || !isValid}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
          'bg-blue-600 hover:bg-blue-700 text-white',
          (disabled || !isValid) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Scissors className="w-4 h-4" />
        <span>{queueMode ? 'Add to Queue' : 'Trim Video'}</span>
      </button>
    </div>
  )
}
