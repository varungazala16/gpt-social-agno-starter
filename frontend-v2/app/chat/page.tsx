'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function ChatContent() {
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    const prefilledPrompt = searchParams.get('prompt')
    if (prefilledPrompt) {
      setPrompt(prefilledPrompt)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Chat</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
            <p className="text-muted-foreground mb-4">
              CopilotKit integration will be added here. This is a placeholder for the chat interface.
            </p>
            {prompt && (
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Prefilled prompt:</p>
                <p className="text-foreground font-medium">{prompt}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-foreground">Chat</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
