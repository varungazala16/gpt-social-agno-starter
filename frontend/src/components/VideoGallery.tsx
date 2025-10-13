'use client'

import { useState } from 'react'
import { Trash2, Loader2, Download, Film } from 'lucide-react'
import { VideoPlayer } from './VideoPlayer'
import { ConfirmDialog } from './ConfirmDialog'
import { cn } from '@/lib/utils'
import { useVideos } from '@/hooks/useVideos'
import { useDeleteVideo } from '@/hooks/useDeleteVideo'

interface VideoGalleryProps {
  className?: string
  onEditVideo?: (url: string) => void
}

export function VideoGallery({ className, onEditVideo }: VideoGalleryProps) {
  const { data: videos = [], isLoading, error } = useVideos()
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

        return (
          <div key={video.filename} className="group relative bg-white overflow-hidden border">
            <div className="relative aspect-video bg-gray-100">
              <VideoPlayer src={video.url} />
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    {video.filename}
                  </p>
                  <p className="text-xs mt-0.5">
                    {new Date(parseInt(video.uploadedAt)).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownload(video.url, video.filename)}
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-blue-600 text-sm"
                  aria-label="Download video"
                  title="Download video"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={() => handleEdit(video.url)}
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 text-green-600  dark: transition-colors text-sm font-medium"
                  aria-label="Edit video"
                  title="Edit video"
                >
                  <Film className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(video.filename)}
                  disabled={isDeleting}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 p-2 text-red-600  dark: transition-colors text-sm font-medium',
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
