import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteVideo } from '@/actions/video'

interface Video {
  filename: string
  url: string
  uploadedAt: string
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (filename: string) => {
      const result = await deleteVideo(filename)
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete video')
      }
      return result
    },
    // Optimistic update: immediately remove video from UI
    onMutate: async (filename: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['videos'] })

      // Snapshot the previous value
      const previousVideos = queryClient.getQueryData<Video[]>(['videos'])

      // Optimistically update to the new value
      queryClient.setQueryData<Video[]>(['videos'], (old) =>
        old ? old.filter((v) => v.filename !== filename) : []
      )

      // Return context with the snapshotted value
      return { previousVideos }
    },
    // If mutation fails, rollback to the previous value
    onError: (_err, _filename, context) => {
      if (context?.previousVideos) {
        queryClient.setQueryData(['videos'], context.previousVideos)
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}
