'use client'

import { Video, Calendar, TrendingUp, Lightbulb } from 'lucide-react'
import { Button } from './ui/button'

interface Suggestion {
  icon: React.ReactNode
  text: string
  action?: () => void
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  {
    icon: <Video className="w-5 h-5" />,
    text: "Create a tutorial video",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    text: "Plan content calendar",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    text: "Analyze engagement metrics",
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    text: "Generate video ideas",
  },
]

interface SuggestionChipsProps {
  suggestions?: Suggestion[]
  onSuggestionClick?: (text: string) => void
}

export default function SuggestionChips({
  suggestions = DEFAULT_SUGGESTIONS,
  onSuggestionClick
}: SuggestionChipsProps) {
  const handleClick = (suggestion: Suggestion) => {
    if (suggestion.action) {
      suggestion.action()
    } else if (onSuggestionClick) {
      onSuggestionClick(suggestion.text)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="suggestion"
            className="h-auto py-4 px-4 flex flex-col items-start gap-2 text-left hover:shadow-md transition-all"
            onClick={() => handleClick(suggestion)}
          >
            <div className="text-primary">
              {suggestion.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {suggestion.text}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
