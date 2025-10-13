'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { RotateOptions } from '@/lib/video-editor'

interface RotateControlsProps {
  onRotate: (options: RotateOptions) => void
  disabled?: boolean
  className?: string
}

export function RotateControls({
  onRotate,
  disabled = false,
  className
}: RotateControlsProps) {
  const [selectedRotation, setSelectedRotation] = useState<0 | 90 | 180 | 270>(0)

  const handleRotationChange = (degrees: 0 | 90 | 180 | 270) => {
    setSelectedRotation(degrees)
    // Auto-add to queue when rotation changes
    setTimeout(() => onRotate({ degrees }), 100) // Small delay to batch rapid changes
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-4 gap-2">
        {[0, 90, 180, 270].map((degrees) => (
          <button
            key={degrees}
            onClick={() => handleRotationChange(degrees as 0 | 90 | 180 | 270)}
            disabled={disabled}
            className={cn(
              'px-3 py-2.5 text-sm rounded',
              selectedRotation === degrees ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {degrees}°
          </button>
        ))}
      </div>
    </div>
  )
}
