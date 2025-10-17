import { OverviewAnalytics, Post, TimeRange, ChartDataPoint, InsightItem } from '@/types'

// Generate mock chart data based on time range
function generateChartData(timeRange: TimeRange): ChartDataPoint[] {
  const dataPoints: ChartDataPoint[] = []
  const now = new Date()

  let days: number
  switch (timeRange) {
    case 'last_24_hours':
      days = 1
      break
    case 'last_7_days':
      days = 7
      break
    case 'last_28_days':
      days = 28
      break
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    // Generate trending upward data with some variation
    const baseViews = 50000 + (days - i) * 5000
    const baseEngagement = 15000 + (days - i) * 2000
    const baseFollows = 800 + (days - i) * 50

    dataPoints.push({
      date: dateStr,
      views: Math.floor(baseViews + Math.random() * 10000),
      engagement: Math.floor(baseEngagement + Math.random() * 3000),
      follows: Math.floor(baseFollows + Math.random() * 200),
    })
  }

  return dataPoints
}

// Generate mock insights
function generateInsights(): InsightItem[] {
  return [
    {
      id: 'insight-1',
      type: 'positive',
      title: 'Comments',
      percentage: '3%',
      explanation: 'Your comment rate is above average. Viewers are actively engaging with your content through comments, indicating strong community involvement.',
    },
    {
      id: 'insight-2',
      type: 'positive',
      title: 'Follows',
      percentage: '0.5%',
      explanation: 'Your follow rate shows viewers are interested in seeing more of your content. This indicates good channel growth potential.',
    },
    {
      id: 'insight-3',
      type: 'negative',
      title: 'Completion Rate',
      percentage: '20%',
      explanation: 'Many viewers are leaving before the end. Consider stronger hooks, better pacing, and more engaging content throughout to retain attention.',
    },
  ]
}

// Generate mock posts
function generateMockPosts(): Post[] {
  const titles = [
    'Morning routine that changed my life',
    'Why I quit my 9-5 to create content',
    '3 productivity hacks you\'re not using',
    'Behind the scenes of my creative process',
    'How I grew to 100K followers in 6 months',
  ]

  const platforms: Array<'instagram' | 'tiktok' | 'youtube'> = ['instagram', 'tiktok', 'youtube']

  return titles.map((title, index) => ({
    id: `post-${index + 1}`,
    title,
    thumbnailUrl: `/mock-thumbnail-${index + 1}.jpg`,
    analytics: {
      hookScore: 70 + Math.floor(Math.random() * 30),
      endingScore: 65 + Math.floor(Math.random() * 33),
      views: Math.floor(45000 + Math.random() * 100000),
    },
    platforms: [platforms[index % 3], platforms[(index + 1) % 3]],
  }))
}

export async function getOverviewAnalytics(timeRange: TimeRange): Promise<OverviewAnalytics> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const chartData = generateChartData(timeRange)
  const insights = generateInsights()
  const posts = generateMockPosts()

  // Calculate totals from chart data
  const totalViews = chartData.reduce((sum, point) => sum + point.views, 0)
  const totalEngagement = chartData.reduce((sum, point) => sum + point.engagement, 0)
  const totalFollows = chartData.reduce((sum, point) => sum + point.follows, 0)

  return {
    totalViews: Math.floor(totalViews),
    totalEngagement: Math.floor(totalEngagement),
    totalFollows: Math.floor(totalFollows),
    chartData,
    insights,
    posts,
  }
}

export async function getPostAnalytics(postId: string): Promise<Post> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const posts = generateMockPosts()
  const post = posts.find(p => p.id === postId) || posts[0]

  // Generate chart data for this specific post
  const chartData = generateChartData('last_7_days')

  // Generate hook and ending reasons
  const hookReasons = [
    'Hook grabs attention within first 0.8s with bold statement.',
    'Strong pattern interrupt with unexpected visual at 0:03.',
    'Clear value proposition immediately established.',
  ]

  const endingReasons = [
    'Ending lacks clear CTA; viewers unsure what action to take.',
    'Abrupt cutoff at 0:58 — extend 2-3s for natural close.',
  ]

  return {
    ...post,
    analytics: {
      ...post.analytics,
      engagement: 4900,
      follows: 286,
      chartData,
      hookReason: hookReasons,
      endingReason: endingReasons,
    },
  }
}

export async function getPostInsights(_postId: string): Promise<InsightItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  return [
    {
      id: 'post-insight-1',
      type: 'positive',
      title: 'Hook Performance',
      percentage: '82%',
      explanation: 'Your hook is performing exceptionally well. The opening 3 seconds capture attention effectively, with high retention rates in the critical first moments.',
    },
    {
      id: 'post-insight-2',
      type: 'positive',
      title: 'Audience Engagement',
      percentage: '4.2%',
      explanation: 'Strong engagement rate indicates your content resonates with viewers. Comments, likes, and shares are above average for your content category.',
    },
    {
      id: 'post-insight-3',
      type: 'negative',
      title: 'Watch Time',
      percentage: '35%',
      explanation: 'Average watch time is lower than optimal. Consider tightening the middle section and adding more visual interest to maintain viewer attention throughout.',
    },
  ]
}
