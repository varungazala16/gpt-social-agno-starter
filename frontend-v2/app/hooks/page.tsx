'use client'

import { useState, useEffect } from 'react'
import { AccountSelector } from '@/components/AccountSelector'
import { HookCard } from '@/components/hooks/HookCard'
import { Hook } from '@/types'
import {
  getTodaysHook,
  getSuggestedHooks,
  getSavedHooks,
  dismissHook as dismissHookApi,
  toggleSaveHook,
} from '@/lib/api/mock-hooks'

type TabType = 'suggested' | 'saved'

export default function HooksPage() {
  const [todaysHook, setTodaysHook] = useState<Hook | null>(null)
  const [suggestedHooks, setSuggestedHooks] = useState<Hook[]>([])
  const [savedHooks, setSavedHooks] = useState<Hook[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('suggested')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHooks()
  }, [])

  async function loadHooks() {
    setIsLoading(true)
    try {
      const [today, suggested, saved] = await Promise.all([
        getTodaysHook(),
        getSuggestedHooks(),
        getSavedHooks(),
      ])
      setTodaysHook(today)
      setSuggestedHooks(suggested)
      setSavedHooks(saved)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDismiss() {
    const nextHook = await dismissHookApi()
    setTodaysHook(nextHook)
  }

  async function handleToggleSave(hookId: string) {
    await toggleSaveHook(hookId)
    await loadHooks()
  }

  const displayedHooks = activeTab === 'suggested' ? suggestedHooks : savedHooks

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Hooks</h1>
          <AccountSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-3xl">
        {/* Today's Hook Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Today&apos;s Hook</h2>
          {isLoading ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
              Loading hook...
            </div>
          ) : todaysHook ? (
            <HookCard
              hook={todaysHook}
              onDismiss={handleDismiss}
              onToggleSave={handleToggleSave}
              defaultExpanded={true}
            />
          ) : null}
        </div>

        {/* All Hooks Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">All Hooks</h2>

            {/* Tab Toggle */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setActiveTab('suggested')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === 'suggested'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Suggested
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === 'saved'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Saved
              </button>
            </div>
          </div>

          {/* Hook List */}
          {isLoading ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
              Loading hooks...
            </div>
          ) : displayedHooks.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                {activeTab === 'saved'
                  ? 'No saved hooks yet. Bookmark hooks to save them for later!'
                  : 'No hooks available'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedHooks.map((hook) => (
                <HookCard
                  key={hook.id}
                  hook={hook}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
