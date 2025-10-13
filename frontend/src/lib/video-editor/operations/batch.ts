/**
 * Batch processing - Apply multiple operations in sequence
 */

import {
  trimVideo,
  changeAspectRatio,
  rotateVideo,
  flipVideo,
  adjustSpeed,
  adjustVolume,
  applyFilters
} from '../operations'
import type { FFmpeg } from '@ffmpeg/ffmpeg'
import type { QueuedOperation, BatchProcessingOptions } from '../core/queue-types'
import type { ProcessingResult, VideoMetadata, AspectRatio } from '../core/types'

export interface BatchProgressCallback {
  (current: number, total: number, operation: string, subProgress?: number): void
}

export async function processBatch(
  ffmpeg: FFmpeg,
  videoSrc: string,
  operations: QueuedOperation[],
  metadata: VideoMetadata,
  onProgress?: BatchProgressCallback
): Promise<ProcessingResult> {
  if (operations.length === 0) {
    throw new Error('No operations to process')
  }

  let currentSrc = videoSrc
  let currentBlob: Blob | null = null
  let currentFormat: 'mp4' | 'webm' = 'mp4'
  const createdBlobUrls: string[] = [] // Track created URLs for cleanup

  // Process operations sequentially
  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i]
    const operationName = getOperationName(operation)

    // Report initial progress
    if (onProgress) {
      onProgress(i, operations.length, operationName, 0)
    }

    // Set up FFmpeg progress listener for this operation
    let progressHandler: ((event: { progress: number }) => void) | null = null
    if (onProgress) {
      progressHandler = ({ progress }: { progress: number }) => {
        onProgress(i, operations.length, operationName, progress)
      }
      ffmpeg.on('progress', progressHandler)
    }

    try {
      let result: ProcessingResult

      // Execute operation
      switch (operation.type) {
        case 'trim': {
          const opts = operation.options as { startTime: number; endTime: number }
          result = await trimVideo(ffmpeg, currentSrc, opts)
          break
        }

        case 'crop': {
          const opts = operation.options as AspectRatio & { mode: 'letterbox' | 'crop' }
          const aspectRatio: AspectRatio = {
            width: opts.width,
            height: opts.height,
            label: opts.label
          }
          result = await changeAspectRatio(ffmpeg, currentSrc, aspectRatio, metadata, opts.mode)
          break
        }

        case 'rotate': {
          const opts = operation.options as { degrees: 0 | 90 | 180 | 270 }
          result = await rotateVideo(ffmpeg, currentSrc, opts)
          break
        }

        case 'flip': {
          const opts = operation.options as { horizontal: boolean; vertical: boolean }
          result = await flipVideo(ffmpeg, currentSrc, opts)
          break
        }

        case 'speed': {
          const opts = operation.options as { speed: number }
          result = await adjustSpeed(ffmpeg, currentSrc, opts)
          break
        }

        case 'volume': {
          const opts = operation.options as { volume: number }
          result = await adjustVolume(ffmpeg, currentSrc, opts)
          break
        }

        case 'filters': {
          const opts = operation.options as {
            brightness?: number
            contrast?: number
            saturation?: number
            blur?: number
          }
          result = await applyFilters(ffmpeg, currentSrc, opts)
          break
        }

        default:
          throw new Error(`Unknown operation type: ${operation.type}`)
      }

      // Save result for next iteration
      currentBlob = result.blob
      currentFormat = result.format

      // Clean up FFmpeg progress listener
      if (progressHandler) {
        ffmpeg.off('progress', progressHandler)
      }

      // For next iteration, create a Blob URL instead of using FFmpeg's virtual filesystem
      if (i < operations.length - 1) {
        // Create a Blob URL that the next operation can fetch
        currentSrc = URL.createObjectURL(currentBlob)
        createdBlobUrls.push(currentSrc) // Track for cleanup
      }
    } catch (error) {
      // Clean up FFmpeg progress listener on error
      if (progressHandler) {
        ffmpeg.off('progress', progressHandler)
      }

      // Cleanup created Blob URLs on error
      for (const url of createdBlobUrls) {
        URL.revokeObjectURL(url)
      }
      throw new Error(`Failed at operation ${i + 1}/${operations.length} (${operationName}): ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Cleanup created Blob URLs
  for (const url of createdBlobUrls) {
    URL.revokeObjectURL(url)
  }

  if (!currentBlob) {
    throw new Error('No result produced from batch processing')
  }

  // Report completion
  if (onProgress) {
    onProgress(operations.length, operations.length, 'Complete')
  }

  return {
    blob: currentBlob,
    format: currentFormat
  }
}

function getOperationName(operation: QueuedOperation): string {
  switch (operation.type) {
    case 'trim':
      return 'Trimming'
    case 'crop':
      return 'Cropping'
    case 'rotate':
      return 'Rotating'
    case 'flip':
      return 'Flipping'
    case 'speed':
      return 'Adjusting speed'
    case 'volume':
      return 'Adjusting volume'
    case 'filters':
      return 'Applying filters'
    default:
      return 'Processing'
  }
}
