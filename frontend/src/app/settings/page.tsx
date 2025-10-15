'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { OAuthCallbackHandler } from '@/components/OAuthCallbackHandler'
import {
  User,
  Link2,
  CreditCard,
  Bell,
  AlertTriangle,
  Check,
  ExternalLink,
  Instagram,
  Youtube,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { useSocialAccounts, useConnectAccount, useDisconnectAccount } from '@/hooks/useSocialAccounts'
import type { Platform } from '@/lib/api/social-accounts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [fullName] = useState(user?.user_metadata?.full_name || '')
  const [emailAddress] = useState(user?.email || '')
  const isGoogleAuth = user?.app_metadata?.provider === 'google'

  // Social accounts hooks
  const { data: accountsData, isLoading: isLoadingAccounts, error: accountsError } = useSocialAccounts()
  const connectAccount = useConnectAccount()
  const disconnectAccount = useDisconnectAccount()

  // Track which platform is being connected/disconnected
  const [pendingPlatform, setPendingPlatform] = useState<Platform | null>(null)

  // Notifications state
  const [notifications, setNotifications] = useState({
    postReminders: true,
    analyticsUpdates: true,
    tipsAndBestPractices: false
  })

  const handleSaveProfile = async () => {
    console.log('Saving profile:', { fullName, emailAddress })
  }

  const handleConnectAccount = (platform: Platform) => {
    setPendingPlatform(platform)
    connectAccount.mutate(platform, {
      onSettled: () => setPendingPlatform(null)
    })
  }

  const handleDisconnectAccount = (platform: Platform) => {
    setPendingPlatform(platform)
    disconnectAccount.mutate(platform, {
      onSettled: () => setPendingPlatform(null)
    })
  }

  const isPlatformConnected = (platform: Platform) => {
    return accountsData?.accounts.some(acc => acc.platform === platform) ?? false
  }

  const getPlatformUsername = (platform: Platform) => {
    return accountsData?.accounts.find(acc => acc.platform === platform)?.platform_username
  }

  const handleChangePlan = () => {
    console.log('Opening Stripe plan change')
  }

  const handleUpdatePayment = () => {
    console.log('Opening Stripe payment update')
  }

  const handleDeleteAccount = async () => {
    console.log('Deleting account')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* OAuth callback handler */}
      <Suspense fallback={null}>
        <OAuthCallbackHandler />
      </Suspense>

      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground mt-2">
              Manage your account, connected platforms, and billing preferences
            </p>
          </div>

          {/* Profile Information */}
          <Card className="border-white/10 bg-[#1a1a1a]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <User className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4" suppressHydrationWarning>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-normal">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  readOnly
                  placeholder="Sarah Johnson"
                  className="bg-black/40 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-normal">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailAddress}
                  readOnly
                  disabled={isGoogleAuth}
                  placeholder="sarah.johnson@email.com"
                  className="bg-black/40 border-white/10"
                />
                {isGoogleAuth && (
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed for Google authenticated accounts
                  </p>
                )}
              </div>

              <Button onClick={handleSaveProfile} className="bg-white text-black hover:bg-white/90">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card className="border-white/10 bg-[#1a1a1a]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Link2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Link your social media platforms to publish directly</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingAccounts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : accountsError ? (
                <div className="p-4 border border-destructive bg-destructive/10 rounded-lg">
                  <p className="text-sm text-destructive">Failed to load connected accounts</p>
                  <p className="text-xs text-muted-foreground mt-1">{accountsError.message}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Instagram */}
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                        <Instagram className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Instagram</span>
                          {isPlatformConnected('instagram') && (
                            <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-500 rounded-full">
                              ✓ Connected
                            </span>
                          )}
                        </div>
                        {isPlatformConnected('instagram') && (
                          <p className="text-sm text-muted-foreground">{getPlatformUsername('instagram')}</p>
                        )}
                      </div>
                    </div>
                    {isPlatformConnected('instagram') ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50" disabled={pendingPlatform === 'instagram'}>
                            {pendingPlatform === 'instagram' ? 'Disconnecting...' : 'Disconnect'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Disconnect Instagram?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to disconnect your Instagram account <strong>@{getPlatformUsername('instagram')}</strong>? You won&apos;t be able to publish to Instagram until you reconnect.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-white/10">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDisconnectAccount('instagram')} className="bg-red-600 text-white hover:bg-red-700">
                              Disconnect
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10"
                        onClick={() => handleConnectAccount('instagram')}
                        disabled={pendingPlatform === 'instagram'}
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        {pendingPlatform === 'instagram' ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </div>

                  {/* TikTok */}
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                        <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">TikTok</span>
                          {isPlatformConnected('tiktok') && (
                            <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-500 rounded-full">
                              ✓ Connected
                            </span>
                          )}
                        </div>
                        {isPlatformConnected('tiktok') && (
                          <p className="text-sm text-muted-foreground">{getPlatformUsername('tiktok')}</p>
                        )}
                      </div>
                    </div>
                    {isPlatformConnected('tiktok') ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50" disabled={pendingPlatform === 'tiktok'}>
                            {pendingPlatform === 'tiktok' ? 'Disconnecting...' : 'Disconnect'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Disconnect TikTok?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to disconnect your TikTok account <strong>@{getPlatformUsername('tiktok')}</strong>? You won&apos;t be able to publish to TikTok until you reconnect.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-white/10">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDisconnectAccount('tiktok')} className="bg-red-600 text-white hover:bg-red-700">
                              Disconnect
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10"
                        onClick={() => handleConnectAccount('tiktok')}
                        disabled={pendingPlatform === 'tiktok'}
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        {pendingPlatform === 'tiktok' ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </div>

                  {/* YouTube Shorts */}
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                        <Youtube className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">YouTube Shorts</span>
                          {isPlatformConnected('youtube') && (
                            <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-500 rounded-full">
                              ✓ Connected
                            </span>
                          )}
                        </div>
                        {isPlatformConnected('youtube') && (
                          <p className="text-sm text-muted-foreground">{getPlatformUsername('youtube')}</p>
                        )}
                      </div>
                    </div>
                    {isPlatformConnected('youtube') ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50" disabled={pendingPlatform === 'youtube'}>
                            {pendingPlatform === 'youtube' ? 'Disconnecting...' : 'Disconnect'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Disconnect YouTube?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to disconnect your YouTube account <strong>@{getPlatformUsername('youtube')}</strong>? You won&apos;t be able to publish to YouTube until you reconnect.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-white/10">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDisconnectAccount('youtube')} className="bg-red-600 text-white hover:bg-red-700">
                              Disconnect
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10"
                        onClick={() => handleConnectAccount('youtube')}
                        disabled={pendingPlatform === 'youtube'}
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        {pendingPlatform === 'youtube' ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing & Subscription */}
          <Card className="border-white/10 bg-[#1a1a1a]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <CreditCard className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>Manage your subscription and payment methods</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Current Plan */}
              <div className="rounded-lg border border-purple-500/30 bg-purple-950/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Pro Plan</span>
                    <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs text-white font-medium">
                      Active
                    </span>
                  </div>
                  <Button size="sm" onClick={handleChangePlan} className="bg-white text-black hover:bg-white/90">
                    Change Plan
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">$29/month • Billed monthly</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Unlimited posts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>AI analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>3 platforms</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="mb-3 text-sm font-medium">Payment Method</h4>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10" onClick={handleUpdatePayment}>
                    Update
                  </Button>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Billing History</h4>
                  <Button variant="link" size="sm" className="h-auto p-0 text-sm">
                    View All
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Oct 1, 2025</p>
                      <p className="text-xs text-muted-foreground">Pro Plan</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">$29.00</span>
                      <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-500 rounded-sm font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3">
                    <div>
                      <p className="text-sm font-medium">Sep 1, 2025</p>
                      <p className="text-xs text-muted-foreground">Pro Plan</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">$29.00</span>
                      <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-500 rounded-sm font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-white/10 bg-[#1a1a1a]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Bell className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <Label htmlFor="post-reminders" className="text-sm font-medium">Post Reminders</Label>
                  <p className="text-xs text-muted-foreground">Get notified when it&apos;s time to record or post</p>
                </div>
                <Switch
                  id="post-reminders"
                  checked={notifications.postReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, postReminders: checked }))}
                />
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics-updates" className="text-sm font-medium">Analytics Updates</Label>
                  <p className="text-xs text-muted-foreground">Weekly summaries of your content performance</p>
                </div>
                <Switch
                  id="analytics-updates"
                  checked={notifications.analyticsUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, analyticsUpdates: checked }))}
                />
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <Label htmlFor="tips" className="text-sm font-medium">Tips & Best Practices</Label>
                  <p className="text-xs text-muted-foreground">Get content creation tips and improvement suggestions</p>
                </div>
                <Switch
                  id="tips"
                  checked={notifications.tipsAndBestPractices}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, tipsAndBestPractices: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/30 bg-[#1a1a1a]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-red-500">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions that affect your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-4">
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all your data</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="hover:bg-white/10">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 text-white hover:bg-red-700">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
