'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRefetchAccounts } from '@/hooks/useSocialAccounts'

export function OAuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refetchAccounts = useRefetchAccounts()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const platform = sessionStorage.getItem('connecting_platform')

    if (code && state && platform) {
      // OAuth callback was successful, refetch accounts
      refetchAccounts()

      // Clean up
      sessionStorage.removeItem('connecting_platform')

      // Remove query params from URL
      router.replace('/settings')
    }
  }, [searchParams, refetchAccounts, router])

  return null
}
