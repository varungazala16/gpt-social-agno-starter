/**
 * Volume operation - Adjust audio volume
 */

import { fetchFile } from '@ffmpeg/util'
import type { VolumeOptions, ProcessingResult } from '../core/types'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

export async function adjustVolume(
  ffmpeg: FFmpeg,
  videoSrc: string,
  options: VolumeOptions
): Promise<ProcessingResult> {
  const { volume } = options

  if (volume < 0) {
    throw new Error('Volume cannot be negative')
  }

  if (volume > 5.0) {
    throw new Error('Volume too high. Maximum is 5.0 (500%)')
  }

  try {
    // Fetch and write input video
    const videoData = await fetchFile(videoSrc)
    await ffmpeg.writeFile('input.mp4', videoData)

    // Execute volume adjustment
    // volume=0 will mute, volume=1 is original, volume=2 is double
    // Note: This will fail if video has no audio track
    // We use -map to handle missing audio gracefully
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-filter:a', `volume=${volume}`,
      '-c:v', 'copy', // Copy video without re-encoding
      '-c:a', 'aac',
      '-map', '0:v', // Map video stream
      '-map', '0:a?', // Map audio stream if present (? makes it optional)
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

    throw new Error(`Volume adjustment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
