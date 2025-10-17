'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle, Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Hook } from '@/types'

interface HookCardProps {
  hook: Hook
  onDismiss?: () => void
  onToggleSave?: (hookId: string) => void
  defaultExpanded?: boolean
}

export function HookCard({ hook, onDismiss, onToggleSave, defaultExpanded = false }: HookCardProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  function handleWriteScript() {
    router.push(`/chat?prompt=${encodeURIComponent(`Write a script for: ${hook.text}`)}`)
  }

  function handleToggleSave() {
    onToggleSave?.(hook.id)
  }

  // Helper to highlight text between < and >
  function renderHighlightedText(text: string) {
    const parts = text.split(/(<[^>]+>)/)
    return parts.map((part, index) => {
      if (part.startsWith('<') && part.endsWith('>')) {
        return (
          <span key={index} className="bg-pink-500/20 text-pink-400 px-1 rounded">
            {part.slice(1, -1)}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Hook Text and Bookmark */}
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold" style={{ color: 'hsl(var(--pink))' }}>
              {hook.text}
            </h3>
          </div>
          {onToggleSave && (
            <button
              onClick={handleToggleSave}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  hook.isSaved
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          )}
        </div>

        {/* Type Display and Expand/Collapse Toggle */}
        {hook.details && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between bg-background border border-border rounded-lg px-4 py-2 hover:bg-secondary transition-colors"
          >
            <span className="text-foreground">{hook.type}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}
        {!hook.details && (
          <div className="bg-background border border-border rounded-lg px-4 py-2">
            <span className="text-foreground">{hook.type}</span>
          </div>
        )}

        {/* Expandable Details */}
        {hook.details && isExpanded && (
          <div className="space-y-3 text-sm text-muted-foreground">
            {/* Description */}
            <ul className="list-disc list-inside space-y-2">
              {hook.details.description.map((desc, index) => (
                <li key={index} className="leading-relaxed">
                  {renderHighlightedText(desc)}
                </li>
              ))}
            </ul>

            {/* Examples */}
            {hook.details.examples && hook.details.examples.length > 0 && (
              <div className="mt-3">
                <div className="font-semibold text-foreground mb-2">For example:</div>
                <ul className="list-none space-y-1 ml-4">
                  {hook.details.examples.map((example, index) => (
                    <li key={index} className="before:content-['•'] before:mr-2">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {onDismiss && (
            <Button variant="outline" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
          <Button
            variant="default"
            onClick={handleWriteScript}
            className={`gap-2 ${!onDismiss ? 'col-span-2' : ''}`}
          >
            <MessageCircle className="w-4 h-4" />
            Write Script
          </Button>
        </div>
      </div>
    </div>
  )
}
