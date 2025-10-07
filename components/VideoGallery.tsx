'use client'

import { useEffect, useState } from 'react'
import { Trash2, Loader2, Download, Film } from 'lucide-react'
import { getVideos, deleteVideo } from '@/actions/video'
import { VideoPlayer } from './VideoPlayer'
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
    if (!confirm('Are you sure you want to delete this video?')) return

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
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6', className)}>
      {videos.map((video) => (
        <div key={video.filename} className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-800">
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
            <VideoPlayer src={video.url} />
          </div>
          
          <div className="p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {video.filename}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {new Date(parseInt(video.uploadedAt)).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleDownload(video.url, video.filename)}
                className="flex-1 flex items-center justify-center gap-1.5 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
                aria-label="Download video"
                title="Download video"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={() => handleEdit(video.url)}
                className="flex-1 flex items-center justify-center gap-1.5 p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-sm font-medium"
                aria-label="Edit video"
                title="Edit video"
              >
                <Film className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                onClick={() => handleDelete(video.filename)}
                disabled={deletingId === video.filename}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium',
                  deletingId === video.filename && 'opacity-50 cursor-not-allowed'
                )}
                aria-label="Delete video"
                title="Delete video"
              >
                {deletingId === video.filename ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
