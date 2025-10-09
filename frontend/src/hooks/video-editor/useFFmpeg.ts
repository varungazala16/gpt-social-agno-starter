/**
 * useFFmpeg hook - Manages FFmpeg lifecycle and loading
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getFFmpegManager } from '@/lib/video-editor'
import type { ProcessingProgress } from '@/lib/video-editor'

interface UseFFmpegOptions {
  autoLoad?: boolean
  onProgress?: (progress: ProcessingProgress) => void
  onLog?: (message: string) => void
}

export function useFFmpeg(options: UseFFmpegOptions = {}) {
  const { autoLoad = false, onProgress, onLog } = options
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProcessingProgress>({ progress: 0 })
  const managerRef = useRef(getFFmpegManager({
    onProgress: (prog) => {
      setProgress(prog)
      onProgress?.(prog)
    },
    onLog: (message) => {
      onLog?.(message)
    }
  }))

  const load = useCallback(async () => {
    if (isLoaded || isLoading) return

    try {
      setIsLoading(true)
      setError(null)
      await managerRef.current.load()
      setIsLoaded(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load FFmpeg'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [isLoaded, isLoading])

  const reset = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      await managerRef.current.reset()
      setIsLoaded(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset FFmpeg'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const terminate = useCallback(() => {
    managerRef.current.terminate()
    setIsLoaded(false)
    setProgress({ progress: 0 })
  }, [])

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad && !isLoaded && !isLoading) {
      load()
    }
  }, [autoLoad, isLoaded, isLoading, load])

  return {
    ffmpeg: managerRef.current,
    isLoaded,
    isLoading,
    error,
    progress,
    load,
    reset,
    terminate
  }
}
