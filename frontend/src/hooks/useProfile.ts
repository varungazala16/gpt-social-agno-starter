import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Centralized query key for profile
export const PROFILE_QUERY_KEY = ['user', 'profile'] as const

export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
}

/**
 * Hook to manage user profile with optimized caching
 */
export function useProfile() {
  const queryClient = useQueryClient()

  // Query to get current user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery<UserProfile, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Get existing profile
      const { data: profile, error: selectError } = await supabase
        .from('user_profile')
        .select('id, name, email, avatar_url')
        .eq('id', user.id)
        .single()

      if (selectError) {
        throw new Error(`Failed to fetch profile: ${selectError.message}`)
      }

      return profile
    },
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true, // Refresh when user comes back to tab
    refetchOnMount: false, // Don't refetch if data exists and is fresh
    retry: 2
  })

  // Mutation to update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Pick<UserProfile, 'name' | 'email' | 'avatar_url'>>) => {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('user_profile')
        .update(updates)
        .eq('id', user.id)
        .select('id, name, email, avatar_url')
        .single()

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      return data
    },
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(PROFILE_QUERY_KEY, data)
    }
  })

  // Utility function to invalidate profile cache
  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
  }

  return {
    // Current profile data
    profile,
    name: profile?.name ?? null,
    email: profile?.email ?? null,
    avatarUrl: profile?.avatar_url ?? null,

    // Loading states
    isLoading,
    isUpdating: updateProfileMutation.isPending,

    // Error states
    error,
    updateError: updateProfileMutation.error,

    // Actions
    updateProfile: updateProfileMutation.mutate,
    refetchProfile: refetch,
    invalidateProfile, // Expose for other components to use
  }
}

/**
 * Utility hook to invalidate profile from anywhere in the app
 */
export function useInvalidateProfile() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
  }
}
