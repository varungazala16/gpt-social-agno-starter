/**
 * FFmpeg Manager - Handles FFmpeg initialization and lifecycle
 */

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import type { FFmpegConfig, ProgressCallback, LogCallback } from './types'

export class FFmpegManager {
  private static instance: FFmpegManager | null = null
  private ffmpeg: FFmpeg | null = null
  private loaded = false
  private loading = false
  private onProgressCallback?: ProgressCallback
  private onLogCallback?: LogCallback

  private constructor(config?: FFmpegConfig) {
    if (config?.onProgress) {
      this.onProgressCallback = config.onProgress
    }
    if (config?.onLog) {
      this.onLogCallback = config.onLog
    }
  }

  /**
   * Get singleton instance of FFmpegManager
   */
  static getInstance(config?: FFmpegConfig): FFmpegManager {
    if (!FFmpegManager.instance) {
      FFmpegManager.instance = new FFmpegManager(config)
    }
    return FFmpegManager.instance
  }

  /**
   * Load FFmpeg if not already loaded
   */
  async load(): Promise<void> {
    if (this.loaded) return
    if (this.loading) {
      // Wait for ongoing load
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.loaded) {
            clearInterval(checkInterval)
            resolve()
          } else if (!this.loading) {
            clearInterval(checkInterval)
            reject(new Error('FFmpeg loading failed'))
          }
        }, 100)
      })
    }

    try {
      this.loading = true
      this.ffmpeg = new FFmpeg()

      // Setup event listeners
      this.ffmpeg.on('log', ({ message }) => {
        if (this.onLogCallback) {
          this.onLogCallback(message)
        }
      })

      this.ffmpeg.on('progress', ({ progress }) => {
        if (this.onProgressCallback) {
          this.onProgressCallback({
            progress,
            message: `Processing: ${Math.round(progress * 100)}%`
          })
        }
      })

      // Load FFmpeg core
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })

      this.loaded = true
    } catch (error) {
      this.loading = false
      throw new Error(`Failed to load FFmpeg: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      this.loading = false
    }
  }

  /**
   * Get FFmpeg instance (must be loaded first)
   */
  getFFmpeg(): FFmpeg {
    if (!this.ffmpeg || !this.loaded) {
      throw new Error('FFmpeg not loaded. Call load() first.')
    }
    return this.ffmpeg
  }

  /**
   * Check if FFmpeg is loaded
   */
  isLoaded(): boolean {
    return this.loaded
  }

  /**
   * Check if FFmpeg is currently loading
   */
  isLoading(): boolean {
    return this.loading
  }

  /**
   * Set progress callback
   */
  setProgressCallback(callback: ProgressCallback): void {
    this.onProgressCallback = callback
  }

  /**
   * Set log callback
   */
  setLogCallback(callback: LogCallback): void {
    this.onLogCallback = callback
  }

  /**
   * Reset FFmpeg instance
   */
  async reset(): Promise<void> {
    this.ffmpeg = null
    this.loaded = false
    this.loading = false
    await this.load()
  }

  /**
   * Terminate FFmpeg instance
   */
  terminate(): void {
    if (this.ffmpeg) {
      this.ffmpeg.terminate()
      this.ffmpeg = null
      this.loaded = false
      this.loading = false
    }
  }
}

/**
 * Convenience function to get FFmpeg manager instance
 */
export function getFFmpegManager(config?: FFmpegConfig): FFmpegManager {
  return FFmpegManager.getInstance(config)
}
