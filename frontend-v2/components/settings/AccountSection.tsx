'use client'

import { ChevronRight } from 'lucide-react'

interface AccountSectionProps {
  email?: string
}

export function AccountSection({ email = 'sarah@gmail.com' }: AccountSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">Account</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 opacity-60 cursor-not-allowed">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">Email</div>
            <div className="text-foreground font-medium">{email}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
