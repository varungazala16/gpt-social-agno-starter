/**
 * useVideoEditor hook - Main hook for video editor state and operations
 */

import { useState, useCallback, useRef } from 'react'
import { useFFmpeg } from './useFFmpeg'
import {
  trimVideo,
  changeAspectRatio,
  rotateVideo,
  flipVideo,
  adjustSpeed,
  adjustVolume,
  applyFilters
} from '@/lib/video-editor'
import type {
  VideoMetadata,
  TrimOptions,
  AspectRatio,
  RotateOptions,
  FlipOptions,
  SpeedOptions,
  VolumeOptions,
  FilterOptions,
  ProcessingResult
} from '@/lib/video-editor'

export interface UseVideoEditorOptions {
  videoSrc: string
  autoLoadFFmpeg?: boolean
  onProcessingComplete?: (result: ProcessingResult) => void
  onError?: (error: Error) => void
}

export function useVideoEditor(options: UseVideoEditorOptions) {
  const { videoSrc, autoLoadFFmpeg = true, onProcessingComplete, onError } = options

  const [metadata, setMetadata] = useState<VideoMetadata>({
    duration: 0,
    width: 0,
    height: 0
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingOperation, setProcessingOperation] = useState<string | null>(null)
  const [result, setResult] = useState<ProcessingResult | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  const {
    ffmpeg,
    isLoaded: ffmpegLoaded,
    isLoading: ffmpegLoading,
    error: ffmpegError,
    progress: ffmpegProgress,
    load: loadFFmpeg
  } = useFFmpeg({
    autoLoad: autoLoadFFmpeg
  })

  // Load video metadata
  const handleVideoMetadataLoaded = useCallback(() => {
    if (videoRef.current) {
      setMetadata({
        duration: videoRef.current.duration,
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      })
    }
  }, [])

  // Execute operation wrapper
  const executeOperation = useCallback(
    async (
      operationName: string,
      operation: () => Promise<ProcessingResult>
    ) => {
      if (!ffmpegLoaded) {
        const error = new Error('FFmpeg is not loaded yet')
        onError?.(error)
        throw error
      }

      try {
        setIsProcessing(true)
        setProcessingOperation(operationName)
        setResult(null)

        const operationResult = await operation()

        setResult(operationResult)
        onProcessingComplete?.(operationResult)

        return operationResult
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Operation failed')
        onError?.(error)
        throw error
      } finally {
        setIsProcessing(false)
        setProcessingOperation(null)
      }
    },
    [ffmpegLoaded, onProcessingComplete, onError]
  )

  // Trim operation
  const trim = useCallback(
    async (options: TrimOptions) => {
      return executeOperation('trim', () =>
        trimVideo(ffmpeg.getFFmpeg(), videoSrc, options)
      )
    },
    [executeOperation, ffmpeg, videoSrc]
  )

  // Crop/Aspect ratio operation
  const crop = useCallback(
    async (aspectRatio: AspectRatio, mode: 'letterbox' | 'crop' = 'letterbox') => {
      return executeOperation('crop', () =>
        changeAspectRatio(ffmpeg.getFFmpeg(), videoSrc, aspectRatio, metadata, mode)
      )
    },
    [executeOperation, ffmpeg, videoSrc, metadata]
  )

  // Rotate operation
  const rotate = useCallback(
    async (options: RotateOptions) => {
      return executeOperation('rotate', () =>
        rotateVideo(ffmpeg.getFFmpeg(), videoSrc, options)
      )
    },
    [executeOperation, ffmpeg, videoSrc]
  )

  // Flip operation
  const flip = useCallback(
    async (options: FlipOptions) => {
      return executeOperation('flip', () =>
        flipVideo(ffmpeg.getFFmpeg(), videoSrc, options)
      )
    },
    [executeOperation, ffmpeg, videoSrc]
  )

  // Speed operation
  const speed = useCallback(
    async (options: SpeedOptions) => {
      return executeOperation('speed', () =>
        adjustSpeed(ffmpeg.getFFmpeg(), videoSrc, options)
      )
    },
    [executeOperation, ffmpeg, videoSrc]
  )

  // Volume operation
  const volume = useCallback(
    async (options: VolumeOptions) => {
      return executeOperation('volume', () =>
        adjustVolume(ffmpeg.getFFmpeg(), videoSrc, options)
      )
    },
    [executeOperation, ffmpeg, videoSrc]
  )

  // Filters operation
  const filters = useCallback(
    async (options: FilterOptions) => {
      return executeOperation('filters', () =>
        applyFilters(ffmpeg.getFFmpeg(), videoSrc, options)
      )
    },
    [executeOperation, ffmpeg, videoSrc]
  )

  return {
    // Video ref
    videoRef,

    // Metadata
    metadata,
    onVideoMetadataLoaded: handleVideoMetadataLoaded,

    // FFmpeg state
    ffmpegLoaded,
    ffmpegLoading,
    ffmpegError,
    ffmpegProgress,
    loadFFmpeg,

    // Processing state
    isProcessing,
    processingOperation,
    result,

    // Operations
    trim,
    crop,
    rotate,
    flip,
    speed,
    volume,
    filters
  }
}
