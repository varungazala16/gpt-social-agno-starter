import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, type CreatePostInput } from '@/actions/post'
import { useToast } from './use-toast'

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const result = await createPost(input)
      if (!result.success) {
        throw new Error(result.error || 'Failed to create post')
      }
      return result.post
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast({
        title: 'Success',
        description: 'Post created successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}
