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
        'flex items-center justify-center',
        'animate-in fade-in duration-200',
        'rounded-lg overflow-hidden',
        className
      )}
      onClick={onClose}
    >
      {/* Close button in top-right */}
      <div className="absolute top-4 right-4 z-40">
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
      </div>

      <div
        className="w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Select an Effect to Add
          </h2>
          <p className="text-gray-300 text-sm">
            Choose from available effects below
          </p>
        </div>

        {/* Effect Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
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
                  'group relative',
                  'bg-white/10 hover:bg-white/20',
                  'backdrop-blur-md',
                  'rounded-lg p-6',
                  'flex flex-col items-center gap-3',
                  'transition-all duration-200',
                  'hover:scale-105 hover:shadow-xl',
                  'border-2 border-white/20 hover:border-white/40'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-white mb-1">
                    {effect.label}
                  </div>
                  <div className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {effect.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* No effects available message */}
        {availableEffects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-2">
              All effects have been added!
            </p>
            <p className="text-gray-400 text-sm">
              Remove effects from the queue to add them again
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
