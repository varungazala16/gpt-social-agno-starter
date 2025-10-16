'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PostFilters } from '@/components/PostFilters'
import { PostGallery } from '@/components/PostGallery'
import { getFilteredPosts, type PostStatus, type Post } from '@/actions/post'

function PostsContent() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadPosts = async () => {
    setIsLoading(true)
    const filters = {
      status: searchParams.get('status') as PostStatus | undefined,
      search: searchParams.get('search') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
    }

    const result = await getFilteredPosts(filters)
    if (result.success) {
      setPosts(result.posts)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [searchParams])

  const handleFilterChange = () => {
    // URL params will trigger useEffect above
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Posts</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <PostFilters onFilterChange={handleFilterChange} />
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <PostGallery posts={posts} />
          )}
        </div>
      </main>
    </div>
  )
}

export default function PostsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <PostsContent />
    </Suspense>
  )
}
