'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { useAuth } from '@/context/AuthContext'
import {
  User,
  Link2,
  CreditCard,
  Bell,
  AlertTriangle,
  Check,
  ExternalLink,
  Instagram,
  Youtube
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [emailAddress] = useState(user?.email || '')
  const isGoogleAuth = user?.app_metadata?.provider === 'google'

  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState({
    instagram: { connected: true, username: '@sarahcontent' },
    tiktok: { connected: false, username: null },
    youtube: { connected: true, username: 'Sarah Content Creator' }
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    postReminders: true,
    analyticsUpdates: true,
    tipsAndBestPractices: false
  })

  const handleSaveProfile = async () => {
    // TODO: Implement profile update
    console.log('Saving profile:', { fullName, emailAddress })
  }

  const handleConnectAccount = (platform: string) => {
    // TODO: Implement OAuth connection
    console.log('Connecting:', platform)
  }

  const handleDisconnectAccount = (platform: string) => {
    // TODO: Implement disconnect
    setConnectedAccounts(prev => ({
      ...prev,
      [platform]: { connected: false, username: null }
    }))
  }

  const handleChangePlan = () => {
    // TODO: Implement Stripe plan change
    console.log('Opening Stripe plan change')
  }

  const handleUpdatePayment = () => {
    // TODO: Implement Stripe payment update
    console.log('Opening Stripe payment update')
  }

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion with confirmation
    console.log('Deleting account')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-gray-950 max-w-3xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage your account, connected platforms, and billing preferences
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              <p className="text-sm text-gray-400">Update your personal details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  placeholder="Sarah Johnson"
                />
                {fullName !== user?.user_metadata?.full_name && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-red-600 text-white rounded">
                    Edit
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={emailAddress}
                disabled={isGoogleAuth}
                className={cn(
                  "w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white outline-none",
                  isGoogleAuth ? "opacity-60 cursor-not-allowed" : "focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                )}
                placeholder="sarah.johnson@email.com"
              />
              {isGoogleAuth && (
                <p className="mt-2 text-xs text-gray-500">
                  Email cannot be changed for Google authenticated accounts
                </p>
              )}
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Link2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Connected Accounts</h3>
              <p className="text-sm text-gray-400">Link your social media platforms to publish directly</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Instagram */}
            <div className="flex items-center justify-between p-4 bg-gray-950 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Instagram</span>
                    {connectedAccounts.instagram.connected && (
                      <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-400 rounded-full border border-green-600/30">
                        ✓ Connected
                      </span>
                    )}
                  </div>
                  {connectedAccounts.instagram.connected && (
                    <p className="text-sm text-gray-400">{connectedAccounts.instagram.username}</p>
                  )}
                </div>
              </div>
              {connectedAccounts.instagram.connected ? (
                <button
                  onClick={() => handleDisconnectAccount('instagram')}
                  className="px-4 py-2 text-sm text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnectAccount('instagram')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>

            {/* TikTok */}
            <div className="flex items-center justify-between p-4 bg-gray-950 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-white">TikTok</span>
                </div>
              </div>
              <button
                onClick={() => handleConnectAccount('tiktok')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Connect
              </button>
            </div>

            {/* YouTube Shorts */}
            <div className="flex items-center justify-between p-4 bg-gray-950 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600 rounded-lg">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">YouTube Shorts</span>
                    {connectedAccounts.youtube.connected && (
                      <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-400 rounded-full border border-green-600/30">
                        ✓ Connected
                      </span>
                    )}
                  </div>
                  {connectedAccounts.youtube.connected && (
                    <p className="text-sm text-gray-400">{connectedAccounts.youtube.username}</p>
                  )}
                </div>
              </div>
              {connectedAccounts.youtube.connected ? (
                <button
                  onClick={() => handleDisconnectAccount('youtube')}
                  className="px-4 py-2 text-sm text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnectAccount('youtube')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Billing & Subscription */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Billing & Subscription</h3>
              <p className="text-sm text-gray-400">Manage your subscription and payment methods</p>
            </div>
          </div>

          {/* Current Plan */}
          <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-white">Pro Plan</span>
                <span className="px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                  Active
                </span>
              </div>
              <button
                onClick={handleChangePlan}
                className="px-4 py-2 text-sm bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Change Plan
              </button>
            </div>
            <p className="text-sm text-gray-300 mb-3">$29/month • Billed monthly</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>Unlimited posts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>AI analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-green-400" />
                <span>3 platforms</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Payment Method</h4>
            <div className="flex items-center justify-between p-4 bg-gray-950 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-400">Expires 12/25</p>
                </div>
              </div>
              <button
                onClick={handleUpdatePayment}
                className="px-4 py-2 text-sm text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Update
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Billing History</h4>
              <button className="text-sm text-purple-400 hover:text-purple-300">
                View All
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-gray-800">
                <div>
                  <p className="text-sm font-medium text-white">Oct 1, 2025</p>
                  <p className="text-xs text-gray-400">Pro Plan</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">$29.00</span>
                  <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-400 rounded">
                    Paid
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-gray-800">
                <div>
                  <p className="text-sm font-medium text-white">Sep 1, 2025</p>
                  <p className="text-xs text-gray-400">Pro Plan</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">$29.00</span>
                  <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-400 rounded">
                    Paid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <p className="text-sm text-gray-400">Choose what notifications you want to receive</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Post Reminders</p>
                <p className="text-xs text-gray-400">Get notified when it&apos;s time to record or post</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, postReminders: !prev.postReminders }))}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  notifications.postReminders ? "bg-white" : "bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-black rounded-full transition-transform",
                    notifications.postReminders ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Analytics Updates</p>
                <p className="text-xs text-gray-400">Weekly summaries of your content performance</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, analyticsUpdates: !prev.analyticsUpdates }))}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  notifications.analyticsUpdates ? "bg-white" : "bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-black rounded-full transition-transform",
                    notifications.analyticsUpdates ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Tips & Best Practices</p>
                <p className="text-xs text-gray-400">Get content creation tips and improvement suggestions</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, tipsAndBestPractices: !prev.tipsAndBestPractices }))}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  notifications.tipsAndBestPractices ? "bg-white" : "bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-black rounded-full transition-transform",
                    notifications.tipsAndBestPractices ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/30 rounded-lg border border-red-800/50 p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
              <p className="text-sm text-gray-400">Irreversible actions that affect your account</p>
            </div>
          </div>

          <div className="p-4 bg-gray-950/50 rounded-lg border border-red-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Delete Account</p>
                <p className="text-xs text-gray-400">Permanently delete your account and all your data</p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
