/**
 * Speed operation - Adjust video playback speed
 */

import { fetchFile } from '@ffmpeg/util'
import type { SpeedOptions, ProcessingResult } from '../core/types'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

export async function adjustSpeed(
  ffmpeg: FFmpeg,
  videoSrc: string,
  options: SpeedOptions
): Promise<ProcessingResult> {
  const { speed } = options

  if (speed <= 0) {
    throw new Error('Speed must be greater than 0')
  }

  if (speed < 0.25 || speed > 4.0) {
    throw new Error('Speed must be between 0.25 and 4.0')
  }

  try {
    // Fetch and write input video
    const videoData = await fetchFile(videoSrc)
    await ffmpeg.writeFile('input.mp4', videoData)

    // Calculate video and audio speed
    // For video: setpts adjusts presentation timestamps
    // For audio: atempo adjusts tempo (can only go 0.5x to 2x per filter)
    const videoFilter = `setpts=${(1 / speed).toFixed(4)}*PTS`

    // Audio tempo needs special handling as atempo only supports 0.5-2.0 range
    // For speeds outside this, chain multiple atempo filters
    let audioFilter = ''
    let remainingSpeed = speed
    const atempoFilters: string[] = []

    while (remainingSpeed > 2.0) {
      atempoFilters.push('atempo=2.0')
      remainingSpeed /= 2.0
    }
    while (remainingSpeed < 0.5) {
      atempoFilters.push('atempo=0.5')
      remainingSpeed /= 0.5
    }
    if (remainingSpeed !== 1.0) {
      atempoFilters.push(`atempo=${remainingSpeed.toFixed(4)}`)
    }

    audioFilter = atempoFilters.join(',')

    // Execute speed adjustment
    // Handle videos with or without audio
    const args = [
      '-i', 'input.mp4',
      '-filter:v', videoFilter,
    ]

    // Only apply audio filter if we have audio processing
    if (audioFilter) {
      args.push('-filter:a', audioFilter, '-c:a', 'aac')
    } else {
      // Copy audio stream if present, or ignore if not
      args.push('-c:a', 'copy')
    }

    args.push(
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      'output.mp4'
    )

    await ffmpeg.exec(args)

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

    throw new Error(`Speed adjustment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
