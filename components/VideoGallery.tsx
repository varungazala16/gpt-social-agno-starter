'use client'

import { useEffect, useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
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
}

export function VideoGallery({ refreshTrigger, className }: VideoGalleryProps) {
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
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {video.filename}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(parseInt(video.uploadedAt)).toLocaleDateString()}
              </p>
            </div>
            
            <button
              onClick={() => handleDelete(video.filename)}
              disabled={deletingId === video.filename}
              className={cn(
                'p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors',
                deletingId === video.filename && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Delete video"
            >
              {deletingId === video.filename ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
