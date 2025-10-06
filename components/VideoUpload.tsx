'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { uploadVideo } from '@/actions/video'
import { cn } from '@/lib/utils'

interface VideoUploadProps {
  onUploadSuccess?: (url: string, filename: string) => void
  className?: string
}

export function VideoUpload({ onUploadSuccess, className }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('video', file)

      const result = await uploadVideo(formData)

      if (result.success && result.url && result.filename) {
        onUploadSuccess?.(result.url, result.filename)
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor="video-upload"
        className={cn(
          'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          'hover:bg-gray-50 dark:hover:bg-gray-800',
          isUploading ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600'
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
          )}
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
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
          disabled={isUploading}
        />
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
