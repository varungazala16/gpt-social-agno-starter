'use server'

import { writeFile, readdir, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function uploadVideo(formData: FormData) {
  try {
    await ensureUploadDir()
    
    const file = formData.get('video') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = join(UPLOAD_DIR, filename)

    await writeFile(filepath, buffer)
    
    return { 
      success: true, 
      filename,
      url: `/uploads/${filename}`
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Upload failed' }
  }
}

export async function saveRecording(blob: string, filename: string) {
  try {
    await ensureUploadDir()
    
    // Remove data URL prefix
    const base64Data = blob.replace(/^data:video\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    
    const timestamp = Date.now()
    const finalFilename = `${timestamp}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = join(UPLOAD_DIR, finalFilename)

    await writeFile(filepath, buffer)
    
    return { 
      success: true, 
      filename: finalFilename,
      url: `/uploads/${finalFilename}`
    }
  } catch (error) {
    console.error('Save recording error:', error)
    return { success: false, error: 'Failed to save recording' }
  }
}

export async function getVideos() {
  try {
    await ensureUploadDir()
    
    const files = await readdir(UPLOAD_DIR)
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
    
    const videos = files
      .filter(file => videoExtensions.some(ext => file.toLowerCase().endsWith(ext)))
      .map(filename => ({
        filename,
        url: `/uploads/${filename}`,
        uploadedAt: filename.split('-')[0] // timestamp from filename
      }))
      .sort((a, b) => parseInt(b.uploadedAt) - parseInt(a.uploadedAt))
    
    return { success: true, videos }
  } catch (error) {
    console.error('Get videos error:', error)
    return { success: false, error: 'Failed to fetch videos', videos: [] }
  }
}

export async function deleteVideo(filename: string) {
  try {
    const filepath = join(UPLOAD_DIR, filename)
    await unlink(filepath)
    return { success: true }
  } catch (error) {
    console.error('Delete video error:', error)
    return { success: false, error: 'Failed to delete video' }
  }
}
