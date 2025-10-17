'use client'

import { MessageCircle, Zap, Home, CheckCircle, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavTab } from '@/types'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'chat' as NavTab, label: 'Chat', icon: MessageCircle, href: '/chat' },
  { id: 'hooks' as NavTab, label: 'Hooks', icon: Zap, href: '/hooks' },
  { id: 'home' as NavTab, label: 'Home', icon: Home, href: '/' },
  { id: 'review' as NavTab, label: 'Review', icon: CheckCircle, href: '/review' },
  { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3, href: '/analytics' },
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
