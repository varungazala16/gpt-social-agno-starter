'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import ChatEmptyState from './ChatEmptyState'
import SuggestionChips from './SuggestionChips'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card } from './ui/card'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void
  messages?: Message[]
}

export default function ChatInterface({ onSendMessage, messages = [] }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return

    if (onSendMessage) {
      onSendMessage(inputValue)
    }

    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (text: string) => {
    setInputValue(text)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-4">
        {isEmpty ? (
          <div className="space-y-8">
            <ChatEmptyState />
            <SuggestionChips onSuggestionClick={handleSuggestionClick} />
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <Card
                key={message.id}
                variant={message.role === 'user' ? 'default' : 'default'}
                className="p-4"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-gray-200 dark:bg-gray-700'
                          : 'bg-primary'
                      }`}
                    >
                      <span className="text-sm font-medium text-white">
                        {message.role === 'user' ? 'U' : 'AI'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[60px] max-h-[200px] resize-none"
                disabled={isLoading}
              />
            </div>
            <Button
              variant="primary"
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="h-[60px] w-[60px]"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
