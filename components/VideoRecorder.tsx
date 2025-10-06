'use client'

import { useState, useRef, useCallback } from 'react'
import { Video, Square, Loader2 } from 'lucide-react'
import { saveRecording } from '@/actions/video'
import { cn } from '@/lib/utils'

interface VideoRecorderProps {
  onRecordingComplete?: (url: string, filename: string) => void
  className?: string
}

export function VideoRecorder({ onRecordingComplete, className }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
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
          
          setIsSaving(true)
          const filename = `recording-${Date.now()}.webm`
          const result = await saveRecording(base64data, filename)
          setIsSaving(false)

          if (result.success && result.url && result.filename) {
            onRecordingComplete?.(result.url, result.filename)
          } else {
            setError(result.error || 'Failed to save recording')
          }
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
    <div className={cn('w-full', className)}>
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
        
        {!stream && !isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">Camera preview will appear here</p>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">Recording</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isSaving}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
              'bg-red-600 hover:bg-red-700 text-white',
              isSaving && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                <span>Start Recording</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <Square className="w-5 h-5" />
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
