'use client'

import { useState, useRef, useEffect } from 'react'
import { Scissors, Download, Loader2, AlertCircle, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from './Modal'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { uploadVideo } from '@/actions/video'

type TrimMethod = 'ffmpeg' | 'mediarecorder'

interface VideoEditorProps {
  src: string
  className?: string
  isOpen: boolean
  onClose: () => void
  onSaveComplete?: () => void
}

export function VideoEditor({ src, className, isOpen, onClose, onSaveComplete }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [trimMethod, setTrimMethod] = useState<TrimMethod>('ffmpeg')
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [trimmedVideoBlob, setTrimmedVideoBlob] = useState<Blob | null>(null)

  useEffect(() => {
    if (isOpen && trimMethod === 'ffmpeg' && !ffmpegLoaded && !loadingFFmpeg) {
      loadFFmpeg()
    }
  }, [isOpen, trimMethod, ffmpegLoaded, loadingFFmpeg])

  const loadFFmpeg = async () => {
    try {
      setLoadingFFmpeg(true)
      const ffmpeg = new FFmpeg()

      ffmpeg.on('log', ({ message }) => {
        console.log(message)
      })

      ffmpeg.on('progress', ({ progress }) => {
        setProcessingProgress(Math.round(progress * 100))
      })

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })

      ffmpegRef.current = ffmpeg
      setFfmpegLoaded(true)
    } catch (error) {
      console.error('Failed to load FFmpeg:', error)
      alert('Failed to load video processing library. Please refresh the page and try again.')
    } finally {
      setLoadingFFmpeg(false)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration
      setDuration(dur)
      setEndTime(dur)
    }
  }

  const trimWithFFmpeg = async () => {
    if (!ffmpegRef.current || !ffmpegLoaded) {
      alert('FFmpeg is not loaded yet. Please wait and try again.')
      return
    }

    try {
      const ffmpeg = ffmpegRef.current
      setProcessingProgress(0)

      // Fetch the video file
      const videoData = await fetchFile(src)
      await ffmpeg.writeFile('input.mp4', videoData)

      // Calculate duration
      const trimDuration = endTime - startTime

      // Run FFmpeg trim command
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', startTime.toString(),
        '-t', trimDuration.toString(),
        '-c', 'copy',
        'output.mp4'
      ])

      // Read the output file
      const data = await ffmpeg.readFile('output.mp4')
      // Convert to proper Uint8Array for Blob using slice to ensure proper ArrayBuffer
      const uint8Data = typeof data === 'string' 
        ? new TextEncoder().encode(data)
        : new Uint8Array(data.slice())
      const blob = new Blob([uint8Data], { type: 'video/mp4' })

      setTrimmedVideoBlob(blob)
      setShowInfoModal(true)

      // Cleanup
      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output.mp4')
    } catch (error) {
      console.error('FFmpeg trim error:', error)
      alert('Failed to trim video with FFmpeg. Please try again.')
    }
  }

  const trimWithMediaRecorder = async () => {
    if (!videoRef.current) return

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
        setTrimmedVideoBlob(blob)
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
      console.error('MediaRecorder trim error:', error)
      alert('Failed to process video. Your browser may not support client-side video trimming.')
    }
  }

  const handleTrim = async () => {
    setIsProcessing(true)
    try {
      if (trimMethod === 'ffmpeg') {
        await trimWithFFmpeg()
      } else {
        await trimWithMediaRecorder()
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadTrimmed = () => {
    if (!trimmedVideoBlob) return

    const url = URL.createObjectURL(trimmedVideoBlob)
    const a = document.createElement('a')
    a.href = url
    const extension = trimMethod === 'ffmpeg' ? 'mp4' : 'webm'
    a.download = `trimmed-${Date.now()}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveTrimmed = async () => {
    if (!trimmedVideoBlob) return

    try {
      setIsProcessing(true)
      const extension = trimMethod === 'ffmpeg' ? 'mp4' : 'webm'
      const filename = `trimmed-${Date.now()}.${extension}`

      const formData = new FormData()
      formData.append('video', trimmedVideoBlob, filename)

      const result = await uploadVideo(formData)

      if (result.success) {
        alert('Trimmed video saved successfully!')
        setShowInfoModal(false)
        setTrimmedVideoBlob(null)
        onClose()
        if (onSaveComplete) {
          onSaveComplete()
        }
      } else {
        alert('Failed to save trimmed video: ' + result.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save trimmed video')
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
        <div className={cn('w-full space-y-4 sm:space-y-6', className)}>
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              src={src}
              className="w-full h-full object-contain"
              controls
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>

          <div className="space-y-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base sm:text-lg">Trim Settings</h3>

              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Method:</label>
                <select
                  value={trimMethod}
                  onChange={(e) => setTrimMethod(e.target.value as TrimMethod)}
                  className="px-2 sm:px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm"
                  disabled={isProcessing}
                >
                  <option value="ffmpeg">FFmpeg (Recommended)</option>
                  <option value="mediarecorder">MediaRecorder</option>
                </select>
              </div>
            </div>

            {loadingFFmpeg && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Loading FFmpeg... This may take a moment.
                </p>
              </div>
            )}

            {isProcessing && processingProgress > 0 && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                  Processing: {processingProgress}%
                </p>
              </div>
            )}

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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
                />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Duration: {formatTime(endTime - startTime)}
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleTrim}
                disabled={isProcessing || startTime >= endTime || (trimMethod === 'ffmpeg' && !ffmpegLoaded)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md',
                  'bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base',
                  (isProcessing || startTime >= endTime || (trimMethod === 'ffmpeg' && !ffmpegLoaded)) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Trim</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Original</span>
              </button>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                {trimMethod === 'ffmpeg'
                  ? 'FFmpeg provides accurate frame-perfect trimming and exports as MP4. Processing happens entirely in your browser.'
                  : 'MediaRecorder re-encodes video and exports as WebM. May have audio sync issues for some videos.'}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showInfoModal}
        onClose={() => {
          setShowInfoModal(false)
          setTrimmedVideoBlob(null)
        }}
        title="Video Trimmed Successfully"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Your trimmed video is ready!
              </p>
              <p className="text-sm text-green-800 dark:text-green-200">
                The video was processed entirely in your browser using {trimMethod === 'ffmpeg' ? 'FFmpeg WebAssembly' : 'MediaRecorder API'}.
                The exported file is in {trimMethod === 'ffmpeg' ? 'MP4' : 'WebM'} format.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadTrimmed}
              disabled={isProcessing}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors',
                isProcessing && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              onClick={handleSaveTrimmed}
              disabled={isProcessing}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors',
                isProcessing && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Save to Gallery
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
