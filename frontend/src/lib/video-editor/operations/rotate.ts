/**
 * Rotate operation - Rotate video by 90, 180, or 270 degrees
 */

import { fetchFile } from '@ffmpeg/util'
import type { RotateOptions, ProcessingResult } from '../core/types'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

export async function rotateVideo(
  ffmpeg: FFmpeg,
  videoSrc: string,
  options: RotateOptions
): Promise<ProcessingResult> {
  const { degrees } = options

  // Validate degrees
  if (![0, 90, 180, 270].includes(degrees)) {
    throw new Error('Invalid rotation degrees. Must be 0, 90, 180, or 270')
  }

  // No rotation needed for 0 degrees
  if (degrees === 0) {
    throw new Error('No rotation needed. Please select 90°, 180°, or 270°')
  }

  // Map degrees to FFmpeg transpose values
  // 0 = 90° clockwise + vertical flip
  // 1 = 90° clockwise
  // 2 = 90° counter-clockwise
  // 3 = 90° counter-clockwise + vertical flip
  const transposeMap: Record<number, string> = {
    90: 'transpose=1',
    180: 'transpose=1,transpose=1',
    270: 'transpose=2',
  }

  const transposeFilter = transposeMap[degrees]!

  try {
    // Fetch and write input video
    const videoData = await fetchFile(videoSrc)
    await ffmpeg.writeFile('input.mp4', videoData)

    // Execute rotation
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-filter:v', transposeFilter,
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

    throw new Error(`Rotate operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
