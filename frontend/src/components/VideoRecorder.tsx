'use client'

import { useState, useRef, useCallback } from 'react'
import { Video, Square, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveRecording } from '@/hooks/useSaveRecording'

interface VideoRecorderProps {
  onRecordingComplete?: (url: string, filename: string) => void
  className?: string
}

export function VideoRecorder({ onRecordingComplete, className }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const saveMutation = useSaveRecording()

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      setError(null)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })

        // Convert blob to base64
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = async () => {
          const base64data = reader.result as string

          const filename = `recording-${Date.now()}.webm`

          saveMutation.mutate(
            { blob: base64data, filename },
            {
              onSuccess: (result) => {
                if (result.url && result.filename) {
                  onRecordingComplete?.(result.url, result.filename)
                }
              },
              onError: (error) => {
                setError(error.message || 'Failed to save recording')
              },
            }
          )
        }

        // Stop all tracks
        mediaStream.getTracks().forEach(track => track.stop())
        setStream(null)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Recording error:', err)
      setError('Failed to access camera/microphone. Please grant permissions.')
    }
  }

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Video Preview Area */}
      <div className="relative bg-black dark:bg-gray-950 overflow-hidden aspect-video rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          muted
          playsInline
        />
        
        {!stream && !isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 dark:bg-gray-950">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                <Video className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-lg font-medium text-white mb-2">Camera Preview</p>
              <p className="text-sm text-gray-400">Your camera feed will appear here when you start recording</p>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">REC</span>
          </div>
        )}

        {saveMutation.isPending && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Processing Video</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Saving your recording...</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          {!isRecording ? (
            <>
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Record</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click the button below to start recording your video
                </p>
              </div>
              <button
                onClick={startRecording}
                disabled={saveMutation.isPending}
                className={cn(
                  'flex items-center justify-center gap-3 px-8 py-4 rounded-xl',
                  'bg-red-600 hover:bg-red-700 text-white font-medium',
                  'transition-all duration-200 ease-in-out transform hover:scale-105',
                  'shadow-lg hover:shadow-xl',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                )}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-lg">Start Recording</span>
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Recording in Progress</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click stop when you're finished recording
                </p>
              </div>
              <button
                onClick={stopRecording}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
                  <Square className="w-4 h-4" />
                </div>
                <span className="text-lg">Stop Recording</span>
              </button>
            </>
          )}
          
          {/* Permission hint */}
          {!stream && !isRecording && !error && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Camera and microphone access required
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Recording Error</p>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
