import { useQuery } from '@tanstack/react-query'
import { getVideos } from '@/actions/video'
import { getAllSocialVideos, type SocialVideo } from '@/lib/api/social-videos'

// Unified video type that works with both local and social videos
export interface UnifiedVideo {
  id: string
  filename?: string // For local videos
  url: string
  uploadedAt?: string // For local videos
  created_at?: string // For social videos
  platform?: 'local' | 'tiktok' | 'instagram' | 'youtube'
  thumbnail?: string
  title?: string
  description?: string
  duration?: number
  view_count?: number
}

export function useAllVideos() {
  return useQuery({
    queryKey: ['all-videos'],
    queryFn: async (): Promise<UnifiedVideo[]> => {
      // Fetch both local and social videos in parallel
      const [localResult, socialVideos] = await Promise.all([
        getVideos(),
        getAllSocialVideos()
      ])

      const allVideos: UnifiedVideo[] = []

      // Add local videos
      if (localResult.success && localResult.videos) {
        const localVideos: UnifiedVideo[] = localResult.videos.map(video => ({
          id: `local-${video.filename}`,
          filename: video.filename,
          url: video.url,
          uploadedAt: video.uploadedAt,
          platform: 'local' as const,
          // Extract title from filename (remove timestamp and user ID)
          title: video.filename.split('/').pop()?.replace(/^\d+-/, '') || 'Uploaded Video'
        }))
        allVideos.push(...localVideos)
      }

      // Add social videos
      const socialUnified: UnifiedVideo[] = socialVideos.map(video => ({
        id: video.id,
        url: video.url,
        created_at: video.created_at,
        platform: video.platform,
        thumbnail: video.thumbnail,
        title: video.title,
        description: video.description,
        duration: video.duration,
        view_count: video.view_count
      }))
      allVideos.push(...socialUnified)

      // Sort by date (newest first) - use uploadedAt for local, created_at for social
      return allVideos.sort((a, b) => {
        const aDate = a.uploadedAt ? new Date(parseInt(a.uploadedAt)).getTime() 
                     : a.created_at ? new Date(a.created_at).getTime()
                     : 0
        const bDate = b.uploadedAt ? new Date(parseInt(b.uploadedAt)).getTime()
                     : b.created_at ? new Date(b.created_at).getTime() 
                     : 0
        return bDate - aDate
      })
    },
  })
}