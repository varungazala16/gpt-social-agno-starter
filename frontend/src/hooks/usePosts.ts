import { useQuery } from '@tanstack/react-query'
import { getPosts, type Post } from '@/actions/post'

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      const result = await getPosts()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch posts')
      }
      return result.posts
    },
  })
}
