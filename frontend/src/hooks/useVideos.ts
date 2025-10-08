import { useQuery } from '@tanstack/react-query'
import { getVideos } from '@/actions/video'

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const result = await getVideos()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch videos')
      }
      return result.videos || []
    },
  })
}
