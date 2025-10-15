'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, FileText, Film, Calendar, Edit } from 'lucide-react'
import { VideoPlayer } from './VideoPlayer'
import { ConfirmDialog } from './ConfirmDialog'
import { cn } from '@/lib/utils'
import { usePosts } from '@/hooks/usePosts'
import { useDeletePost } from '@/hooks/useDeletePost'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/actions/post'

interface PostGalleryProps {
  className?: string
}

// Helper function to get video URL from storage path
function getVideoUrl(path: string) {
  const supabase = createClient()
  const { data } = supabase.storage.from('videos').getPublicUrl(path)
  return data.publicUrl
}

// Helper function to get status badge color
function getStatusColor(status: Post['status']) {
  switch (status) {
    case 'posted':
      return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800'
    case 'scheduled':
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800'
    case 'draft':
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700'
  }
}

export function PostGallery({ className }: PostGalleryProps) {
  const router = useRouter()
  const { data: posts = [], isLoading, error } = usePosts()
  const deleteMutation = useDeletePost()
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ''
  })

  const handleDelete = async (id: string) => {
    setConfirmDialog({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    const id = confirmDialog.id
    setConfirmDialog({ isOpen: false, id: '' })
    deleteMutation.mutate(id)
  }

  const handleViewPost = (id: string) => {
    router.push(`/post/${id}`)
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
        <p className="text-red-600 dark:text-red-400">Error loading posts: {error.message}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-gray-600 dark:text-gray-400">No posts yet. Create your first post!</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6', className)}>
      {posts.map((post) => {
        const isDeleting = deleteMutation.isPending && deleteMutation.variables === post.id
        const postDate = post.created_at
          ? new Date(post.created_at).toLocaleDateString()
          : 'Unknown date'
        const videoCount = post.assets?.length || 0
        const firstVideo = post.assets && post.assets.length > 0 ? getVideoUrl(post.assets[0]) : null

        return (
          <div key={post.id} className="group relative bg-white dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg">
            {/* Status Badge */}
            <div className="absolute top-2 left-2 z-10">
              <div className={cn('flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border', getStatusColor(post.status))}>
                <span className="capitalize">{post.status}</span>
              </div>
            </div>

            {/* Video Count Badge */}
            {videoCount > 0 && (
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                  <Film className="w-3 h-3" />
                  <span>{videoCount}</span>
                </div>
              </div>
            )}

            {/* Thumbnail/Preview */}
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
              {firstVideo ? (
                <VideoPlayer src={firstVideo} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  {post.caption ? (
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                      {post.caption}
                    </p>
                  ) : (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400">
                      No caption
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{postDate}</span>
                  </div>

                  {post.published && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Published: {new Date(post.published).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {/* View/Edit button */}
                <button
                  onClick={() => handleViewPost(post.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                  aria-label="View post"
                  title="View post"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={isDeleting}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors text-sm font-medium',
                    isDeleting && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-label="Delete post"
                  title="Delete post"
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
        onClose={() => setConfirmDialog({ isOpen: false, id: '' })}
        onConfirm={confirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This will also delete all associated videos. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
