'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Video, Film, Trash2, Calendar, FileText, Loader2, Check } from 'lucide-react'
import { usePost } from '@/hooks/usePost'
import { useUpdatePost } from '@/hooks/useUpdatePost'
import { VideoUpload } from '@/components/VideoUpload'
import { VideoRecorder } from '@/components/VideoRecorder'
import { HoverVideoPreview } from '@/components/HoverVideoPreview'
import { StatusButtons } from '@/components/StatusButtons'
import { PostStats } from '@/components/PostStats'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { addVideoToPost, removeVideoFromPost, updatePost, deletePost, type PostStatus } from '@/actions/post'
import { useQueryClient } from '@tanstack/react-query'

type ViewMode = 'view' | 'upload' | 'record'

// Helper function to get video URL from storage path
function getVideoUrl(path: string) {
  const supabase = createClient()
  const { data } = supabase.storage.from('videos').getPublicUrl(path)
  return data.publicUrl
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [postId, setPostId] = useState<string | null>(null)
  const { data: post, isLoading, error } = usePost(postId)
  const updateMutation = useUpdatePost()

  const [caption, setCaption] = useState('')
  const [status, setStatus] = useState<PostStatus>('draft')
  const [publishedDate, setPublishedDate] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('view')
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [removeVideoDialog, setRemoveVideoDialog] = useState<{ isOpen: boolean; path: string }>({
    isOpen: false,
    path: ''
  })

  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const savedTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    params.then(({ id }) => setPostId(id))
  }, [params])

  useEffect(() => {
    if (post) {
      setCaption(post.caption || '')
      setStatus(post.status || 'draft')
      setPublishedDate(post.published ? new Date(post.published).toISOString().slice(0, 16) : '')
    }
  }, [post])

  // Debounced save function
  const debouncedSave = useCallback((captionVal: string, statusVal: PostStatus, publishedVal: string) => {
    if (!postId) return

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for auto-save (1 second debounce)
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true)

      try {
        const result = await updatePost(postId, {
          caption: captionVal,
          status: statusVal,
          published: publishedVal || null,
        })

        if (result.success) {
          setIsSaving(false)
          setShowSaved(true)

          // Clear any existing timeout
          if (savedTimeoutRef.current) {
            clearTimeout(savedTimeoutRef.current)
          }

          // Hide "Saved" indicator after 2 seconds
          savedTimeoutRef.current = setTimeout(() => {
            setShowSaved(false)
          }, 2000)
        } else {
          setIsSaving(false)
        }
      } catch (error) {
        setIsSaving(false)
      }
    }, 1000)
  }, [postId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    }
  }, [])

  const handleUploadSuccess = async (url: string, filename: string) => {
    if (!postId) return
    if (filename) {
      await addVideoToPost(postId, filename)
      // Invalidate the post query to refetch and show the new video
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
      setViewMode('view')
    }
  }

  const handleRecordingComplete = async (url: string, filename: string) => {
    if (!postId) return
    if (filename) {
      await addVideoToPost(postId, filename)
      // Invalidate the post query to refetch and show the new video
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
      setViewMode('view')
    }
  }

  const handleRemoveVideo = (videoPath: string) => {
    setRemoveVideoDialog({ isOpen: true, path: videoPath })
  }

  const confirmRemoveVideo = async () => {
    if (!postId) return
    const videoPath = removeVideoDialog.path
    setRemoveVideoDialog({ isOpen: false, path: '' })
    await removeVideoFromPost(postId, videoPath)
    // Invalidate the post query to refetch and hide the removed video
    queryClient.invalidateQueries({ queryKey: ['post', postId] })
  }

  const handleEditVideo = (index: number) => {
    router.push(`/post/${postId}/edit/${index}`)
  }

  const handleDeletePost = async () => {
    if (!postId) return
    if (confirm('Delete this post? This action cannot be undone.')) {
      const result = await deletePost(postId)
      if (result.success) {
        router.push('/')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error?.message || 'Post not found'}
        </p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    )
  }

  const videoUrls = (post.assets || []).map(path => ({
    path,
    url: getVideoUrl(path)
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <StatusButtons
                currentStatus={status}
                onStatusChange={(newStatus) => {
                  setStatus(newStatus)
                  debouncedSave(caption, newStatus, publishedDate)
                }}
                canPublish={!!(caption && publishedDate && post.assets && post.assets.length > 0)}
              />
            </div>

            {/* Saving indicator */}
            <div className="flex items-center gap-2 text-sm">
              {isSaving && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-gray-500">Saving...</span>
                </>
              )}
              {showSaved && !isSaving && (
                <>
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">Saved</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Post Details */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Post Details
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="caption" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Caption
                </Label>
                <textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => {
                    const newCaption = e.target.value
                    setCaption(newCaption)
                    debouncedSave(newCaption, status, publishedDate)
                  }}
                  placeholder="Enter your post caption..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="published" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Published Date (Optional)
                </Label>
                <Input
                  id="published"
                  type="datetime-local"
                  value={publishedDate}
                  onChange={(e) => {
                    const newPublishedDate = e.target.value
                    setPublishedDate(newPublishedDate)
                    debouncedSave(caption, status, newPublishedDate)
                  }}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Post Stats - Only show when published */}
          {status === 'posted' && <PostStats />}

          <Separator />

          {/* Videos Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Videos ({videoUrls.length})
              </h2>

              {viewMode === 'view' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode('upload')}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode('record')}
                    className="gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Record
                  </Button>
                </div>
              )}
            </div>

            {viewMode === 'view' && (
              <>
                {videoUrls.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No videos yet. Upload or record a video to get started!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videoUrls.map(({ path, url }, index) => (
                      <div key={path} className="relative group border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                          <HoverVideoPreview
                            src={url}
                            onClick={() => router.push(`/post/${postId}/${index}`)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {viewMode === 'upload' && (
              <div className="space-y-4">
                <VideoUpload onUploadSuccess={handleUploadSuccess} />
                <Button
                  variant="outline"
                  onClick={() => setViewMode('view')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            )}

            {viewMode === 'record' && (
              <div className="space-y-4">
                <VideoRecorder onRecordingComplete={handleRecordingComplete} />
                <Button
                  variant="outline"
                  onClick={() => setViewMode('view')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Delete Post */}
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={handleDeletePost}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Post
            </Button>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={removeVideoDialog.isOpen}
        onClose={() => setRemoveVideoDialog({ isOpen: false, path: '' })}
        onConfirm={confirmRemoveVideo}
        title="Remove Video"
        message="Are you sure you want to remove this video from the post? This action cannot be undone."
        confirmText="Remove"
        variant="danger"
      />
    </div>
  )
}
