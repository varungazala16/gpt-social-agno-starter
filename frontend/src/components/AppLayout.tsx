'use client'

import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export default function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onMenuClick={toggleSidebar}
        showMenuButton={showSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
        )}

        <main id="main-content" className="flex-1 overflow-y-auto" role="main" aria-label="Main content">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
