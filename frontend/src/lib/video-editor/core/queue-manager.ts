/**
 * Queue Manager - Manages operation queue and preview state
 */

import type { QueuedOperation, PreviewState } from './queue-types'

export class QueueManager {
  private operations: Record<string, QueuedOperation> = {}
  private listeners: Set<() => void> = new Set()

  /**
   * Add or update operation in queue (only one per type)
   */
  addOperation(operation: Omit<QueuedOperation, 'id'>): QueuedOperation {
    const newOp: QueuedOperation = {
      ...operation,
      id: `${operation.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    // Store by type - overwrites any existing operation of same type
    this.operations[operation.type] = newOp
    this.notifyListeners()
    return newOp
  }

  /**
   * Remove operation from queue by type
   */
  removeOperation(type: string): void {
    delete this.operations[type]
    this.notifyListeners()
  }

  /**
   * Get specific operation by type
   */
  getOperation(type: string): QueuedOperation | undefined {
    return this.operations[type]
  }

  /**
   * Get all operations as array
   */
  getOperations(): QueuedOperation[] {
    return Object.values(this.operations)
  }

  /**
   * Get operation count
   */
  getCount(): number {
    return Object.keys(this.operations).length
  }

  /**
   * Clear specific operation by type
   */
  clearOperation(type: string): void {
    delete this.operations[type]
    this.notifyListeners()
  }

  /**
   * Clear all operations
   */
  clear(): void {
    this.operations = {}
    this.notifyListeners()
  }

  /**
   * Calculate preview state from queued operations
   */
  calculatePreviewState(): PreviewState {
    const state: PreviewState = {
      rotation: 0,
      flipH: false,
      flipV: false,
      brightness: 0,
      contrast: 0,
      saturation: 1,
      blur: 0
    }

    // Iterate over operations map
    for (const op of Object.values(this.operations)) {
      switch (op.type) {
        case 'trim':
          const trimOpts = op.options as { startTime: number; endTime: number }
          state.trimStart = trimOpts.startTime
          state.trimEnd = trimOpts.endTime
          break

        case 'speed':
          const speedOpts = op.options as { speed: number }
          state.speed = speedOpts.speed
          break

        case 'crop':
          const cropOpts = op.options as { width: number; height: number; label: string; mode: 'letterbox' | 'crop' }
          state.cropAspectRatio = { width: cropOpts.width, height: cropOpts.height, label: cropOpts.label }
          state.cropMode = cropOpts.mode
          break

        case 'rotate':
          state.rotation = (op.options as { degrees: number }).degrees
          break

        case 'flip':
          const flipOpts = op.options as { horizontal: boolean; vertical: boolean }
          state.flipH = flipOpts.horizontal
          state.flipV = flipOpts.vertical
          break

        case 'filters':
          const filters = op.options as {
            brightness?: number
            contrast?: number
            saturation?: number
            blur?: number
          }
          if (filters.brightness !== undefined) state.brightness = filters.brightness
          if (filters.contrast !== undefined) state.contrast = filters.contrast
          if (filters.saturation !== undefined) state.saturation = filters.saturation
          if (filters.blur !== undefined) state.blur = filters.blur
          break
      }
    }

    return state
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }

  /**
   * Get human-readable label for operation
   */
  static getOperationLabel(operation: QueuedOperation): string {
    switch (operation.type) {
      case 'trim': {
        const opts = operation.options as { startTime: number; endTime: number }
        return `Trim: ${formatTime(opts.startTime)} → ${formatTime(opts.endTime)}`
      }
      case 'crop': {
        const opts = operation.options as { label: string; mode: string; width: number; height: number }
        return `Crop: ${opts.label} (${opts.mode})`
      }
      case 'rotate': {
        const opts = operation.options as { degrees: number }
        return `Rotate: ${opts.degrees}°`
      }
      case 'flip': {
        const opts = operation.options as { horizontal: boolean; vertical: boolean }
        const dirs: string[] = []
        if (opts.horizontal) dirs.push('Horizontal')
        if (opts.vertical) dirs.push('Vertical')
        return `Flip: ${dirs.join(' + ')}`
      }
      case 'speed': {
        const opts = operation.options as { speed: number }
        return `Speed: ${opts.speed}x`
      }
      case 'volume': {
        const opts = operation.options as { volume: number }
        return `Volume: ${Math.round(opts.volume * 100)}%`
      }
      case 'filters': {
        const opts = operation.options as { brightness?: number; contrast?: number; saturation?: number; blur?: number }
        const filters: string[] = []
        if (opts.brightness) filters.push(`Brightness ${opts.brightness > 0 ? '+' : ''}${Math.round(opts.brightness * 100)}%`)
        if (opts.contrast) filters.push(`Contrast ${opts.contrast > 0 ? '+' : ''}${Math.round(opts.contrast * 100)}%`)
        if (opts.saturation !== undefined && opts.saturation !== 1) filters.push(`Saturation ${Math.round(opts.saturation * 100)}%`)
        if (opts.blur) filters.push(`Blur ${opts.blur}`)
        return `Filters: ${filters.join(', ')}`
      }
      default:
        return 'Unknown operation'
    }
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
