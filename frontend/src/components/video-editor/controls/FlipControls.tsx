'use client'

import { useState } from 'react'
import { FlipHorizontal, FlipVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FlipOptions } from '@/lib/video-editor'

interface FlipControlsProps {
  onFlip: (options: FlipOptions) => void
  disabled?: boolean
  className?: string
}

export function FlipControls({
  onFlip,
  disabled = false,
  className
}: FlipControlsProps) {
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  const handleFlipHChange = () => {
    const newFlipH = !flipH
    setFlipH(newFlipH)
    // Always notify parent of flip changes (parent handles removal when both are false)
    setTimeout(() => onFlip({ horizontal: newFlipH, vertical: flipV }), 100)
  }

  const handleFlipVChange = () => {
    const newFlipV = !flipV
    setFlipV(newFlipV)
    // Always notify parent of flip changes (parent handles removal when both are false)
    setTimeout(() => onFlip({ horizontal: flipH, vertical: newFlipV }), 100)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleFlipHChange}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center gap-2 px-3 py-2.5 text-sm rounded',
            flipH ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <FlipHorizontal className="w-4 h-4" />
          Horizontal
        </button>
        <button
          onClick={handleFlipVChange}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center gap-2 px-3 py-2.5 text-sm rounded',
            flipV ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <FlipVertical className="w-4 h-4" />
          Vertical
        </button>
      </div>
    </div>
  )
}
