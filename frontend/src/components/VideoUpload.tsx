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
          'flex flex-col items-center justify-center w-full min-h-[300px] cursor-pointer',
          'border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl',
          'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800',
          'transition-all duration-200 ease-in-out',
          'hover:border-blue-400 dark:hover:border-blue-500',
          uploadMutation.isPending && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="w-16 h-16 mb-6 animate-spin text-blue-500" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Uploading video...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please wait while we process your file
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Upload your video to get started
              </p>
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Supported formats: MP4, WebM, OGG • Max size: 100MB
                </p>
              </div>
            </>
          )}
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
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
