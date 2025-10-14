'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FilterOptions } from '@/lib/video-editor'

interface FiltersControlsProps {
  onApplyFilters: (filters: FilterOptions) => void
  disabled?: boolean
  className?: string
}

export function FiltersControls({
  onApplyFilters,
  disabled = false,
  className
}: FiltersControlsProps) {
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(1)
  const [blur, setBlur] = useState(0)

  const applyFilters = (b: number, c: number, s: number, bl: number) => {
    // Always notify parent of filter changes (parent handles removal when all are default)
    setTimeout(() => onApplyFilters({ brightness: b, contrast: c, saturation: s, blur: bl }), 100)
  }

  const handleBrightnessChange = (value: number) => {
    setBrightness(value)
    applyFilters(value, contrast, saturation, blur)
  }

  const handleContrastChange = (value: number) => {
    setContrast(value)
    applyFilters(brightness, value, saturation, blur)
  }

  const handleSaturationChange = (value: number) => {
    setSaturation(value)
    applyFilters(brightness, contrast, value, blur)
  }

  const handleBlurChange = (value: number) => {
    setBlur(value)
    applyFilters(brightness, contrast, saturation, value)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <label className="block text-sm mb-1.5">
          Brightness: {brightness > 0 ? '+' : ''}{Math.round(brightness * 100)}%
        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.05"
          value={brightness}
          onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
          className="w-full h-2 cursor-pointer"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm mb-1.5">
          Contrast: {contrast > 0 ? '+' : ''}{Math.round(contrast * 100)}%
        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.05"
          value={contrast}
          onChange={(e) => handleContrastChange(parseFloat(e.target.value))}
          className="w-full h-2 cursor-pointer"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm mb-1.5">
          Saturation: {Math.round(saturation * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.05"
          value={saturation}
          onChange={(e) => handleSaturationChange(parseFloat(e.target.value))}
          className="w-full h-2 cursor-pointer"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm mb-1.5">
          Blur: {blur}
        </label>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={blur}
          onChange={(e) => handleBlurChange(parseFloat(e.target.value))}
          className="w-full h-2 cursor-pointer"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
