"use client"

import { CopilotChat } from "@copilotkit/react-ui"
import { useCopilotReadable } from "@copilotkit/react-core"
import { MessageCircle } from "lucide-react"

interface ChatSidebarProps {
  currentTab: 'gallery' | 'upload' | 'record'
  videoCount?: number
  userCredits?: number
}

export function ChatSidebar({ currentTab, videoCount, userCredits }: ChatSidebarProps) {
  // Make page context readable to the agent
  useCopilotReadable({
    description: "Current page state and video studio context",
    value: JSON.stringify({
      currentTab,
      videoCount: videoCount || 0,
      userCredits: userCredits || 0,
      pageType: "video-studio",
      features: ["gallery", "upload", "record", "edit"]
    })
  })

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assistant
            </h2>
            <div className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase rounded">
              AI
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ask questions about your video studio
        </p>
      </div>

      {/* Chat Component */}
      <div className="flex-1 overflow-hidden">
        <CopilotChat
          className="h-full p-2"
          labels={{
            initial: `Welcome to your Video Studio Assistant! 🎬

I can help you with:
• Understanding your video gallery
• How to upload and record videos
• Video editing features
• Managing your credits

What would you like to know?`
          }}
        />
      </div>
    </div>
  )
}
