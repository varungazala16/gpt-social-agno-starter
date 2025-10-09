/**
 * Trim operation - Cut video to specific time range
 */

import { fetchFile } from '@ffmpeg/util'
import type { TrimOptions, ProcessingResult } from '../core/types'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

export async function trimVideo(
  ffmpeg: FFmpeg,
  videoSrc: string,
  options: TrimOptions
): Promise<ProcessingResult> {
  const { startTime, endTime } = options

  if (startTime >= endTime) {
    throw new Error('Start time must be less than end time')
  }

  try {
    // Fetch and write input video
    const videoData = await fetchFile(videoSrc)
    await ffmpeg.writeFile('input.mp4', videoData)

    // Calculate duration
    const trimDuration = endTime - startTime

    // Execute trim command with transcoding for compatibility
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-ss', startTime.toString(),
      '-t', trimDuration.toString(),
      '-c:v', 'libx264',  // Video codec: H.264 for MP4 compatibility
      '-c:a', 'aac',      // Audio codec: AAC for MP4 compatibility
      '-preset', 'fast',   // Encoding speed/quality tradeoff
      '-crf', '23',        // Quality setting (lower = better quality)
      'output.mp4'
    ])

    // Read the output file
    const data = await ffmpeg.readFile('output.mp4')

    // Convert to proper Uint8Array for Blob
    const uint8Data = typeof data === 'string'
      ? new TextEncoder().encode(data)
      : new Uint8Array(data.slice())

    // Check if output is valid
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

    throw new Error(`Trim operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
