import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '@/actions/post'
import { useToast } from './use-toast'

export function useDeletePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePost(id)
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete post')
      }
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
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
