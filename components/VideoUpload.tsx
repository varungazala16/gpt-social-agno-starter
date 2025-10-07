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
          'flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl cursor-pointer transition-all',
          'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50',
          isUploading 
            ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700' 
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
        )}
      >
        <div className="flex flex-col items-center justify-center p-6">
          {isUploading ? (
            <Loader2 className="w-12 h-12 mb-4 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 mb-4 text-gray-400" />
          )}
          <p className="mb-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
