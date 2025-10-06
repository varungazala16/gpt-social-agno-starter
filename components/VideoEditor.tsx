'use client'

import { useState, useRef } from 'react'
import { Scissors, Download, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoEditorProps {
  src: string
  className?: string
}

export function VideoEditor({ src, className }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration
      setDuration(dur)
      setEndTime(dur)
    }
  }

  const handleTrim = async () => {
    if (!videoRef.current) return

    setIsProcessing(true)

    try {
      // Note: This is a simplified version. For actual video trimming,
      // you would need a server-side solution using FFmpeg or similar
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('Canvas context not available')
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Create a simple preview by capturing the current frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95)
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `preview-${Date.now()}.jpg`
      a.click()
      URL.revokeObjectURL(url)

      alert('Note: Full video trimming requires server-side processing. This exported a preview frame.')
    } catch (error) {
      console.error('Trim error:', error)
      alert('Failed to process video')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = src
    a.download = `video-${Date.now()}.mp4`
    a.click()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          controls
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-lg">Edit Video</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">
              Start Time: {formatTime(startTime)}
            </label>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={startTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setStartTime(val)
                if (videoRef.current) videoRef.current.currentTime = val
              }}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              End Time: {formatTime(endTime)}
            </label>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={endTime}
              onChange={(e) => setEndTime(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Duration: {formatTime(endTime - startTime)}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleTrim}
            disabled={isProcessing || startTime >= endTime}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              'bg-blue-600 hover:bg-blue-700 text-white',
              (isProcessing || startTime >= endTime) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Trim Video</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Note: Advanced editing features like trimming require server-side processing with FFmpeg.
        </p>
      </div>
    </div>
  )
}
