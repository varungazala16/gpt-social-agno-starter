import { NotificationSettings, NotificationPreference } from '@/types'

const defaultPreferences: NotificationPreference[] = [
  {
    type: 'weekly_digest',
    label: 'Weekly Digest',
    description: 'Get a weekly summary of your performance',
    enabled: true,
  },
  {
    type: 'post_analytics',
    label: 'Post Analytics',
    description: 'Receive analytics when your posts reach milestones',
    enabled: true,
  },
  {
    type: 'creator_newsletter',
    label: 'The Creator Newsletter',
    description: 'Tips and insights for content creators',
    enabled: false,
  },
  {
    type: 'product_updates',
    label: 'Product Updates',
    description: 'Stay updated on new features and improvements',
    enabled: true,
  },
]

let currentPreferences = [...defaultPreferences]

export async function getNotificationSettings(): Promise<NotificationSettings> {
  await new Promise(resolve => setTimeout(resolve, 300))

  // Try to load from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('notification_settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        currentPreferences = parsed.preferences
      } catch {
        // Ignore parse errors
      }
    }
  }

  return { preferences: currentPreferences }
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300))
  currentPreferences = settings.preferences

  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('notification_settings', JSON.stringify(settings))
  }
}

export async function toggleNotification(type: import('@/types').NotificationType): Promise<NotificationSettings> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const preference = currentPreferences.find(p => p.type === type)
  if (preference) {
    preference.enabled = !preference.enabled
  }

  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('notification_settings', JSON.stringify({ preferences: currentPreferences }))
  }

  return { preferences: currentPreferences }
}
