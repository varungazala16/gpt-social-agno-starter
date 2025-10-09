'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FilterOptions } from '@/lib/video-editor'

interface FiltersControlsProps {
  onApplyFilters: (filters: FilterOptions) => void
  disabled?: boolean
  queueMode?: boolean
  className?: string
}

export function FiltersControls({
  onApplyFilters,
  disabled = false,
  queueMode = false,
  className
}: FiltersControlsProps) {
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(1)
  const [blur, setBlur] = useState(0)

  const hasChanges = brightness !== 0 || contrast !== 0 || saturation !== 1 || blur !== 0

  const handleReset = () => {
    setBrightness(0)
    setContrast(0)
    setSaturation(1)
    setBlur(0)
  }

  const handleApply = () => {
    onApplyFilters({ brightness, contrast, saturation, blur })
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Brightness: {brightness > 0 ? '+' : ''}{Math.round(brightness * 100)}%
          </label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Dark</span>
            <span>Normal</span>
            <span>Bright</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Contrast: {contrast > 0 ? '+' : ''}{Math.round(contrast * 100)}%
          </label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={contrast}
            onChange={(e) => setContrast(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Low</span>
            <span>Normal</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Saturation: {Math.round(saturation * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={saturation}
            onChange={(e) => setSaturation(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Grayscale</span>
            <span>Normal</span>
            <span>Vivid</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Blur: {blur}
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={blur}
            onChange={(e) => setBlur(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>None</span>
            <span>Heavy</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleReset}
          disabled={disabled || !hasChanges}
          className={cn(
            'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
            'bg-gray-600 hover:bg-gray-700 text-white',
            (disabled || !hasChanges) && 'opacity-50 cursor-not-allowed'
          )}
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          disabled={disabled || !hasChanges}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
            'bg-blue-600 hover:bg-blue-700 text-white',
            (disabled || !hasChanges) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>{queueMode ? 'Add to Queue' : 'Apply Filters'}</span>
        </button>
      </div>

      {!hasChanges && (
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Adjust any filter above to see changes
          </p>
        </div>
      )}
    </div>
  )
}
