'use client'

import { useRouter, usePathname } from 'next/navigation'
import { PlusCircle, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { UserProfile } from '@/components/UserProfile'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Button } from '@/components/preline/Button'
import { useState } from 'react'

export function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const createPostMutation = useCreatePost()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="GPT Social"
                width={32}
                height={0}
                className="w-8 h-auto"
              />
              <span className="text-lg font-bold text-gray-900 dark:text-white">GPT Social</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="solid"
                size="sm"
                className="gap-2"
                onClick={handleNewPost}
                isLoading={createPostMutation.isPending}
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Post</span>
              </Button>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Profile Dropdown */}
            <UserProfile variant="desktop" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-2">
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

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <UserProfile variant="mobile" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
