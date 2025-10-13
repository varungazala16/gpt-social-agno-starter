'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUploadVideo } from '@/hooks/useUploadVideo'

interface VideoUploadProps {
  onUploadSuccess?: (url: string, filename: string) => void
  className?: string
}

export function VideoUpload({ onUploadSuccess, className }: VideoUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadVideo()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file')
      return
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB')
      return
    }

    setError(null)

    const formData = new FormData()
    formData.append('video', file)

    uploadMutation.mutate(formData, {
      onSuccess: (result) => {
        if (result.url && result.filename) {
          onUploadSuccess?.(result.url, result.filename)
        }
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
      onError: (error) => {
        setError(error.message || 'Upload failed. Please try again.')
      },
    })
  }

  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor="video-upload"
        className={cn(
          'flex flex-col items-center justify-center w-full min-h-[200px] cursor-pointer bg-white',
          uploadMutation.isPending && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex flex-col items-center justify-center p-6">
          {uploadMutation.isPending ? (
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 mb-4" />
          )}
          <p className="mb-2 text-sm sm:text-base">
            <span>Click to upload</span> or drag and drop
          </p>
          <p className="text-xs sm:text-sm">
            MP4, WebM, or OGG (MAX. 100MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          id="video-upload"
          type="file"
          className="hidden"
          accept="video/*"
          onChange={handleFileChange}
          disabled={uploadMutation.isPending}
        />
      </label>
      {error && (
        <div className="mt-3 p-3 bg-red-50">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
