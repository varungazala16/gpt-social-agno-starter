'use client'

import Link from 'next/link'
import { Menu, Settings, User } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'

interface HeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export default function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus-visible-ring"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="md:hidden"
                aria-label="Toggle menu"
                aria-expanded="false"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <Link href="/" className="flex items-center gap-2 focus-visible-ring rounded-md">
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                GPT.Social
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <Link
              href="/videos"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors focus-visible-ring rounded px-1"
            >
              Videos
            </Link>
            <Link
              href="/studio"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors focus-visible-ring rounded px-1"
            >
              Studio
            </Link>
            <Link
              href="/library"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors focus-visible-ring rounded px-1"
            >
              Library
            </Link>
          </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
