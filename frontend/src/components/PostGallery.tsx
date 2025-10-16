'use client'

import { useRouter } from 'next/navigation'
import { Loader2, FileText, Film, Calendar } from 'lucide-react'
import { HoverVideoPreview } from './HoverVideoPreview'
import { cn } from '@/lib/utils'
import { usePosts } from '@/hooks/usePosts'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/actions/post'

interface PostGalleryProps {
  className?: string
  posts?: Post[]
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

export function PostGallery({ className, posts: propsPosts }: PostGalleryProps) {
  const router = useRouter()
  const { data: hookPosts = [], isLoading, error } = usePosts()
  const posts = propsPosts || hookPosts

  const handleViewPost = (id: string) => {
    router.push(`/post/${id}`)
  }

  // Only show loading/error states if we're using the hook (not props)
  if (!propsPosts && isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!propsPosts && error) {
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
        const postDate = post.created_at
          ? new Date(post.created_at).toLocaleDateString()
          : 'Unknown date'
        const videoCount = post.assets?.length || 0
        const firstVideo = post.assets && post.assets.length > 0 ? getVideoUrl(post.assets[0]) : null

        return (
          <div
            key={post.id}
            onClick={() => handleViewPost(post.id)}
            className="group relative bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
          >
            {/* Video Background */}
            <div className="relative aspect-video">
              {firstVideo ? (
                <div className="absolute inset-0">
                  <HoverVideoPreview src={firstVideo} className="object-cover" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
              )}

              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-2 left-2 z-10">
                <div className={cn('flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border backdrop-blur-sm', getStatusColor(post.status))}>
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

              {/* Post Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                {post.caption ? (
                  <p className="text-sm font-medium text-white line-clamp-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    {post.caption}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-300" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    No caption
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1 text-xs text-gray-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  <Calendar className="w-3 h-3" />
                  <span>{postDate}</span>
                </div>

                {post.published && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    <span>Published: {new Date(post.published).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
