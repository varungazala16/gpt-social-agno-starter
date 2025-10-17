import { Eye, Heart, UserPlus } from 'lucide-react'

interface MetricCardsProps {
  views: number
  engagement: number
  follows: number
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function MetricCards({ views, engagement, follows }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Views */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Eye className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Views</div>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(views)}
            </div>
          </div>
        </div>
      </div>

      {/* Engagement */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
            <Heart className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Engagement</div>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(engagement)}
            </div>
          </div>
        </div>
      </div>

      {/* Follows */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Follows</div>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(follows)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
