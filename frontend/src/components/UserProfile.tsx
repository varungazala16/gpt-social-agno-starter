'use client'

import { useRouter } from 'next/navigation'
import { User, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export function UserProfile() {
  const { user, isAdmin, signOut } = useAuth()
  const router = useRouter()

  if (!user) {
    return null
  }

  return (
    <div className="space-y-2">
      {/* User Info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
          {user.email}
        </span>
      </div>

      {/* Admin Button */}
      {isAdmin && (
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-9 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950"
          onClick={() => router.push('/admin')}
        >
          <Shield className="w-4 h-4" />
          <span>Admin</span>
        </Button>
      )}

      {/* Sign Out Button */}
      <Button
        variant="outline"
        className="w-full justify-start gap-2 h-9 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
        onClick={signOut}
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </Button>
    </div>
  )
}
