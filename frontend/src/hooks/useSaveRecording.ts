import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveRecording } from '@/actions/video'

export function useSaveRecording() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ blob, filename }: { blob: string; filename: string }) => {
      const result = await saveRecording(blob, filename)
      if (!result.success) {
        throw new Error(result.error || 'Failed to save recording')
      }
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch videos query after successful recording save
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}
