'use client'

import { X, GripVertical, Play, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QueuedOperation } from '@/lib/video-editor/core/queue-types'
import { QueueManager } from '@/lib/video-editor/core/queue-manager'

interface QueuePanelProps {
  operations: QueuedOperation[]
  onRemove: (id: string) => void
  onReorder?: (id: string, newIndex: number) => void
  onClear: () => void
  onApplyAll: () => void
  isProcessing?: boolean
  className?: string
}

export function QueuePanel({
  operations,
  onRemove,
  onReorder,
  onClear,
  onApplyAll,
  isProcessing = false,
  className
}: QueuePanelProps) {
  if (operations.length === 0) {
    return (
      <div className={cn('p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800', className)}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No operations queued</p>
          <p className="text-xs mt-1">Add operations using the tabs above</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          Operation Queue ({operations.length})
        </h3>
        <button
          onClick={onClear}
          disabled={isProcessing}
          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
        >
          Clear All
        </button>
      </div>

      {/* Operations List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {operations.map((op, index) => (
          <div
            key={op.id}
            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg group"
          >
            {/* Drag Handle */}
            {onReorder && (
              <button
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isProcessing}
              >
                <GripVertical className="w-4 h-4" />
              </button>
            )}

            {/* Order Number */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-medium">
              {index + 1}
            </div>

            {/* Operation Label */}
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">
                {QueueManager.getOperationLabel(op)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(op.id)}
              disabled={isProcessing}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
              title="Remove operation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Apply All Button */}
      <button
        onClick={onApplyAll}
        disabled={isProcessing || operations.length === 0}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
          'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white',
          (isProcessing || operations.length === 0) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Play className="w-4 h-4" />
        <span>Apply All Operations ({operations.length})</span>
      </button>

      {/* Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Operations will be processed in order
      </p>
    </div>
  )
}
