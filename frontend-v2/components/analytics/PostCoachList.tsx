'use client'

import { useState } from 'react'
import { Eye, Zap, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Post, Platform, SortOrder } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PostCoachListProps {
  posts: Post[]
}

const platformIcons: Record<Platform, string> = {
  instagram: '📷',
  tiktok: '🎵',
  youtube: '▶️',
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-500'
  if (score >= 70) return 'text-yellow-500'
  return 'text-red-500'
}

const sortOrderLabels: Record<SortOrder, string> = {
  most_recent: 'Most Recent',
  best_performing: 'Best Performing',
  worst_performing: 'Worst Performing',
}

export function PostCoachList({ posts }: PostCoachListProps) {
  const router = useRouter()
  const [sortOrder, setSortOrder] = useState<SortOrder>('most_recent')

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortOrder) {
      case 'best_performing':
        return b.analytics.views - a.analytics.views
      case 'worst_performing':
        return a.analytics.views - b.analytics.views
      case 'most_recent':
      default:
        return 0
    }
  })

  function handleAnalytics(postId: string) {
    router.push(`/analytics?postId=${postId}`)
  }

  return (
    <div className="space-y-3">
      {/* Header with Sort */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Post Coach</h2>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most_recent">{sortOrderLabels.most_recent}</SelectItem>
            <SelectItem value="best_performing">{sortOrderLabels.best_performing}</SelectItem>
            <SelectItem value="worst_performing">{sortOrderLabels.worst_performing}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="flex gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
              {/* Platform icons overlay */}
              <div className="absolute bottom-1 left-1 flex gap-1">
                {post.platforms.map((platform) => (
                  <div
                    key={platform}
                    className="w-5 h-5 rounded-full bg-card flex items-center justify-center text-[10px]"
                  >
                    {platformIcons[platform]}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground mb-2 truncate">
                {post.title}
              </h4>

              <div className="flex flex-wrap gap-3 mb-3">
                {/* Hook Score */}
                <div className="flex items-center gap-1.5">
                  <Zap className={`w-4 h-4 ${getScoreColor(post.analytics.hookScore)}`} />
                  <span className="text-sm text-muted-foreground">Hook</span>
                  <span className={`text-sm font-semibold ${getScoreColor(post.analytics.hookScore)}`}>
                    {post.analytics.hookScore}
                  </span>
                </div>

                {/* Ending Score */}
                <div className="flex items-center gap-1.5">
                  <Target className={`w-4 h-4 ${getScoreColor(post.analytics.endingScore)}`} />
                  <span className="text-sm text-muted-foreground">Ending</span>
                  <span className={`text-sm font-semibold ${getScoreColor(post.analytics.endingScore)}`}>
                    {post.analytics.endingScore}
                  </span>
                </div>
              </div>

              {/* Views and Analytics Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{formatViews(post.analytics.views)}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalytics(post.id)}
                >
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
