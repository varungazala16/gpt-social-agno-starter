'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export interface SettingsListItem {
  label: string
  href?: string
  onClick?: () => void
  external?: boolean
}

interface SettingsListProps {
  title: string
  items: SettingsListItem[]
}

export function SettingsList({ title, items }: SettingsListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          const content = (
            <>
              <span className="flex-1 text-foreground font-medium">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </>
          )

          const className = `flex items-center justify-between px-4 py-4 hover:bg-secondary transition-colors ${
            !isLast ? 'border-b border-border' : ''
          }`

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full text-left ${className}`}
              >
                {content}
              </button>
            )
          }

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            )
          }

          return (
            <Link key={item.label} href={item.href || '#'} className={className}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
