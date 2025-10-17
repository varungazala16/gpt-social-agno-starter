'use client'

import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'

interface VideoUploaderProps {
  onUpload: (file: File) => void
  isUploading?: boolean
}

export function VideoUploader({ onUpload, isUploading = false }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => file.type.startsWith('video/'))

    if (videoFile) {
      onUpload(videoFile)
    }
  }, [onUpload])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      onUpload(file)
    }
  }, [onUpload])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
      } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="video-upload"
      />

      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
          <Upload className="w-8 h-8 text-muted-foreground" />
        </div>

        <div>
          <p className="text-lg font-semibold text-foreground mb-2">
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isDragging
              ? 'Drop your video here'
              : 'Drag and drop your video here, or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports MP4, MOV, AVI, and other video formats
          </p>
        </div>
      </div>
    </div>
  )
}
