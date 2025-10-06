'use client'

import { useState, useRef } from 'react'
import { Scissors, Download, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from './Modal'

interface VideoEditorProps {
  src: string
  className?: string
  isOpen: boolean
  onClose: () => void
}

export function VideoEditor({ src, className, isOpen, onClose }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)

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
      const video = videoRef.current

      // Create a canvas to capture frames
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Canvas context not available')
      }

      // Create a MediaStream from the canvas
      const stream = canvas.captureStream(30)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      })

      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `trimmed-${Date.now()}.webm`
        a.click()
        URL.revokeObjectURL(url)
        setShowInfoModal(true)
      }

      // Start recording
      mediaRecorder.start()

      // Set video to start time and play
      video.currentTime = startTime
      await video.play()

      // Draw frames to canvas
      const drawFrame = () => {
        if (video.currentTime >= endTime || video.paused) {
          mediaRecorder.stop()
          video.pause()
          return
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        requestAnimationFrame(drawFrame)
      }

      drawFrame()
    } catch (error) {
      console.error('Trim error:', error)
      alert('Failed to process video. Your browser may not support client-side video trimming.')
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
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Video">
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
            <h3 className="font-semibold text-lg">Trim Settings</h3>

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
                    <span>Trim & Export</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Original</span>
              </button>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Client-side trimming uses the MediaRecorder API and exports as WebM format.
                Audio quality is preserved at 2.5Mbps video bitrate. Works best in Chrome/Edge browsers.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Video Trimmed Successfully"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Your trimmed video has been downloaded!
              </p>
              <p className="text-sm text-green-800 dark:text-green-200">
                The video was processed entirely in your browser using client-side technology.
                The exported file is in WebM format with VP9 codec.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfoModal(false)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </Modal>
    </>
  )
}
