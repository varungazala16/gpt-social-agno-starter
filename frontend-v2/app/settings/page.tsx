'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { SocialProfilesSection } from '@/components/settings/SocialProfilesSection'
import { AccountSection } from '@/components/settings/AccountSection'
import { SettingsList, SettingsListItem } from '@/components/settings/SettingsList'

export default function SettingsPage() {
  const router = useRouter()

  const preferencesItems: SettingsListItem[] = [
    {
      label: 'Notifications',
      href: '/settings/notifications',
    },
  ]

  const supportItems: SettingsListItem[] = [
    {
      label: 'Email a Founder',
      href: 'mailto:nikhil@gpt.social',
      external: true,
    },
    {
      label: 'Vote for New Features',
      href: 'https://insigh.to/b/socialgpt',
      external: true,
    },
    {
      label: 'Report a Bug',
      href: 'mailto:bugs@gpt.social',
      external: true,
    },
  ]

  const legalItems: SettingsListItem[] = [
    {
      label: 'Terms of Use',
      href: 'https://www.gpt.social/terms-of-service',
      external: true,
    },
    {
      label: 'Privacy Policy',
      href: 'https://www.gpt.social/privacy-policy',
      external: true,
    },
  ]

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
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-8">
          {/* Social Profiles */}
          <SocialProfilesSection />

          <Separator />

          {/* Account */}
          <AccountSection />

          <Separator />

          {/* Preferences */}
          <SettingsList title="Preferences" items={preferencesItems} />

          <Separator />

          {/* Support */}
          <SettingsList title="Support" items={supportItems} />

          <Separator />

          {/* Legal */}
          <SettingsList title="Legal" items={legalItems} />
        </div>
      </main>
    </div>
  )
}
