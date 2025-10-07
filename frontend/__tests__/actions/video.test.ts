import { describe, it, expect } from 'vitest'

describe('Video Actions', () => {
  describe('uploadVideo', () => {
    it('should validate file presence', async () => {
      const formData = new FormData()
      
      const { uploadVideo } = await import('@/actions/video')
      const result = await uploadVideo(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('No file provided')
    })

    it('should return an object with success property', async () => {
      const formData = new FormData()
      
      const { uploadVideo } = await import('@/actions/video')
      const result = await uploadVideo(formData)

      expect(result).toHaveProperty('success')
      expect(typeof result.success).toBe('boolean')
    })
  })

  describe('getVideos', () => {
    it('should return an object with success and videos properties', async () => {
      const { getVideos } = await import('@/actions/video')
      const result = await getVideos()

      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('videos')
      expect(typeof result.success).toBe('boolean')
      expect(Array.isArray(result.videos)).toBe(true)
    })
  })

  describe('deleteVideo', () => {
    it('should return an object with success property', async () => {
      const { deleteVideo } = await import('@/actions/video')
      const result = await deleteVideo('non-existent-file.mp4')

      expect(result).toHaveProperty('success')
      expect(typeof result.success).toBe('boolean')
    })
  })
})
