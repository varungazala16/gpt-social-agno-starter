'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ChevronDown, Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Hook, HookType } from '@/types'
import { getNextHook, dismissHook } from '@/lib/api/mock-hooks'

const hookTypes: HookType[] = ['Video Concept', 'Opening Line', 'Story Hook', 'Tutorial Hook']

export function NextHookCard() {
  const router = useRouter()
  const [hook, setHook] = useState<Hook | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHook()
  }, [])

  async function loadHook() {
    try {
      const data = await getNextHook()
      setHook(data)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDismiss() {
    setIsLoading(true)
    const nextHook = await dismissHook()
    setHook(nextHook)
    setIsLoading(false)
  }

  function handleWriteScript() {
    if (hook) {
      router.push(`/chat?prompt=Write a script for: ${encodeURIComponent(hook.text)}`)
    }
  }

  if (isLoading || !hook) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="h-32 flex items-center justify-center">
            <div className="text-muted-foreground">Loading hook...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Your Next Hook</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground hover:text-foreground">
            <span className="text-sm">All Hooks</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold" style={{ color: 'hsl(var(--pink))' }}>
            {hook.text}
          </h3>
        </div>

        <div className="relative">
          <select
            value={hook.type}
            onChange={(e) => setHook({ ...hook, type: e.target.value as HookType })}
            className="w-full appearance-none bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {hookTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" onClick={handleDismiss}>
            Dismiss
          </Button>
          <Button
            variant="default"
            className="w-full gap-2"
            onClick={handleWriteScript}
          >
            <MessageCircle className="w-4 h-4" />
            Write Script
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
