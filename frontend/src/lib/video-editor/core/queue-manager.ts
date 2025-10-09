/**
 * Queue Manager - Manages operation queue and preview state
 */

import type { QueuedOperation, PreviewState } from './queue-types'

export class QueueManager {
  private operations: QueuedOperation[] = []
  private listeners: Set<() => void> = new Set()

  /**
   * Add operation to queue
   */
  addOperation(operation: Omit<QueuedOperation, 'id'>): QueuedOperation {
    const newOp: QueuedOperation = {
      ...operation,
      id: `${operation.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    this.operations.push(newOp)
    this.notifyListeners()
    return newOp
  }

  /**
   * Remove operation from queue
   */
  removeOperation(id: string): void {
    this.operations = this.operations.filter(op => op.id !== id)
    this.notifyListeners()
  }

  /**
   * Reorder operation in queue
   */
  reorderOperation(id: string, newIndex: number): void {
    const currentIndex = this.operations.findIndex(op => op.id === id)
    if (currentIndex === -1) return

    const [operation] = this.operations.splice(currentIndex, 1)
    this.operations.splice(newIndex, 0, operation)
    this.notifyListeners()
  }

  /**
   * Get all operations in queue
   */
  getOperations(): QueuedOperation[] {
    return [...this.operations]
  }

  /**
   * Get operation count
   */
  getCount(): number {
    return this.operations.length
  }

  /**
   * Clear all operations
   */
  clear(): void {
    this.operations = []
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

    for (const op of this.operations) {
      switch (op.type) {
        case 'rotate':
          state.rotation = (state.rotation + (op.options as { degrees: number }).degrees) % 360
          break

        case 'flip':
          const flipOpts = op.options as { horizontal: boolean; vertical: boolean }
          if (flipOpts.horizontal) state.flipH = !state.flipH
          if (flipOpts.vertical) state.flipV = !state.flipV
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
