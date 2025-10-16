'use client'

import { useRouter } from 'next/navigation'
import { PlusCircle, Settings } from 'lucide-react'
import { PostGallery } from '@/components/PostGallery'
import { UserProfile } from '@/components/UserProfile'
import { CreditsDisplay } from '@/components/CreditsDisplay'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Button } from '@/components/preline/Button'
import { Separator } from '@/components/ui/separator'
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
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Navigation Sidebar */}
      <aside className="w-48 xl:w-56 flex flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          {/* Sidebar Header */}
          <div className="flex flex-col px-4 py-4">
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Post Studio
              </h1>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Create & manage posts
            </p>
          </div>

          <Separator />

          {/* New Post Button */}
          <div className="px-3 py-3">
            <Button
              variant="solid"
              size="default"
              className="w-full justify-start gap-2"
              onClick={handleNewPost}
              isLoading={createPostMutation.isPending}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Post</span>
            </Button>
          </div>

          <Separator />

          {/* User Section */}
          <div className="mt-auto px-3 py-3 space-y-2">
            {/* Credits Display */}
            <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CreditsDisplay />
            </div>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => router.push('/settings')}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>

            {/* User Profile Section */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <UserProfile />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <div className="flex-1 pl-48 xl:pl-56">
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Your Posts
                </h2>
                <Button
                  variant="solid"
                  onClick={handleNewPost}
                  isLoading={createPostMutation.isPending}
                  className="hidden sm:flex gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Post
                </Button>
              </div>
              <PostGallery />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
