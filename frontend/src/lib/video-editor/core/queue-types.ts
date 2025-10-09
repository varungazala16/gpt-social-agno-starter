/**
 * Queue types for batching video operations
 */

import type {
  TrimOptions,
  CropOptions,
  AspectRatio,
  RotateOptions,
  FlipOptions,
  SpeedOptions,
  VolumeOptions,
  FilterOptions
} from './types'

export interface QueuedOperation {
  id: string
  type: 'trim' | 'crop' | 'rotate' | 'flip' | 'speed' | 'volume' | 'filters'
  label: string
  options: TrimOptions | CropOptions | RotateOptions | FlipOptions | SpeedOptions | VolumeOptions | FilterOptions
  appliedPreview?: boolean // Whether CSS/canvas preview is applied
}

export interface TrimQueuedOperation extends QueuedOperation {
  type: 'trim'
  options: TrimOptions
}

export interface CropQueuedOperation extends QueuedOperation {
  type: 'crop'
  options: AspectRatio & { mode: 'letterbox' | 'crop' }
}

export interface RotateQueuedOperation extends QueuedOperation {
  type: 'rotate'
  options: RotateOptions
}

export interface FlipQueuedOperation extends QueuedOperation {
  type: 'flip'
  options: FlipOptions
}

export interface SpeedQueuedOperation extends QueuedOperation {
  type: 'speed'
  options: SpeedOptions
}

export interface VolumeQueuedOperation extends QueuedOperation {
  type: 'volume'
  options: VolumeOptions
}

export interface FiltersQueuedOperation extends QueuedOperation {
  type: 'filters'
  options: FilterOptions
}

export type TypedQueuedOperation =
  | TrimQueuedOperation
  | CropQueuedOperation
  | RotateQueuedOperation
  | FlipQueuedOperation
  | SpeedQueuedOperation
  | VolumeQueuedOperation
  | FiltersQueuedOperation

export interface OperationQueue {
  operations: QueuedOperation[]
  previewEnabled: boolean
}

export interface PreviewState {
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
