import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadVideo } from '@/actions/video'

export function useUploadVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await uploadVideo(formData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload video')
      }
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch videos query after successful upload
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}
