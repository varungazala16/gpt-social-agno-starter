/**
 * Core types for video editing operations
 */

export interface VideoMetadata {
  duration: number
  width: number
  height: number
  frameRate?: number
}

export interface TrimOptions {
  startTime: number
  endTime: number
}

export interface CropOptions {
  x: number
  y: number
  width: number
  height: number
}

export interface AspectRatio {
  width: number
  height: number
  label: string
}

export interface RotateOptions {
  degrees: 0 | 90 | 180 | 270
}

export interface FlipOptions {
  horizontal: boolean
  vertical: boolean
}

export interface SpeedOptions {
  speed: number // 0.5 = half speed, 2.0 = double speed
}

export interface VolumeOptions {
  volume: number // 0.0 = mute, 1.0 = original, 2.0 = double volume
}

export interface FilterOptions {
  brightness?: number // -1.0 to 1.0, default 0
  contrast?: number // -1.0 to 1.0, default 0
  saturation?: number // 0.0 to 3.0, default 1.0
  blur?: number // 0 to 20, default 0
}

export interface VideoOperation {
  type: 'trim' | 'crop' | 'rotate' | 'flip' | 'speed' | 'volume' | 'filters'
  options: TrimOptions | CropOptions | RotateOptions | FlipOptions | SpeedOptions | VolumeOptions | FilterOptions
}

export interface ProcessingProgress {
  progress: number // 0 to 1
  message?: string
}

export interface ProcessingResult {
  blob: Blob
  format: 'mp4' | 'webm'
}

export interface FFmpegConfig {
  baseURL?: string
  onProgress?: (progress: ProcessingProgress) => void
  onLog?: (message: string) => void
}

export type ProgressCallback = (progress: ProcessingProgress) => void
export type LogCallback = (message: string) => void

// Common aspect ratio presets
export const ASPECT_RATIO_PRESETS: AspectRatio[] = [
  { width: 16, height: 9, label: '16:9 (Landscape)' },
  { width: 9, height: 16, label: '9:16 (Portrait)' },
  { width: 4, height: 3, label: '4:3 (Standard)' },
  { width: 1, height: 1, label: '1:1 (Square)' },
  { width: 21, height: 9, label: '21:9 (Ultrawide)' },
  { width: 4, height: 5, label: '4:5 (Instagram)' },
]
