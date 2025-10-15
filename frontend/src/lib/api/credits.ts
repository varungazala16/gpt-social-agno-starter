import { apiGet, apiPost } from './client'

// Types
export interface CreditBalance {
  user_id: string
  balance: number
}

export interface TestResponse {
  message: string
  user_id: string
  operation?: string
}

/**
 * Get the current user's credit balance
 */
export async function getCreditBalance(): Promise<CreditBalance> {
  return apiGet<CreditBalance>('/credits/balance')
}

/**
 * Initialize credits for a user if not already initialized
 */
export async function initializeCredits(): Promise<CreditBalance> {
  return apiPost<CreditBalance>('/credits/initialize')
}

/**
 * Test the insufficient credits endpoint (always fails with 402)
 */
export async function testInsufficientCredits(): Promise<TestResponse> {
  return apiPost<TestResponse>('/credits/test-insufficient-credits')
}

/**
 * Test a small operation that requires 5 credits
 */
export async function testSmallOperation(): Promise<TestResponse> {
  return apiPost<TestResponse>('/credits/test-small-operation')
}

/**
 * Utility to detect if an API response suggests credits were consumed
 */
export function shouldInvalidateCredits(response: unknown): boolean {
  // You can expand this logic based on your API responses
  // For now, we'll be conservative and always invalidate after credit-consuming operations
  return true
}

/**
 * List of API endpoints that consume credits
 * Use this to automatically invalidate credits cache
 */
export const CREDIT_CONSUMING_ENDPOINTS = [
  '/credits/test-insufficient-credits',
  '/credits/test-small-operation',
  // Add other endpoints that consume credits here
  // '/ai/generate',
  // '/videos/process',
  // etc.
] as const