'use client'

import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { StatsCards } from '@/components/StatsCards'
import { RecentPosts } from '@/components/RecentPosts'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Button } from '@/components/preline/Button'
import { useCopilotReadable } from '@copilotkit/react-core'

export default function Home() {
  const router = useRouter()
  const createPostMutation = useCreatePost()

  // Make page context readable to the AI agent
  useCopilotReadable({
    description: "Current page state and post studio context",
    value: JSON.stringify({
      pageType: "post-studio",
      features: ["gallery", "create-post", "edit-post"]
    })
  })

  const handleNewPost = async () => {
    try {
      const result = await createPostMutation.mutateAsync({
        caption: '',
        status: 'draft',
      })
      if (result?.id) {
        router.push(`/post/${result.id}`)
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h2>
              <Button
                variant="solid"
                onClick={handleNewPost}
                isLoading={createPostMutation.isPending}
                className="gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                New Post
              </Button>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Recent Posts */}
            <RecentPosts limit={12} />
          </div>
        </div>
      </main>
    </div>
  )
}
