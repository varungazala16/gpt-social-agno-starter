'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatContextType {
  prefilledPrompt: string
  setPrefilledPrompt: (prompt: string) => void
  clearPrompt: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [prefilledPrompt, setPrefilledPrompt] = useState('')

  const clearPrompt = () => setPrefilledPrompt('')

  return (
    <ChatContext.Provider value={{ prefilledPrompt, setPrefilledPrompt, clearPrompt }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}

// Utility function to navigate with prefilled prompt
export function createChatLink(prompt: string): string {
  return `/chat?prompt=${encodeURIComponent(prompt)}`
}
