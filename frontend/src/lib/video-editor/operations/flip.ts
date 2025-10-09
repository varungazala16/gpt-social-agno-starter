/**
 * Flip operation - Flip video horizontally or vertically
 */

import { fetchFile } from '@ffmpeg/util'
import type { FlipOptions, ProcessingResult } from '../core/types'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

export async function flipVideo(
  ffmpeg: FFmpeg,
  videoSrc: string,
  options: FlipOptions
): Promise<ProcessingResult> {
  const { horizontal, vertical } = options

  if (!horizontal && !vertical) {
    throw new Error('At least one flip direction must be specified')
  }

  // Build filter string
  const filters: string[] = []
  if (horizontal) filters.push('hflip')
  if (vertical) filters.push('vflip')
  const filterString = filters.join(',')

  try {
    // Fetch and write input video
    const videoData = await fetchFile(videoSrc)
    await ffmpeg.writeFile('input.mp4', videoData)

    // Execute flip
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

    throw new Error(`Flip operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
