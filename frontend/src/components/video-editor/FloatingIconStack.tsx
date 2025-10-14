'use client'

import { cn } from '@/lib/utils'
import { Edit, Check, Loader2, Scissors, Crop, RotateCw, FlipHorizontal, Gauge, Volume2, Sparkles } from 'lucide-react'
import type { QueuedOperation } from '@/lib/video-editor/core/queue-types'

interface FloatingIconStackProps {
  operations: QueuedOperation[]
  onOpenEditor: () => void
  onOpenEffect: (type: string) => void
  onApply: () => void
  isProcessing: boolean
  className?: string
}

// Map operation types to their icons
const getOperationIcon = (type: string) => {
  const iconMap: Record<string, React.ElementType> = {
    trim: Scissors,
    crop: Crop,
    rotate: RotateCw,
    flip: FlipHorizontal,
    speed: Gauge,
    volume: Volume2,
    filters: Sparkles,
  }
  return iconMap[type] || Edit
}

export function FloatingIconStack({
  operations,
  onOpenEditor,
  onOpenEffect,
  onApply,
  isProcessing,
  className
}: FloatingIconStackProps) {
  const hasOperations = operations.length > 0
  const canApply = hasOperations && !isProcessing

  return (
    <div
      className={cn(
        'absolute top-4 right-4 z-20 flex flex-col gap-2',
        className
      )}
    >
      {/* Editor Icon - Opens effect selection */}
      <button
        onClick={onOpenEditor}
        disabled={isProcessing}
        className={cn(
          'w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg',
          'flex items-center justify-center',
          'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          'border-2 border-gray-200 dark:border-gray-600',
          isProcessing && 'opacity-50 cursor-not-allowed'
        )}
        title="Add Effect"
      >
        <Edit className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Effect Icons - One for each queued operation */}
      {operations.map((operation) => {
        const Icon = getOperationIcon(operation.type)
        return (
          <button
            key={operation.id}
            onClick={() => onOpenEffect(operation.type)}
            disabled={isProcessing}
            className={cn(
              'w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 shadow-lg',
              'flex items-center justify-center',
              'hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors',
              'border-2 border-blue-300 dark:border-blue-400',
              isProcessing && 'opacity-50 cursor-not-allowed'
            )}
            title={operation.label}
          >
            <Icon className="w-5 h-5 text-white" />
          </button>
        )
      })}

      {/* Apply Button - Only visible when operations exist */}
      {hasOperations && (
        <button
          onClick={onApply}
          disabled={!canApply}
          className={cn(
            'w-12 h-12 rounded-full bg-green-500 shadow-lg',
            'flex items-center justify-center',
            'hover:bg-green-600 transition-colors',
            'border-2 border-green-300',
            !canApply && 'opacity-50 cursor-not-allowed'
          )}
          title="Apply All Effects"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Check className="w-5 h-5 text-white" />
          )}
        </button>
      )}
    </div>
  )
}
