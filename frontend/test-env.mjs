// Quick test to see if Vitest loads .env automatically
import { describe, test, expect } from 'vitest'

describe('Env Loading Test', () => {
  test('should load NEXT_PUBLIC_SUPABASE_URL from .env.local', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
  })
})
