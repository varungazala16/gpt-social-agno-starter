'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Platform } from '@/types'
import { getAvailablePlatforms } from '@/lib/api/mock-accounts'

const platformInfo: Record<Platform, { icon: string; label: string; color: string }> = {
  instagram: { icon: '📷', label: 'Instagram', color: 'from-purple-500 to-pink-500' },
  tiktok: { icon: '🎵', label: 'TikTok', color: 'from-cyan-500 to-blue-500' },
  youtube: { icon: '▶️', label: 'YouTube', color: 'from-red-500 to-red-600' },
}

interface AddSocialProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPlatform: (platform: Platform) => void | Promise<void>
}

export function AddSocialProfileModal({
  open,
  onOpenChange,
  onSelectPlatform,
}: AddSocialProfileModalProps) {
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (open) {
      loadAvailablePlatforms()
    }
  }, [open])

  async function loadAvailablePlatforms() {
    setIsLoading(true)
    try {
      const platforms = await getAvailablePlatforms()
      setAvailablePlatforms(platforms)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleConnect() {
    if (!selectedPlatform) return

    setIsConnecting(true)
    try {
      await onSelectPlatform(selectedPlatform)
      onOpenChange(false)
      setSelectedPlatform(null)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Social Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {availablePlatforms.length === 0 && !isLoading
              ? 'All platforms are already connected.'
              : 'Select a platform to connect your account.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading platforms...
            </div>
          ) : availablePlatforms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No platforms available to connect
            </div>
          ) : (
            availablePlatforms.map((platform) => {
              const info = platformInfo[platform]
              const isSelected = selectedPlatform === platform

              return (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-secondary'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center text-2xl`}>
                    {info.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-foreground">{info.label}</div>
                    <div className="text-sm text-muted-foreground">
                      Connect your {info.label} account
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setSelectedPlatform(null)
            }}
            disabled={isConnecting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={!selectedPlatform || isConnecting || availablePlatforms.length === 0}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
