import { apiGet, apiDelete } from './client'

export type Platform = 'instagram' | 'tiktok' | 'youtube'

export interface SocialAccount {
  id: string
  user_id: string
  platform: Platform
  platform_user_id: string
  platform_username: string
  scopes: string[]
  token_expires_at: string | null
  platform_metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SocialAccountListResponse {
  accounts: SocialAccount[]
  total: number
}

export interface OAuthAuthorizeResponse {
  authorization_url: string
  state: string
}

export interface OAuthCallbackResponse {
  success: boolean
  message: string
  account: SocialAccount
}

export interface DisconnectResponse {
  success: boolean
  message: string
}

/**
 * Get all connected social accounts for the current user
 */
export async function getConnectedAccounts(): Promise<SocialAccountListResponse> {
  return apiGet<SocialAccountListResponse>('/connections')
}

/**
 * Initiate OAuth flow for a platform
 * Returns the authorization URL to redirect the user to
 */
export async function initiateConnection(platform: Platform): Promise<OAuthAuthorizeResponse> {
  return apiGet<OAuthAuthorizeResponse>(`/${platform}/oauth2/authorize`)
}

/**
 * Disconnect a social account
 */
export async function disconnectAccount(platform: Platform): Promise<DisconnectResponse> {
  return apiDelete<DisconnectResponse>(`/${platform}/account`)
}

/**
 * Get a specific platform account
 */
export async function getPlatformAccount(platform: Platform): Promise<SocialAccount> {
  return apiGet<SocialAccount>(`/${platform}/account`)
}

/**
 * Helper to check if a platform is connected
 */
export function isPlatformConnected(accounts: SocialAccount[], platform: Platform): boolean {
  return accounts.some(account => account.platform === platform)
}

/**
 * Helper to get a specific platform account from the list
 */
export function getPlatformFromList(accounts: SocialAccount[], platform: Platform): SocialAccount | undefined {
  return accounts.find(account => account.platform === platform)
}
