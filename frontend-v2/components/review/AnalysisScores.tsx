'use client'

import { useState } from 'react'
import { Zap, Target, ChevronDown, ChevronUp } from 'lucide-react'

interface AnalysisScoresProps {
  hookScore?: number
  endingScore?: number
  hookReason?: string
  endingReason?: string
  issuesCount?: number
}

function ScoreSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-secondary animate-pulse" />
      <div className="flex-1">
        <div className="w-16 h-6 bg-secondary rounded animate-pulse" />
      </div>
    </div>
  )
}

export function AnalysisScores({
  hookScore,
  endingScore,
  hookReason,
  endingReason,
  issuesCount,
}: AnalysisScoresProps) {
  const [isWhyExpanded, setIsWhyExpanded] = useState(false)

  const hasScores = hookScore !== undefined || endingScore !== undefined

  function getScoreColor(score?: number): string {
    if (score === undefined) return 'text-muted-foreground'
    if (score >= 85) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Scores Row */}
        <div className="flex items-center gap-8">
          {/* Hook Score */}
          {hookScore === undefined ? (
            <ScoreSkeleton />
          ) : (
            <div className="flex items-center gap-3">
              <Zap className={`w-6 h-6 ${getScoreColor(hookScore)}`} />
              <div>
                <div className="text-xs text-muted-foreground">Hook</div>
                <div className={`text-2xl font-bold ${getScoreColor(hookScore)}`}>
                  {hookScore}
                </div>
              </div>
            </div>
          )}

          {/* Ending Score */}
          {endingScore === undefined && hookScore !== undefined ? (
            <ScoreSkeleton />
          ) : endingScore !== undefined ? (
            <div className="flex items-center gap-3">
              <Target className={`w-6 h-6 ${getScoreColor(endingScore)}`} />
              <div>
                <div className="text-xs text-muted-foreground">Ending</div>
                <div className={`text-2xl font-bold ${getScoreColor(endingScore)}`}>
                  {endingScore}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Issues Count */}
        {issuesCount !== undefined && issuesCount > 0 && (
          <div className="text-lg font-bold text-red-500">
            {issuesCount} issue{issuesCount > 1 ? 's' : ''} found
          </div>
        )}

        {/* Why? Expandable */}
        {hasScores && (hookReason || endingReason) && (
          <button
            onClick={() => setIsWhyExpanded(!isWhyExpanded)}
            className="w-full flex items-center justify-between text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-medium">Why?</span>
            {isWhyExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Why? Content */}
        {isWhyExpanded && (
          <div className="space-y-3 text-sm text-muted-foreground pt-2">
            {hookReason && hookScore !== undefined && (
              <div>
                <div className="font-semibold text-foreground flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Hook ({hookScore})</span>
                </div>
                <p className="pl-6">{hookReason}</p>
              </div>
            )}
            {endingReason && endingScore !== undefined && (
              <div>
                <div className="font-semibold text-foreground flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4" />
                  <span>Ending ({endingScore})</span>
                </div>
                <p className="pl-6">{endingReason}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
