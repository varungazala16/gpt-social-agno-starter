'use client'

import { useState } from 'react'
import { Trash2, Loader2, Download, Film, Music, Camera, Monitor } from 'lucide-react'
import { VideoPlayer } from './VideoPlayer'
import { ConfirmDialog } from './ConfirmDialog'
import { cn } from '@/lib/utils'
import { useAllVideos, type UnifiedVideo } from '@/hooks/useAllVideos'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'

interface VideoGalleryProps {
  className?: string
  onEditVideo?: (url: string) => void
}

// Helper function to get platform icon
const getPlatformIcon = (platform?: string) => {
  switch (platform) {
    case 'tiktok':
      return <Music className="w-4 h-4" />
    case 'instagram': 
      return <Camera className="w-4 h-4" />
    case 'youtube':
      return <Monitor className="w-4 h-4" />
    case 'local':
    default:
      return <Film className="w-4 h-4" />
  }
}

// Helper function to get platform color
const getPlatformColor = (platform?: string) => {
  switch (platform) {
    case 'tiktok':
      return 'text-pink-600 bg-pink-50 border-pink-200'
    case 'instagram':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'youtube':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'local':
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200'
  }
}

export function VideoGallery({ className, onEditVideo }: VideoGalleryProps) {
  const { data: videos = [], isLoading, error } = useAllVideos()
  const deleteMutation = useDeleteVideo()
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; filename: string }>({
    isOpen: false,
    filename: ''
  })

  const handleDelete = async (filename: string) => {
    setConfirmDialog({ isOpen: true, filename })
  }

  const confirmDelete = async () => {
    const filename = confirmDialog.filename
    setConfirmDialog({ isOpen: false, filename: '' })
    deleteMutation.mutate(filename)
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

  if (error) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="">Error loading videos: {error.message}</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="">No videos yet. Upload or record your first video!</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6', className)}>
      {videos.map((video) => {
        const isDeleting = deleteMutation.isPending && deleteMutation.variables === video.filename
        const videoDate = video.uploadedAt 
          ? new Date(parseInt(video.uploadedAt)).toLocaleDateString()
          : video.created_at
          ? new Date(video.created_at).toLocaleDateString()
          : 'Unknown date'

        return (
          <div key={video.id} className="group relative bg-white dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg">
            {/* Platform Badge */}
            <div className="absolute top-2 left-2 z-10">
              <div className={cn('flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border', getPlatformColor(video.platform))}>
                {getPlatformIcon(video.platform)}
                <span className="capitalize">{video.platform || 'local'}</span>
              </div>
            </div>

            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
              {video.thumbnail ? (
                <img 
                  src={video.thumbnail} 
                  alt={video.title || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <VideoPlayer src={video.url} />
              )}
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                    {video.title || video.filename || 'Untitled Video'}
                  </p>
                  <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
                    {videoDate}
                  </p>
                  {video.description && (
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  {(video.duration || video.view_count) && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      {video.duration && <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>}
                      {video.view_count && <span>{video.view_count.toLocaleString()} views</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Only show download for local videos */}
                {video.platform === 'local' && video.filename && (
                  <button
                    onClick={() => handleDownload(video.url, video.filename!)}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                    aria-label="Download video"
                    title="Download video"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                )}

                {/* Edit button for all videos */}
                <button
                  onClick={() => handleEdit(video.url)}
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 rounded-md transition-colors text-sm font-medium"
                  aria-label="Edit video"
                  title="Edit video"
                >
                  <Film className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                {/* Only show delete for local videos */}
                {video.platform === 'local' && video.filename && (
                  <button
                    onClick={() => handleDelete(video.filename!)}
                    disabled={isDeleting}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors text-sm font-medium',
                      isDeleting && 'opacity-50 cursor-not-allowed'
                    )}
                    aria-label="Delete video"
                    title="Delete video"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </>
                    )}
                  </button>
                )}

                {/* For social videos, show external link */}
                {video.platform !== 'local' && (
                  <button
                    onClick={() => window.open(video.url, '_blank')}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors text-sm font-medium"
                    aria-label="View on platform"
                    title="View on platform"
                  >
                    {getPlatformIcon(video.platform)}
                    <span className="hidden sm:inline">View</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}

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
