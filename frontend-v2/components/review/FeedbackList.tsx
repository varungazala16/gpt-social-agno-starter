import { FeedbackItem } from '@/types'
import { FeedbackCard, FeedbackCardSkeleton } from './FeedbackCard'

interface FeedbackListProps {
  feedback: FeedbackItem[]
  isAnalyzing?: boolean
  pendingCount?: number
  onIgnoreFeedback?: (feedbackId: string) => void
}

export function FeedbackList({
  feedback,
  isAnalyzing = false,
  pendingCount = 0,
  onIgnoreFeedback,
}: FeedbackListProps) {
  if (feedback.length === 0 && !isAnalyzing) {
    return null
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-foreground">Feedback</h2>

      <div className="space-y-4">
        {/* Rendered feedback items */}
        {feedback.map((item) => (
          <FeedbackCard
            key={item.id}
            feedback={item}
            onIgnore={onIgnoreFeedback ? () => onIgnoreFeedback(item.id) : undefined}
          />
        ))}

        {/* Skeleton loaders for pending feedback */}
        {isAnalyzing && pendingCount > 0 && (
          <>
            {Array.from({ length: pendingCount }).map((_, index) => (
              <FeedbackCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
