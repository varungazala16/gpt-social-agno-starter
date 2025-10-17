import { InsightItem } from '@/types'
import { InsightCard } from './InsightCard'

interface InsightsSectionProps {
  insights: InsightItem[]
  onIgnoreInsight?: (insightId: string) => void
}

export function InsightsSection({ insights, onIgnoreInsight }: InsightsSectionProps) {
  if (insights.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-foreground">Insights</h2>

      <div className="space-y-4">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onIgnore={onIgnoreInsight ? () => onIgnoreInsight(insight.id) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
