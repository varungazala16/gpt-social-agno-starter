'use server'

import { createClient } from '@/lib/supabase/server'

export type PostStatus = 'draft' | 'scheduled' | 'posted'

export interface Post {
  id: string
  user_id: string
  status: PostStatus
  caption: string
  published: string | null
  assets: string[]
  created_at?: string
  updated_at?: string
}

export interface CreatePostInput {
  caption?: string
  status?: PostStatus
  published?: string | null
  assets?: string[]
}

export interface UpdatePostInput {
  caption?: string
  status?: PostStatus
  published?: string | null
  assets?: string[]
}

export async function createPost(input: CreatePostInput = {}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('post')
      .insert({
        user_id: user.id,
        caption: input.caption || '',
        status: input.status || 'draft',
        published: input.published || null,
        assets: input.assets || [],
      })
      .select()
      .single()

    if (error) {
      console.error('Create post error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, post: data as Post }
  } catch (error) {
    console.error('Create post error:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function getPosts() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated', posts: [] }
    }

    const { data, error } = await supabase
      .from('post')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get posts error:', error)
      return { success: false, error: error.message, posts: [] }
    }

    return { success: true, posts: (data as Post[]) || [] }
  } catch (error) {
    console.error('Get posts error:', error)
    return { success: false, error: 'Failed to fetch posts', posts: [] }
  }
}

export async function getFilteredPosts(filters?: {
  status?: PostStatus
  search?: string
  from?: string
  to?: string
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated', posts: [] }
    }

    let query = supabase
      .from('post')
      .select('*')
      .eq('user_id', user.id)

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    // Apply search filter (searches in caption)
    if (filters?.search) {
      query = query.ilike('caption', `%${filters.search}%`)
    }

    // Apply date range filters
    if (filters?.from) {
      query = query.gte('created_at', filters.from)
    }
    if (filters?.to) {
      query = query.lte('created_at', filters.to)
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Get filtered posts error:', error)
      return { success: false, error: error.message, posts: [] }
    }

    return { success: true, posts: (data as Post[]) || [] }
  } catch (error) {
    console.error('Get filtered posts error:', error)
    return { success: false, error: 'Failed to fetch posts', posts: [] }
  }
}

export async function getPost(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('post')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Get post error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, post: data as Post }
  } catch (error) {
    console.error('Get post error:', error)
    return { success: false, error: 'Failed to fetch post' }
  }
}

export async function updatePost(id: string, input: UpdatePostInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const updateData: Partial<Post> = {}
    if (input.caption !== undefined) updateData.caption = input.caption
    if (input.status !== undefined) updateData.status = input.status
    if (input.published !== undefined) updateData.published = input.published
    if (input.assets !== undefined) updateData.assets = input.assets

    const { data, error } = await supabase
      .from('post')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Update post error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, post: data as Post }
  } catch (error) {
    console.error('Update post error:', error)
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deletePost(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // First get the post to delete associated assets
    const { data: post, error: fetchError } = await supabase
      .from('post')
      .select('assets')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      console.error('Fetch post error:', fetchError)
      return { success: false, error: fetchError.message }
    }

    // Delete associated videos from storage
    if (post?.assets && post.assets.length > 0) {
      const filesToDelete = post.assets.filter((asset: string) => asset.startsWith(user.id + '/'))
      if (filesToDelete.length > 0) {
        await supabase.storage.from('videos').remove(filesToDelete)
      }
    }

    // Delete the post
    const { error } = await supabase
      .from('post')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Delete post error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete post error:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}

export async function addVideoToPost(postId: string, videoPath: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get current post
    const { data: post, error: fetchError } = await supabase
      .from('post')
      .select('assets')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      console.error('Fetch post error:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const currentAssets = post?.assets || []
    const updatedAssets = [...currentAssets, videoPath]

    const { data, error } = await supabase
      .from('post')
      .update({ assets: updatedAssets })
      .eq('id', postId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Add video to post error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, post: data as Post }
  } catch (error) {
    console.error('Add video to post error:', error)
    return { success: false, error: 'Failed to add video to post' }
  }
}

export async function removeVideoFromPost(postId: string, videoPath: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get current post
    const { data: post, error: fetchError } = await supabase
      .from('post')
      .select('assets')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      console.error('Fetch post error:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const currentAssets = post?.assets || []
    const updatedAssets = currentAssets.filter((asset: string) => asset !== videoPath)

    const { data, error } = await supabase
      .from('post')
      .update({ assets: updatedAssets })
      .eq('id', postId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Remove video from post error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, post: data as Post }
  } catch (error) {
    console.error('Remove video from post error:', error)
    return { success: false, error: 'Failed to remove video from post' }
  }
}
