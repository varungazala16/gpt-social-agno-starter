/**
 * Queue types for batching video operations
 */

export interface QueuedOperation {
  id: string
  type: 'trim' | 'crop' | 'rotate' | 'flip' | 'speed' | 'volume' | 'filters'
  label: string
  options: unknown // Flexible type to accommodate various operation options
  appliedPreview?: boolean // Whether CSS/canvas preview is applied
}

export interface OperationQueue {
  operations: Record<string, QueuedOperation> // Map of operation type to operation
  previewEnabled: boolean
}

export interface PreviewState {
  // Trim state (handled via video element playback)
  trimStart?: number
  trimEnd?: number
  // Speed state (handled via video playbackRate)
  speed?: number
  // Crop state (visual overlay preview)
  cropAspectRatio?: { width: number; height: number; label: string }
  cropMode?: 'letterbox' | 'crop'
  // CSS-based preview states
  rotation: number // 0, 90, 180, 270
  flipH: boolean
  flipV: boolean
  brightness: number // -1 to 1
  contrast: number // -1 to 1
  saturation: number // 0 to 3
  blur: number // 0 to 20
}

export interface BatchProcessingOptions {
  optimizeChaining?: boolean // Try to chain operations in single FFmpeg pass
  showProgress?: boolean // Show detailed progress for each operation
}
