'use client'

import { useRouter } from 'next/navigation'
import { User, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function UserProfile() {
  const { user, isAdmin, signOut } = useAuth()
  const router = useRouter()

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
        onClick={signOut}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </div>
  )
}
