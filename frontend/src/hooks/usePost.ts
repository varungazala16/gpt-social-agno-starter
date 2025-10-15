import { useQuery } from '@tanstack/react-query'
import { getPost, type Post } from '@/actions/post'

export function usePost(id: string | null) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async (): Promise<Post | null> => {
      if (!id) return null

      const result = await getPost(id)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch post')
      }
      return result.post || null
    },
    enabled: !!id,
  })
}
