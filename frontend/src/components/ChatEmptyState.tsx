'use client'

import { Sparkles } from 'lucide-react'

export default function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome to GPT.Social
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your AI-powered video creation assistant
          </p>
        </div>

        {/* Description */}
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Start a conversation or choose from the suggestions below to create amazing video content
        </p>
      </div>
    </div>
  )
}
