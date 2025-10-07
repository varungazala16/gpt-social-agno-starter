import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(() => []),
  })),
}))

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(async () => ({
          error: null,
        })),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: 'https://example.com/test.mp4' },
        })),
        list: vi.fn(async () => ({
          data: [],
          error: null,
        })),
        remove: vi.fn(async () => ({
          error: null,
        })),
      })),
    },
  })),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: null },
        error: null,
      })),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
      signOut: vi.fn(async () => ({
        error: null,
      })),
    },
  })),
}))
