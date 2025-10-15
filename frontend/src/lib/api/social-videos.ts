import { apiGet } from './client'

// Types for social media video responses
export interface SocialVideo {
  id: string
  url: string
  thumbnail?: string
  title?: string
  description?: string
  platform: 'tiktok' | 'instagram' | 'youtube'
  created_at?: string
  duration?: number
  view_count?: number
}

export interface TikTokVideosResponse {
  data?: {
    videos?: Array<{
      id: string
      embed_html?: string
      embed_link?: string
      cover_image_url?: string
      title?: string
      video_description?: string
      duration?: number
      view_count?: number
      create_time?: number
    }>
  }
  error?: {
    code?: string
    message?: string
  }
}

export interface InstagramVideosResponse {
  data?: Array<{
    id: string
    media_url?: string
    thumbnail_url?: string
    caption?: string
    media_type: string
    timestamp?: string
  }>
  paging?: {
    cursors?: {
      after?: string
    }
  }
  error?: {
    message?: string
    code?: number
  }
}

export interface YouTubeVideosResponse {
  items?: Array<{
    id: {
      videoId: string
    }
    snippet?: {
      title?: string
      description?: string
      publishedAt?: string
      thumbnails?: {
        default?: { url: string }
        medium?: { url: string }
        high?: { url: string }
      }
    }
  }>
  nextPageToken?: string
  error?: {
    message?: string
    code?: number
  }
}

/**
 * Get TikTok videos for the current user
 */
export async function getTikTokVideos(maxCount = 20, cursor = 0): Promise<SocialVideo[]> {
  try {
    console.log('Fetching TikTok videos...')
    const response = await apiGet<TikTokVideosResponse>(`/tiktok/videos?max_count=${maxCount}&cursor=${cursor}`)
    console.log('TikTok API response:', response)
    
    if (response.error) {
      console.warn('TikTok API error:', response.error)
      return []
    }

    const videos = (response.data?.videos || []).map((video): SocialVideo => ({
      id: `tiktok-${video.id}`,
      url: video.embed_link || '#',
      thumbnail: video.cover_image_url,
      title: video.title,
      description: video.video_description,
      platform: 'tiktok',
      created_at: video.create_time ? new Date(video.create_time * 1000).toISOString() : undefined,
      duration: video.duration,
      view_count: video.view_count
    }))
    
    console.log(`Fetched ${videos.length} TikTok videos:`, videos)
    return videos
  } catch (error) {
    console.warn('Failed to fetch TikTok videos:', error)
    return []
  }
}

/**
 * Get Instagram videos for the current user
 */
export async function getInstagramVideos(limit = 25, after?: string): Promise<SocialVideo[]> {
  try {
    let endpoint = `/instagram/videos?limit=${limit}`
    if (after) {
      endpoint += `&after=${after}`
    }
    
    const response = await apiGet<InstagramVideosResponse>(endpoint)
    
    if (response.error) {
      console.warn('Instagram API error:', response.error)
      return []
    }

    return (response.data || [])
      .filter(video => video.media_type === 'VIDEO')
      .map((video): SocialVideo => ({
        id: `instagram-${video.id}`,
        url: video.media_url || '#',
        thumbnail: video.thumbnail_url,
        title: video.caption ? video.caption.substring(0, 100) + (video.caption.length > 100 ? '...' : '') : undefined,
        description: video.caption,
        platform: 'instagram',
        created_at: video.timestamp
      }))
  } catch (error) {
    console.warn('Failed to fetch Instagram videos:', error)
    return []
  }
}

/**
 * Get YouTube Shorts for the current user
 */
export async function getYouTubeVideos(maxResults = 25, pageToken?: string): Promise<SocialVideo[]> {
  try {
    let endpoint = `/youtube/videos?max_results=${maxResults}`
    if (pageToken) {
      endpoint += `&page_token=${pageToken}`
    }
    
    console.log('Fetching YouTube videos...')
    const response = await apiGet<YouTubeVideosResponse>(endpoint)
    console.log('YouTube API response:', response)
    
    if (response.error) {
      console.warn('YouTube API error:', response.error)
      return []
    }

    const videos = (response.items || []).map((video): SocialVideo => ({
      id: `youtube-${video.id.videoId}`,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      thumbnail: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url,
      title: video.snippet?.title,
      description: video.snippet?.description,
      platform: 'youtube',
      created_at: video.snippet?.publishedAt
    }))
    
    console.log(`Fetched ${videos.length} YouTube videos:`, videos)
    return videos
  } catch (error) {
    console.warn('Failed to fetch YouTube videos:', error)
    return []
  }
}

/**
 * Get all social media videos from all connected platforms
 */
export async function getAllSocialVideos(): Promise<SocialVideo[]> {
  const [tiktokVideos, instagramVideos, youtubeVideos] = await Promise.all([
    getTikTokVideos(),
    getInstagramVideos(), 
    getYouTubeVideos()
  ])

  // Combine and sort by creation date (newest first)
  const allVideos = [...tiktokVideos, ...instagramVideos, ...youtubeVideos]
  
  return allVideos.sort((a, b) => {
    if (!a.created_at && !b.created_at) return 0
    if (!a.created_at) return 1
    if (!b.created_at) return -1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}