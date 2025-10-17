'use client'

import { MessageCircle, Zap, Home, CheckCircle, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavTab } from '@/types'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'home' as NavTab, label: 'Home', icon: Home, href: '/' },
  { id: 'chat' as NavTab, label: 'Chat', icon: MessageCircle, href: '/chat' },
  { id: 'hooks' as NavTab, label: 'Hooks', icon: Zap, href: '/hooks' },
  { id: 'review' as NavTab, label: 'Review', icon: CheckCircle, href: '/review' },
  { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3, href: '/analytics' },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground">Social Studio</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
