'use client'

import { useState, useEffect } from 'react'
import { Eye, Zap, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Post, Platform } from '@/types'
import { getPosts } from '@/lib/api/mock-posts'

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

export function PostCoachSection() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      const data = await getPosts()
      setPosts(data)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSeeAllPosts() {
    router.push('/posts')
  }

  function handleAnalytics(postId: string) {
    router.push(`/analytics?postId=${postId}`)
  }

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground">Loading posts...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Post Coach</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-muted-foreground hover:text-foreground"
            onClick={handleSeeAllPosts}
          >
            <span className="text-sm">See All Posts</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex gap-4 p-4 rounded-lg bg-secondary border border-border hover:border-primary transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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

              {/* Views */}
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
      </CardContent>
    </Card>
  )
}
