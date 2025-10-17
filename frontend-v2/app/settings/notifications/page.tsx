'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { NotificationSettings } from '@/types'
import { getNotificationSettings, toggleNotification } from '@/lib/api/mock-notifications'

export default function NotificationsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setIsLoading(true)
    try {
      const data = await getNotificationSettings()
      setSettings(data)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggle(type: import('@/types').NotificationType) {
    const updated = await toggleNotification(type)
    setSettings(updated)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Email Notifications Section */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Email Notifications
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose which emails you'd like to receive from SocialGPT
              </p>
            </div>

            {isLoading ? (
              <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
                Loading preferences...
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {settings?.preferences.map((preference, index) => {
                  const isLast = index === settings.preferences.length - 1

                  return (
                    <div key={preference.type}>
                      <div className="flex items-start justify-between gap-4 px-4 py-4">
                        <div className="flex-1">
                          <div className="font-semibold text-foreground mb-1">
                            {preference.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {preference.description}
                          </div>
                        </div>
                        <Switch
                          checked={preference.enabled}
                          onCheckedChange={() => handleToggle(preference.type)}
                        />
                      </div>
                      {!isLast && <Separator />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
