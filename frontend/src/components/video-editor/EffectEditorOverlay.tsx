'use client'

import { X } from 'lucide-react'
import {
  Scissors,
  Crop,
  RotateCw,
  FlipHorizontal,
  Gauge,
  Volume2,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

type EffectType = 'trim' | 'crop' | 'rotate' | 'flip' | 'speed' | 'volume' | 'filters'

const effectIcons: Record<EffectType, React.ElementType> = {
  trim: Scissors,
  crop: Crop,
  rotate: RotateCw,
  flip: FlipHorizontal,
  speed: Gauge,
  volume: Volume2,
  filters: Sparkles
}

const effectLabels: Record<EffectType, string> = {
  trim: 'Trim',
  crop: 'Crop',
  rotate: 'Rotate',
  flip: 'Flip',
  speed: 'Speed',
  volume: 'Volume',
  filters: 'Filters'
}

interface EffectEditorOverlayProps {
  isOpen: boolean
  effectType: EffectType
  onClose: () => void
  onClear: () => void
  children: React.ReactNode
  className?: string
}

export function EffectEditorOverlay({
  isOpen,
  effectType,
  onClose,
  onClear,
  children,
  className
}: EffectEditorOverlayProps) {
  if (!isOpen) return null

  const Icon = effectIcons[effectType]
  const label = effectLabels[effectType]

  return (
    <div
      className={cn(
        'absolute inset-0 bg-black/70 backdrop-blur-sm z-30',
        'flex flex-col',
        'animate-in fade-in duration-200',
        'rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Effect Icon in top-right - click to close */}
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={onClose}
          className={cn(
            'w-12 h-12 rounded-full',
            'bg-blue-500 dark:bg-blue-600 shadow-lg',
            'flex items-center justify-center',
            'hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors',
            'border-2 border-blue-300 dark:border-blue-400'
          )}
          title={`Close ${label} Editor`}
        >
          <Icon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {label} Settings
            </h2>
            <p className="text-gray-300 text-sm">
              Adjust settings and add to queue
            </p>
          </div>

          {/* Controls Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Clear button in bottom-right */}
      <div className="absolute bottom-4 right-4 z-40">
        <button
          onClick={() => {
            onClear()
            onClose()
          }}
          className={cn(
            'w-12 h-12 rounded-full',
            'bg-red-500 hover:bg-red-600',
            'flex items-center justify-center',
            'transition-colors',
            'border-2 border-red-300',
            'shadow-lg'
          )}
          title="Clear Effect"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}
