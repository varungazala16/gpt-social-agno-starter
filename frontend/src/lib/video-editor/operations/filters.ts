/**
 * Filters operation - Apply visual filters to video
 */

import { fetchFile } from '@ffmpeg/util'
import type { FilterOptions, ProcessingResult } from '../core/types'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

export async function applyFilters(
  ffmpeg: FFmpeg,
  videoSrc: string,
  options: FilterOptions
): Promise<ProcessingResult> {
  const { brightness = 0, contrast = 0, saturation = 1, blur = 0 } = options

  // Validate ranges
  if (brightness < -1 || brightness > 1) {
    throw new Error('Brightness must be between -1 and 1')
  }
  if (contrast < -1 || contrast > 1) {
    throw new Error('Contrast must be between -1 and 1')
  }
  if (saturation < 0 || saturation > 3) {
    throw new Error('Saturation must be between 0 and 3')
  }
  if (blur < 0 || blur > 20) {
    throw new Error('Blur must be between 0 and 20')
  }

  // Build filter chain
  const filters: string[] = []

  // Combine brightness, contrast, and saturation into single eq filter
  const hasEqFilters = brightness !== 0 || contrast !== 0 || saturation !== 1
  if (hasEqFilters) {
    // Convert -1 to 1 range to FFmpeg's expected range
    // brightness: -1 to 1 maps to -1 to 1
    // contrast: -1 to 1 maps to 0 to 2 (1 is original)
    const ffmpegBrightness = brightness
    const ffmpegContrast = 1 + contrast // 0 to 2

    // Build eq filter with all parameters
    const eqParams: string[] = []
    if (brightness !== 0) eqParams.push(`brightness=${ffmpegBrightness}`)
    if (contrast !== 0) eqParams.push(`contrast=${ffmpegContrast}`)
    if (saturation !== 1) eqParams.push(`saturation=${saturation}`)

    filters.push(`eq=${eqParams.join(':')}`)
  }

  // Blur (using boxblur)
  if (blur > 0) {
    // boxblur uses radius, convert our 0-20 to radius
    const radius = Math.max(1, Math.floor(blur / 2))
    filters.push(`boxblur=${radius}:${radius}`)
  }

  if (filters.length === 0) {
    throw new Error('No filters specified. Please adjust at least one filter.')
  }

  const filterString = filters.join(',')

  try {
    // Fetch and write input video
    const videoData = await fetchFile(videoSrc)
    await ffmpeg.writeFile('input.mp4', videoData)

    // Execute filter
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-filter:v', filterString,
      '-c:v', 'libx264',
      '-c:a', 'copy', // Copy audio without re-encoding
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

    throw new Error(`Filter operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
