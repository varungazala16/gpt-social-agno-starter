'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getConnectedAccounts,
  initiateConnection,
  disconnectAccount,
  type Platform,
  type SocialAccount,
  type SocialAccountListResponse,
} from '@/lib/api/social-accounts'
import { APIError } from '@/lib/api/client'

const QUERY_KEY = ['social-accounts']

/**
 * Hook to fetch connected social accounts
 */
export function useSocialAccounts() {
  return useQuery<SocialAccountListResponse, APIError>({
    queryKey: QUERY_KEY,
    queryFn: getConnectedAccounts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to initiate OAuth connection for a platform
 */
export function useConnectAccount() {
  return useMutation<void, APIError, Platform>({
    mutationFn: async (platform: Platform) => {
      // Store platform in sessionStorage to handle callback
      sessionStorage.setItem('connecting_platform', platform)

      // Get authorization URL and redirect
      const { authorization_url } = await initiateConnection(platform)
      window.location.href = authorization_url
    },
    onError: (error) => {
      // Clean up on error
      sessionStorage.removeItem('connecting_platform')
      console.error('Failed to initiate connection:', error)
    },
  })
}

/**
 * Hook to disconnect a social account
 */
export function useDisconnectAccount() {
  const queryClient = useQueryClient()

  return useMutation<void, APIError, Platform>({
    mutationFn: async (platform: Platform) => {
      await disconnectAccount(platform)
    },
    onSuccess: () => {
      // Refetch accounts after successful disconnect
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

/**
 * Hook to check if a specific platform is connected
 */
export function useIsPlatformConnected(platform: Platform) {
  const { data } = useSocialAccounts()
  return data?.accounts.some(account => account.platform === platform) ?? false
}

/**
 * Hook to get a specific platform account
 */
export function usePlatformAccount(platform: Platform): SocialAccount | undefined {
  const { data } = useSocialAccounts()
  return data?.accounts.find(account => account.platform === platform)
}

/**
 * Hook to refetch accounts (useful after OAuth callback)
 */
export function useRefetchAccounts() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: QUERY_KEY })
}
