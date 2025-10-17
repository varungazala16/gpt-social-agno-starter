'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FeedbackItem } from '@/types'

interface FeedbackCardProps {
  feedback: FeedbackItem
  onIgnore?: () => void
}

export function FeedbackCard({ feedback, onIgnore }: FeedbackCardProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  const isPositive = feedback.type === 'positive'
  const Icon = isPositive ? CheckCircle : XCircle
  const iconColor = isPositive ? 'text-green-500' : 'text-red-500'

  function handleLearnMore() {
    router.push(`/chat?prompt=${encodeURIComponent(`Explain why: ${feedback.title}`)}`)
  }

  function handleHowToFix() {
    router.push(`/chat?prompt=${encodeURIComponent(`How to fix: ${feedback.title}`)}`)
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${iconColor}`} />

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground mb-1">
              {feedback.title}
            </div>
            {feedback.description && (
              <div className="text-sm text-muted-foreground">
                {feedback.description}
              </div>
            )}
          </div>

          {/* Timestamp Badge */}
          <div className="px-2 py-1 rounded bg-secondary text-xs font-medium text-foreground flex-shrink-0">
            {feedback.timestamp}
          </div>
        </div>

        {/* Explain Toggle */}
        {feedback.explanation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Explain</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Expanded Explanation */}
        {isExpanded && feedback.explanation && (
          <div className="text-sm text-muted-foreground pl-9 pt-2">
            {feedback.explanation}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {onIgnore && (
            <Button
              variant="outline"
              onClick={onIgnore}
              className="flex-1"
            >
              Ignore
            </Button>
          )}
          <Button
            variant="default"
            onClick={isPositive ? handleLearnMore : handleHowToFix}
            className="flex-1 gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {isPositive ? 'Learn More' : 'How to Fix'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function FeedbackCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-secondary animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-secondary rounded animate-pulse w-3/4" />
            <div className="h-4 bg-secondary rounded animate-pulse w-1/2" />
          </div>
          <div className="w-12 h-6 bg-secondary rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
