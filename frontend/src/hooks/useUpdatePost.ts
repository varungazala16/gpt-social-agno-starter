import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePost, type UpdatePostInput } from '@/actions/post'
import { useToast } from './use-toast'

export function useUpdatePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdatePostInput }) => {
      const result = await updatePost(id, input)
      if (!result.success) {
        throw new Error(result.error || 'Failed to update post')
      }
      return result.post
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] })
      toast({
        title: 'Success',
        description: 'Post updated successfully',
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
