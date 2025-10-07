'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, LogOut, Shield } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function UserProfile() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsAdmin(user?.user_metadata?.role === 'admin' || user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAdmin(session?.user?.user_metadata?.role === 'admin' || session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Admin</span>
        </button>
      )}
      
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-900 dark:text-white hidden sm:inline">
          {user.email}
        </span>
      </div>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </div>
  )
}
