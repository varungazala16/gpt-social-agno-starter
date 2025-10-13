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

interface Effect {
  type: EffectType
  label: string
  icon: React.ElementType
  description: string
}

const allEffects: Effect[] = [
  {
    type: 'trim',
    label: 'Trim',
    icon: Scissors,
    description: 'Cut video to specific duration'
  },
  {
    type: 'crop',
    label: 'Crop',
    icon: Crop,
    description: 'Change aspect ratio'
  },
  {
    type: 'rotate',
    label: 'Rotate',
    icon: RotateCw,
    description: 'Rotate video 90°, 180°, or 270°'
  },
  {
    type: 'flip',
    label: 'Flip',
    icon: FlipHorizontal,
    description: 'Flip horizontally or vertically'
  },
  {
    type: 'speed',
    label: 'Speed',
    icon: Gauge,
    description: 'Adjust playback speed'
  },
  {
    type: 'volume',
    label: 'Volume',
    icon: Volume2,
    description: 'Adjust audio volume'
  },
  {
    type: 'filters',
    label: 'Filters',
    icon: Sparkles,
    description: 'Apply visual filters'
  }
]

interface EffectSelectionOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSelectEffect: (type: EffectType) => void
  appliedEffects: string[]
  className?: string
}

export function EffectSelectionOverlay({
  isOpen,
  onClose,
  onSelectEffect,
  appliedEffects,
  className
}: EffectSelectionOverlayProps) {
  if (!isOpen) return null

  // Filter out effects that are already applied
  const availableEffects = allEffects.filter(
    (effect) => !appliedEffects.includes(effect.type)
  )

  return (
    <div
      className={cn(
        'absolute inset-0 bg-black/70 backdrop-blur-sm z-30',
        'animate-in fade-in duration-200',
        'rounded-lg',
        'flex items-center justify-center',
        className
      )}
      onClick={onClose}
    >
      {/* Title in center of overlay */}
      <div className="text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold text-white">
          Select an Effect to Add
        </h2>
      </div>

      {/* Vertical icon stack on the right side */}
      <div
        className={cn(
          'absolute top-4 right-4 z-40',
          'flex flex-col gap-2',
          'max-h-[calc(100%-2rem)]', // Leave 1rem margin on top and bottom
          'overflow-y-auto overflow-x-visible',
          // Custom scrollbar styling
          'scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            'w-12 h-12 rounded-full',
            'bg-red-500 hover:bg-red-600',
            'flex items-center justify-center',
            'transition-colors',
            'border-2 border-red-300',
            'shadow-lg'
          )}
          title="Close Effect Selection"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Vertical effect icons */}
        {availableEffects.map((effect) => {
          const Icon = effect.icon
          return (
            <button
              key={effect.type}
              onClick={() => {
                onSelectEffect(effect.type)
                onClose()
              }}
              className={cn(
                'w-12 h-12 rounded-full',
                'bg-white/10 hover:bg-white/20',
                'backdrop-blur-md',
                'flex items-center justify-center',
                'transition-colors',
                'border-2 border-white/20 hover:border-white/40',
                'shadow-lg'
              )}
              title={`${effect.label}: ${effect.description}`}
            >
              <Icon className="w-5 h-5 text-white" />
            </button>
          )
        })}

        {/* No effects available message */}
        {availableEffects.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-300 text-xs mb-1">
              All effects added!
            </p>
            <p className="text-gray-400 text-xs">
              Remove to add again
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
