'use client'

import { ReactNode } from 'react'
import { MobileTabBar } from './MobileTabBar'
import { DesktopSidebar } from './DesktopSidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DesktopSidebar />

      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      <MobileTabBar />
    </div>
  )
}
