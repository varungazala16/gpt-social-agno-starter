'use client'

import { useRouter } from 'next/navigation'
import { User, LogOut, Shield, Settings, Sun, Moon, Monitor } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { CreditsDisplay } from '@/components/CreditsDisplay'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface UserProfileProps {
  variant?: 'mobile' | 'desktop'
}

export function UserProfile({ variant = 'mobile' }: UserProfileProps) {
  const { user, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!user) {
    return null
  }

  // Get user's initials or first letter of email
  const getUserInitial = () => {
    if (user.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase()
    }
    return user.email?.charAt(0).toUpperCase() || 'U'
  }

  // Cycle through themes: system → light → dark → system
  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('system')
    }
  }

  // Get theme icon and label
  const getThemeDisplay = () => {
    if (!mounted) return { icon: Monitor, label: 'System' }

    switch (theme) {
      case 'light':
        return { icon: Sun, label: 'Light' }
      case 'dark':
        return { icon: Moon, label: 'Dark' }
      default:
        return { icon: Monitor, label: 'System' }
    }
  }

  const themeDisplay = getThemeDisplay()
  const ThemeIcon = themeDisplay.icon

  // Desktop dropdown variant
  if (variant === 'desktop') {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {getUserInitial()}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* Credits Display */}
              <div className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <CreditsDisplay />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={cycleTheme}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ThemeIcon className="w-4 h-4" />
                <span>Theme: {themeDisplay.label}</span>
              </button>

              {/* Settings Button */}
              <button
                onClick={() => {
                  router.push('/settings')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              {/* Admin Button */}
              {isAdmin && (
                <button
                  onClick={() => {
                    router.push('/admin')
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}

              {/* Divider */}
              <div className="my-1 border-t border-gray-200 dark:border-gray-800"></div>

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Mobile expanded variant
  return (
    <div className="space-y-2">
      {/* User Info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
          {user.email}
        </span>
      </div>

      {/* Credits Display */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <CreditsDisplay />
      </div>

      {/* Theme Toggle */}
      <Button
        variant="outline"
        className="w-full justify-start gap-2 h-9"
        onClick={cycleTheme}
      >
        <ThemeIcon className="w-4 h-4" />
        <span>Theme: {themeDisplay.label}</span>
      </Button>

      {/* Settings Button */}
      <Button
        variant="outline"
        className="w-full justify-start gap-2 h-9"
        onClick={() => router.push('/settings')}
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </Button>

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
