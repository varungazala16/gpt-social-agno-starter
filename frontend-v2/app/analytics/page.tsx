'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AccountSelector } from '@/components/AccountSelector'
import { TimeRangeSelector } from '@/components/analytics/TimeRangeSelector'
import { MetricCards } from '@/components/analytics/MetricCards'
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart'
import { InsightsSection } from '@/components/analytics/InsightsSection'
import { PostCoachList } from '@/components/analytics/PostCoachList'
import { TimeRange, OverviewAnalytics, Post, InsightItem, Platform } from '@/types'
import { getOverviewAnalytics, getPostAnalytics, getPostInsights } from '@/lib/api/mock-analytics'
import { Zap, Target, ChevronDown, ChevronUp } from 'lucide-react'

const platformIcons: Record<Platform, string> = {
  instagram: '📷',
  tiktok: '🎵',
  youtube: '▶️',
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-500'
  if (score >= 70) return 'text-yellow-500'
  return 'text-red-500'
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('postId')

  const [timeRange, setTimeRange] = useState<TimeRange>('last_7_days')
  const [overviewData, setOverviewData] = useState<OverviewAnalytics | null>(null)
  const [postData, setPostData] = useState<Post | null>(null)
  const [postInsights, setPostInsights] = useState<InsightItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWhyExpanded, setIsWhyExpanded] = useState(false)

  useEffect(() => {
    loadData()
  }, [postId, timeRange])

  async function loadData() {
    setIsLoading(true)
    try {
      if (postId) {
        // Load post-specific analytics
        const [post, insights] = await Promise.all([
          getPostAnalytics(postId),
          getPostInsights(postId),
        ])
        setPostData(post)
        setPostInsights(insights)
      } else {
        // Load overview analytics
        const data = await getOverviewAnalytics(timeRange)
        setOverviewData(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Overview Mode
  if (!postId) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <AccountSelector />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-6 max-w-3xl">
          {/* Time Range Selector */}
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading analytics...</div>
          ) : overviewData ? (
            <>
              {/* Metric Cards */}
              <MetricCards
                views={overviewData.totalViews}
                engagement={overviewData.totalEngagement}
                follows={overviewData.totalFollows}
              />

              {/* Analytics Chart */}
              <AnalyticsChart data={overviewData.chartData} />

              {/* Insights */}
              <InsightsSection insights={overviewData.insights} />

              {/* Post Coach */}
              <PostCoachList posts={overviewData.posts} />
            </>
          ) : null}
        </main>
      </div>
    )
  }

  // Post Detail Mode
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Post Analytics</h1>
          <AccountSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-3xl">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading post analytics...</div>
        ) : postData ? (
          <>
            {/* Post Header */}
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
                {/* Platform icons overlay */}
                <div className="absolute bottom-1 left-1 flex gap-1">
                  {postData.platforms.map((platform) => (
                    <div
                      key={platform}
                      className="w-5 h-5 rounded-full bg-card flex items-center justify-center text-[10px]"
                    >
                      {platformIcons[platform]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{postData.title}</h2>
              </div>
            </div>

            {/* Metric Cards */}
            <MetricCards
              views={postData.analytics.views}
              engagement={postData.analytics.engagement || 0}
              follows={postData.analytics.follows || 0}
            />

            {/* Analytics Chart */}
            {postData.analytics.chartData && (
              <AnalyticsChart data={postData.analytics.chartData} platforms={postData.platforms} />
            )}

            {/* Hook & Ending Scores */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              {/* Scores Row */}
              <div className="flex items-center gap-8">
                {/* Hook Score */}
                <div className="flex items-center gap-3">
                  <Zap className={`w-6 h-6 ${getScoreColor(postData.analytics.hookScore)}`} />
                  <div>
                    <div className="text-xs text-muted-foreground">Hook</div>
                    <div className={`text-2xl font-bold ${getScoreColor(postData.analytics.hookScore)}`}>
                      {postData.analytics.hookScore}
                    </div>
                  </div>
                </div>

                {/* Ending Score */}
                <div className="flex items-center gap-3">
                  <Target className={`w-6 h-6 ${getScoreColor(postData.analytics.endingScore)}`} />
                  <div>
                    <div className="text-xs text-muted-foreground">Ending</div>
                    <div className={`text-2xl font-bold ${getScoreColor(postData.analytics.endingScore)}`}>
                      {postData.analytics.endingScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* Why? Expandable */}
              {(postData.analytics.hookReason || postData.analytics.endingReason) && (
                <button
                  onClick={() => setIsWhyExpanded(!isWhyExpanded)}
                  className="w-full flex items-center justify-between text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="font-medium">Why?</span>
                  {isWhyExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Why? Content */}
              {isWhyExpanded && (
                <div className="space-y-3 text-sm text-muted-foreground pt-2">
                  {postData.analytics.hookReason && (
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4" />
                        <span>Hook ({postData.analytics.hookScore})</span>
                      </div>
                      <ul className="pl-6 space-y-1 list-disc">
                        {postData.analytics.hookReason.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {postData.analytics.endingReason && (
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4" />
                        <span>Ending ({postData.analytics.endingScore})</span>
                      </div>
                      <ul className="pl-6 space-y-1 list-disc">
                        {postData.analytics.endingReason.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Insights */}
            <InsightsSection insights={postInsights} />
          </>
        ) : null}
      </main>
    </div>
  )
}
