// Social platform types
export type Platform = 'instagram' | 'tiktok' | 'youtube'

// Social account
export interface SocialAccount {
  id: string
  platform: Platform
  username: string
  displayName: string
  profileImage: string
  followerCount: number
  isConnected: boolean
  isSelected: boolean
}

// Goal data
export type GoalMetric = 'followers' | 'views' | 'likes'

export interface Goal {
  metric: GoalMetric
  targetValue: number
  currentValue: number
  todayGrowth: number
  percentComplete: number
  // Legacy fields for followers (kept for backward compatibility)
  targetFollowers: number
  currentFollowers: number
}

// Growth data point for charts
export interface GrowthDataPoint {
  date: string
  instagram: number
  tiktok: number
  youtube: number
}

// Hook type
export type HookType = 'Video Concept' | 'Opening Line' | 'Story Hook' | 'Tutorial Hook'

// Hook details for expandable content
export interface HookDetails {
  description: string[]
  examples?: string[]
}

// Hook suggestion
export interface Hook {
  id: string
  text: string
  type: HookType
  isSaved: boolean
  details?: HookDetails
}

// Analytics types
export type TimeRange = 'last_24_hours' | 'last_7_days' | 'last_28_days'
export type SortOrder = 'most_recent' | 'best_performing' | 'worst_performing'
export type InsightType = 'positive' | 'negative'

export interface ChartDataPoint {
  date: string
  views: number
  engagement: number
  follows: number
}

export interface InsightItem {
  id: string
  type: InsightType
  title: string
  percentage: string
  explanation?: string
}

// Post analytics
export interface PostAnalytics {
  hookScore: number
  endingScore: number
  hookReason?: string[]
  endingReason?: string[]
  views: number
  engagement?: number
  follows?: number
  chartData?: ChartDataPoint[]
}

// Post
export interface Post {
  id: string
  title: string
  thumbnailUrl: string
  analytics: PostAnalytics
  platforms: Platform[]
}

// Overview analytics
export interface OverviewAnalytics {
  totalViews: number
  totalEngagement: number
  totalFollows: number
  chartData: ChartDataPoint[]
  insights: InsightItem[]
  posts: Post[]
}

// Navigation tab
export type NavTab = 'chat' | 'hooks' | 'home' | 'review' | 'analytics'

// Video Review types
export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'

export type FeedbackType = 'positive' | 'negative'

export interface VideoReview {
  id: string
  videoUrl: string
  thumbnailUrl: string
  uploadedAt: Date
}

export interface VideoAnalysis {
  hookScore?: number
  endingScore?: number
  hookReason?: string
  endingReason?: string
  analysisComplete: boolean
}

export interface FeedbackItem {
  id: string
  type: FeedbackType
  timestamp: string
  title: string
  description: string
  explanation?: string
}

// Notification preferences
export type NotificationType = 'weekly_digest' | 'post_analytics' | 'creator_newsletter' | 'product_updates'

export interface NotificationPreference {
  type: NotificationType
  label: string
  description: string
  enabled: boolean
}

export interface NotificationSettings {
  preferences: NotificationPreference[]
}
