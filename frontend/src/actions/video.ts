'use server'

import { createClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'videos'

export async function uploadVideo(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const file = formData.get('video') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename with user ID
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${user.id}/${timestamp}-${sanitizedName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename)

    return {
      success: true,
      filename,
      url: publicUrl,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Upload failed' }
  }
}

export async function saveRecording(blob: string, filename: string) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Remove data URL prefix
    const base64Data = blob.replace(/^data:video\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const timestamp = Date.now()
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const finalFilename = `${user.id}/${timestamp}-${sanitizedName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(finalFilename, buffer, {
        contentType: 'video/webm',
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(finalFilename)

    return {
      success: true,
      filename: finalFilename,
      url: publicUrl,
    }
  } catch (error) {
    console.error('Save recording error:', error)
    return { success: false, error: 'Failed to save recording' }
  }
}

export async function getVideos() {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated', videos: [] }
    }

    // List files in user's folder
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(user.id, {
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('Get videos error:', error)
      return { success: false, error: error.message, videos: [] }
    }

    const videos = files.map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${user.id}/${file.name}`)

      return {
        filename: `${user.id}/${file.name}`,
        url: publicUrl,
        uploadedAt: file.created_at || '',
      }
    })

    return { success: true, videos }
  } catch (error) {
    console.error('Get videos error:', error)
    return { success: false, error: 'Failed to fetch videos', videos: [] }
  }
}

export async function deleteVideo(filename: string) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Only allow deleting own files
    if (!filename.startsWith(user.id + '/')) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filename])

    if (error) {
      console.error('Delete video error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete video error:', error)
    return { success: false, error: 'Failed to delete video' }
  }
}

