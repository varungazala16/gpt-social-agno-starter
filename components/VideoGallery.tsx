'use client'

import { useEffect, useState } from 'react'
import { Trash2, Loader2, Download, Film } from 'lucide-react'
import { getVideos, deleteVideo } from '@/actions/video'
import { VideoPlayer } from './VideoPlayer'
import { ConfirmDialog } from './ConfirmDialog'
import { cn } from '@/lib/utils'

interface Video {
  filename: string
  url: string
  uploadedAt: string
}

interface VideoGalleryProps {
  refreshTrigger?: number
  className?: string
  onEditVideo?: (url: string) => void
}

export function VideoGallery({ refreshTrigger, className, onEditVideo }: VideoGalleryProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; filename: string }>({
    isOpen: false,
    filename: ''
  })

  const loadVideos = async () => {
    setIsLoading(true)
    const result = await getVideos()
    if (result.success && result.videos) {
      setVideos(result.videos)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadVideos()
  }, [refreshTrigger])

  const handleDelete = async (filename: string) => {
    setConfirmDialog({ isOpen: true, filename })
  }

  const confirmDelete = async () => {
    const filename = confirmDialog.filename
    setDeletingId(filename)
    const result = await deleteVideo(filename)
    
    if (result.success) {
      setVideos(videos.filter(v => v.filename !== filename))
    }
    setDeletingId(null)
  }

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  const handleEdit = (url: string) => {
    if (onEditVideo) {
      onEditVideo(url)
    }
  }

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-gray-500 dark:text-gray-400">No videos yet. Upload or record your first video!</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {videos.map((video) => (
        <div key={video.filename} className="group relative">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <VideoPlayer src={video.url} />
          </div>
          
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {video.filename}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(parseInt(video.uploadedAt)).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleDownload(video.url, video.filename)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                aria-label="Download video"
                title="Download video"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleEdit(video.url)}
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                aria-label="Edit video"
                title="Edit video"
              >
                <Film className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(video.filename)}
                disabled={deletingId === video.filename}
                className={cn(
                  'p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors',
                  deletingId === video.filename && 'opacity-50 cursor-not-allowed'
                )}
                aria-label="Delete video"
                title="Delete video"
              >
                {deletingId === video.filename ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, filename: '' })}
        onConfirm={confirmDelete}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
