'use client'

import { useState, useEffect } from 'react'
import { Check, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SocialAccount, Platform } from '@/types'
import { getAccounts, toggleAccountSelection } from '@/lib/api/mock-accounts'
import { cn } from '@/lib/utils'

const platformIcons: Record<Platform, string> = {
  instagram: '📷',
  tiktok: '🎵',
  youtube: '▶️',
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

export function AccountSelector() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
    try {
      const data = await getAccounts()
      setAccounts(data)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleAccount(accountId: string) {
    const updated = await toggleAccountSelection(accountId)
    setAccounts(updated)
  }

  const selectedAccounts = accounts.filter(acc => acc.isSelected)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <div className="flex items-center -space-x-2">
          {selectedAccounts.slice(0, 3).map((account) => (
            <div
              key={account.id}
              className="relative w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted"
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-card flex items-center justify-center text-[10px]">
                {platformIcons[account.platform]}
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 bg-card border-border">
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            className="flex items-center gap-3 p-3 cursor-pointer"
            onClick={() => handleToggleAccount(account.id)}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500" />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-card flex items-center justify-center text-xs">
                {platformIcons[account.platform]}
              </div>
            </div>

            <div className="flex-1">
              <div className="font-medium text-foreground">{account.username}</div>
              <div className="text-sm text-muted-foreground">
                {formatFollowers(account.followerCount)} {account.platform === 'youtube' ? 'subscribers' : 'followers'}
              </div>
            </div>

            {account.isSelected && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          className="flex items-center gap-3 p-3 cursor-pointer"
          onClick={() => router.push('/settings')}
        >
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <Settings className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground">Settings</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
