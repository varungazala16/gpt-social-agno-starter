'use client'

import { cn } from '@/lib/utils'

interface TrimControlsProps {
  startTime: number
  endTime: number
  duration: number
  onStartTimeChange: (time: number) => void
  onEndTimeChange: (time: number) => void
  onTrim: () => void
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
  disabled = false,
  className
}: TrimControlsProps) {
  const handleStartTimeChange = (time: number) => {
    onStartTimeChange(time)
    // Always notify parent of trim changes (parent handles removal when trim is default)
    setTimeout(() => onTrim(), 100) // Small delay to batch rapid changes
  }

  const handleEndTimeChange = (time: number) => {
    onEndTimeChange(time)
    // Always notify parent of trim changes (parent handles removal when trim is default)
    setTimeout(() => onTrim(), 100) // Small delay to batch rapid changes
  }

  const isValid = startTime < endTime

  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <label className="block text-sm mb-1.5">
          Start: {formatTime(startTime)}
        </label>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={startTime}
          onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
          className="w-full h-2 cursor-pointer"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm mb-1.5">
          End: {formatTime(endTime)}
        </label>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={endTime}
          onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
          className="w-full h-2 cursor-pointer"
          disabled={disabled}
        />
      </div>

      <p className="text-sm opacity-70">
        Duration: {formatTime(endTime - startTime)}
      </p>
    </div>
  )
}
