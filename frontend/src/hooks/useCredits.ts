import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Centralized query key for credits
export const CREDITS_QUERY_KEY = ['credits', 'balance'] as const

export interface CreditBalance {
  user_id: string
  balance: number
}

/**
 * Hook to manage user credits with optimized caching
 */
export function useCredits() {
  const queryClient = useQueryClient()

  // Query to get current credit balance with automatic initialization
  const {
    data: balance,
    isLoading,
    error,
    refetch
  } = useQuery<CreditBalance, Error>({
    queryKey: CREDITS_QUERY_KEY,
    queryFn: async () => {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Get existing credits
      const { data: credits, error: selectError } = await supabase
        .from('user_credits')
        .select('user_id, balance')
        .eq('user_id', user.id)
        .single()

      if (selectError) {
        throw new Error(`Failed to fetch credits: ${selectError.message}`)
      }

      return credits
    },
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes (credits don't change often)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true, // Refresh when user comes back to tab
    refetchOnMount: false, // Don't refetch if data exists and is fresh
    retry: 2
  })

  // Utility function to invalidate credits cache
  const invalidateCredits = () => {
    queryClient.invalidateQueries({ queryKey: CREDITS_QUERY_KEY })
  }

  return {
    // Current balance data
    balance: balance?.balance ?? null,
    userId: balance?.user_id,

    // Loading states
    isLoading,

    // Error states
    error,

    // Actions
    refetchBalance: refetch,
    invalidateCredits, // Expose for other components to use
  }
}

/**
 * Utility hook to invalidate credits from anywhere in the app
 * Use this after operations that consume credits
 */
export function useInvalidateCredits() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: CREDITS_QUERY_KEY })
  }
}