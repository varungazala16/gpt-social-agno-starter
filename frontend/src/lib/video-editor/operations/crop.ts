/**
 * Crop operation - Crop video to specific dimensions or aspect ratio
 */

import { fetchFile } from '@ffmpeg/util'
import type { CropOptions, AspectRatio, ProcessingResult, VideoMetadata } from '../core/types'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

/**
 * Crop video to specific dimensions
 */
export async function cropVideo(
  ffmpeg: FFmpeg,
  videoSrc: string,
  options: CropOptions
): Promise<ProcessingResult> {
  const { x, y, width, height } = options

  if (width <= 0 || height <= 0) {
    throw new Error('Width and height must be positive')
  }

  try {
    // Fetch and write input video
    const videoData = await fetchFile(videoSrc)
    await ffmpeg.writeFile('input.mp4', videoData)

    // Execute crop command
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-filter:v', `crop=${width}:${height}:${x}:${y}`,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-preset', 'fast',
      '-crf', '23',
      'output.mp4'
    ])

    // Read output
    const data = await ffmpeg.readFile('output.mp4')
    const uint8Data = typeof data === 'string'
      ? new TextEncoder().encode(data)
      : new Uint8Array(data.slice())

    if (uint8Data.length === 0) {
      throw new Error('FFmpeg produced an empty output file')
    }

    const blob = new Blob([uint8Data], { type: 'video/mp4' })

    // Cleanup
    await ffmpeg.deleteFile('input.mp4')
    await ffmpeg.deleteFile('output.mp4')

    return { blob, format: 'mp4' }
  } catch (error) {
    // Cleanup on error
    try {
      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output.mp4')
    } catch {
      // Ignore cleanup errors
    }

    throw new Error(`Crop operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Change video aspect ratio (will add black bars or crop to fit)
 */
export async function changeAspectRatio(
  ffmpeg: FFmpeg,
  videoSrc: string,
  aspectRatio: AspectRatio,
  metadata: VideoMetadata,
  mode: 'letterbox' | 'crop' = 'letterbox'
): Promise<ProcessingResult> {
  // Validate metadata
  if (!metadata.width || !metadata.height) {
    throw new Error('Video metadata not available. Please wait for the video to load.')
  }

  const targetAspect = aspectRatio.width / aspectRatio.height
  const currentAspect = metadata.width / metadata.height

  try {
    // Fetch and write input video
    const videoData = await fetchFile(videoSrc)
    await ffmpeg.writeFile('input.mp4', videoData)

    let filterComplex: string

    if (mode === 'letterbox') {
      // Add black bars to maintain aspect ratio
      // Calculate the new dimensions that fit the target aspect ratio
      let newWidth: number
      let newHeight: number

      if (currentAspect > targetAspect) {
        // Video is wider than target, scale down width
        newWidth = Math.round(metadata.height * targetAspect)
        newHeight = metadata.height
      } else {
        // Video is taller than target, scale down height
        newWidth = metadata.width
        newHeight = Math.round(metadata.width / targetAspect)
      }

      // Ensure dimensions are even numbers (required by libx264)
      newWidth = Math.round(newWidth / 2) * 2
      newHeight = Math.round(newHeight / 2) * 2

      // Scale to fit, then pad to fill
      filterComplex = `scale=${newWidth}:${newHeight}:force_original_aspect_ratio=decrease,pad=${newWidth}:${newHeight}:(ow-iw)/2:(oh-ih)/2`
    } else {
      // Crop to fit aspect ratio
      let cropWidth: number
      let cropHeight: number

      if (currentAspect > targetAspect) {
        // Video is wider, crop sides
        cropWidth = Math.round(metadata.height * targetAspect)
        cropHeight = metadata.height
      } else {
        // Video is taller, crop top/bottom
        cropWidth = metadata.width
        cropHeight = Math.round(metadata.width / targetAspect)
      }

      // Ensure dimensions are even numbers
      cropWidth = Math.round(cropWidth / 2) * 2
      cropHeight = Math.round(cropHeight / 2) * 2

      // Crop from center
      filterComplex = `crop=${cropWidth}:${cropHeight}:(iw-${cropWidth})/2:(ih-${cropHeight})/2`
    }

    // Execute aspect ratio change
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-filter:v', filterComplex,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-preset', 'fast',
      '-crf', '23',
      'output.mp4'
    ])

    // Read output
    const data = await ffmpeg.readFile('output.mp4')
    const uint8Data = typeof data === 'string'
      ? new TextEncoder().encode(data)
      : new Uint8Array(data.slice())

    if (uint8Data.length === 0) {
      throw new Error('FFmpeg produced an empty output file')
    }

    const blob = new Blob([uint8Data], { type: 'video/mp4' })

    // Cleanup
    await ffmpeg.deleteFile('input.mp4')
    await ffmpeg.deleteFile('output.mp4')

    return { blob, format: 'mp4' }
  } catch (error) {
    // Cleanup on error
    try {
      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output.mp4')
    } catch {
      // Ignore cleanup errors
    }

    throw new Error(`Aspect ratio change failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
