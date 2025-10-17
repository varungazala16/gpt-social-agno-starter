'use client'

import { usePathname } from 'next/navigation'
import { CopilotChat } from "@copilotkit/react-ui"
import { TopNav } from "@/components/TopNav"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show TopNav on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  return (
    <div className="flex min-h-screen">
      {/* AI Chat Panel - always visible */}
      <aside className="w-1/4 fixed inset-y-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-10">
        <div className="h-full overflow-hidden p-4">
          <CopilotChat
            className="h-full"
            labels={{
              initial: `Welcome to GPT Social! 🎬`
            }}
          />
        </div>
      </aside>

      {/* Main Content Area - offset by 25% */}
      <div className="flex-1 ml-[25%]">
        {/* Top Navigation - hidden on auth pages */}
        {!isAuthPage && <TopNav />}
        
        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}
