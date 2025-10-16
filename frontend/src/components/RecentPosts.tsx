'use client'

import Link from 'next/link'
import { PostGallery } from './PostGallery'
import { ArrowRight } from 'lucide-react'

interface RecentPostsProps {
  limit?: number
}

export function RecentPosts({ limit = 12 }: RecentPostsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Posts</h2>
        <Link
          href="/posts"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <PostGallery />
    </div>
  )
}
