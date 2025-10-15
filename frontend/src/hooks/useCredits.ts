import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCreditBalance, testInsufficientCredits, testSmallOperation, initializeCredits, type CreditBalance } from '@/lib/api/credits'
import { APIError } from '@/lib/api/client'
import { HttpStatus } from '@/lib/http-status'
import { useToast } from './use-toast'

// Centralized query key for credits
export const CREDITS_QUERY_KEY = ['credits', 'balance'] as const

/**
 * Hook to manage user credits with optimized caching
 */
export function useCredits() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query to get current credit balance with automatic initialization
  const {
    data: balance,
    isLoading,
    error,
    refetch
  } = useQuery<CreditBalance, APIError>({
    queryKey: CREDITS_QUERY_KEY,
    queryFn: async () => {
      try {
        return await getCreditBalance()
      } catch (error: any) {
        // If we get a server error, try to initialize credits first
        if (error.status >= 500) {
          try {
            return await initializeCredits()
          } catch (initError) {
            // If initialization fails, throw the original error
            throw error
          }
        }
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes (credits don't change often)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true, // Refresh when user comes back to tab
    refetchOnMount: false, // Don't refetch if data exists and is fresh
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.status === HttpStatus.UNAUTHORIZED) return false
      return failureCount < 2
    }
  })

  // Mutation for testing insufficient credits
  const testMutation = useMutation({
    mutationKey: ['credits', 'test-insufficient-credits'],
    mutationFn: testInsufficientCredits,
    onError: (error: APIError) => {
      // This should always fail with PAYMENT_REQUIRED, which is expected behavior
      if (error.status === HttpStatus.PAYMENT_REQUIRED) {
        // Payment modal will be shown automatically by the global handler
        toast({
          variant: 'destructive',
          title: 'Insufficient Credits (Expected!)',
          description: 'Payment modal should appear automatically.',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Test Failed',
          description: error.message,
        })
      }
    },
    onSuccess: () => {
      // This shouldn't happen, but just in case
      toast({
        title: 'Unexpected Success',
        description: 'The test endpoint somehow succeeded!',
      })
    },
    onSettled: () => {
      // Always invalidate credits after any attempt
      invalidateCredits()
    }
  })

  // Mutation for testing small operation (5 credits)
  const smallTestMutation = useMutation({
    mutationKey: ['credits', 'test-small-operation'],
    mutationFn: testSmallOperation,
    onError: (error: APIError) => {
      console.log('Small test mutation error:', error)
      if (error.status === HttpStatus.PAYMENT_REQUIRED) {
        // Payment modal will be shown automatically by the global handler
        toast({
          variant: 'destructive',
          title: 'Insufficient Credits',
          description: 'You need more credits to perform this operation.',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Operation Failed',
          description: error.message,
        })
      }
    },
    onSuccess: (data) => {
      console.log('Small test mutation success:', data)
      toast({
        title: 'Success!',
        description: data.message,
      })
    },
    onMutate: () => {
      console.log('Small test mutation starting...')
    },
    onSettled: () => {
      console.log('Small test mutation settled')
      // Always invalidate credits after any attempt
      invalidateCredits()
    }
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
    isTestLoading: testMutation.isPending,
    isSmallTestLoading: smallTestMutation.isPending,
    
    // Error states
    error,
    testError: testMutation.error,
    smallTestError: smallTestMutation.error,
    
    // Actions
    refetchBalance: refetch,
    invalidateCredits, // Expose for other components to use
    testInsufficientCredits: () => {
      if (!testMutation.isPending) {
        testMutation.mutate()
      }
    },
    testSmallOperation: () => {
      if (!smallTestMutation.isPending) {
        smallTestMutation.mutate()
      }
    },
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