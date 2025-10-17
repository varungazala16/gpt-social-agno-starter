'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { SocialAccount, Platform } from '@/types'
import { getAccounts, deleteAccount, addAccount } from '@/lib/api/mock-accounts'
import { AddSocialProfileModal } from '@/components/modals/AddSocialProfileModal'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'

const platformInfo: Record<Platform, { icon: string; label: string }> = {
  instagram: { icon: '📷', label: 'Instagram' },
  tiktok: { icon: '🎵', label: 'TikTok' },
  youtube: { icon: '▶️', label: 'YouTube' },
}

function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export function SocialProfilesSection() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean
    account: SocialAccount | null
  }>({ isOpen: false, account: null })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
    setIsLoading(true)
    try {
      const data = await getAccounts()
      setAccounts(data)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddAccount(platform: Platform) {
    try {
      await addAccount(platform)
      await loadAccounts()
    } catch (error) {
      console.error('Failed to add account:', error)
      // In a real app, show a toast notification
    }
  }

  async function handleDeleteAccount() {
    if (!deleteModalState.account) return

    setIsDeleting(true)
    try {
      await deleteAccount(deleteModalState.account.id)
      await loadAccounts()
      setDeleteModalState({ isOpen: false, account: null })
    } catch (error) {
      console.error('Failed to delete account:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Social Profiles</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              Loading accounts...
            </div>
          ) : accounts.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              No social profiles connected
            </div>
          ) : (
            accounts.map((account, index) => {
              const info = platformInfo[account.platform]
              const isLast = index === accounts.length - 1

              return (
                <div
                  key={account.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    !isLast ? 'border-b border-border' : ''
                  }`}
                >
                  {/* Profile Image with Platform Icon */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-card flex items-center justify-center text-xs">
                      {info.icon}
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">@{account.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {info.label} • {formatFollowers(account.followerCount)} {account.platform === 'youtube' ? 'subscribers' : 'followers'}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteModalState({ isOpen: true, account })}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )
            })
          )}

          {/* Add Profile Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors border-t border-border"
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-foreground">Add Social Profile</div>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddSocialProfileModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSelectPlatform={handleAddAccount}
      />

      <ConfirmDeleteModal
        open={deleteModalState.isOpen}
        onOpenChange={(open) => !open && setDeleteModalState({ isOpen: false, account: null })}
        onConfirm={handleDeleteAccount}
        title="Remove Social Profile?"
        description={`Are you sure you want to remove @${deleteModalState.account?.username}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  )
}
