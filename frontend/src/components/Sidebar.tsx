'use client'

import { useState } from 'react'
import { Plus, Search, MessageSquare, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface ChatItem {
  id: string
  title: string
  date: string
}

const MOCK_CHATS: ChatItem[] = [
  { id: '1', title: 'Video editing tips', date: '2024-01-15' },
  { id: '2', title: 'Social media strategy', date: '2024-01-14' },
  { id: '3', title: 'Content calendar planning', date: '2024-01-12' },
  { id: '4', title: 'Analytics review', date: '2024-01-10' },
]

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = MOCK_CHATS.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300",
          "md:translate-x-0 md:static md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="complementary"
        aria-label="Chat history sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Chats
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button variant="primary" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search chat history"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-2" role="region" aria-label="Chat list">
            {/* Screen reader announcement for search results */}
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {searchQuery && `${filteredChats.length} chat${filteredChats.length !== 1 ? 's' : ''} found`}
            </div>

            {/* Recent Section */}
            <div className="mb-4">
              <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Previous 30 days
              </h3>
              <nav className="space-y-1" aria-label="Recent chats">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full flex items-start gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left focus-visible-ring"
                    aria-label={`Open chat: ${chat.title}`}
                  >
                    <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                        {chat.title}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Older Section */}
            {filteredChats.length === 0 && searchQuery && (
              <div className="px-2 py-8 text-center" role="status">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No chats found
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
