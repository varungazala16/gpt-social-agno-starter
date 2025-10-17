'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Goal, GrowthDataPoint, GoalMetric } from '@/types'
import { getGoal, getGrowthData } from '@/lib/api/mock-goals'
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { ChangeGoalModal } from '@/components/modals/ChangeGoalModal'

const platformIcons: Record<string, string> = {
  instagram: '📷',
  tiktok: '🎵',
  youtube: '▶️',
}

const metricLabels: Record<GoalMetric, string> = {
  followers: 'Followers',
  views: 'Views',
  likes: 'Likes',
}

export function GoalCard() {
  const router = useRouter()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isChangeGoalOpen, setIsChangeGoalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [goalData, chartData] = await Promise.all([
        getGoal(),
        getGrowthData()
      ])
      setGoal(goalData)
      setGrowthData(chartData)
    } finally {
      setIsLoading(false)
    }
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num)
  }

  function handleGrowQuicker() {
    router.push('/chat?prompt=Help me grow my social media faster')
  }

  if (isLoading || !goal) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const data = [
    { value: goal.percentComplete },
    { value: 100 - goal.percentComplete }
  ]

  const metricLabel = metricLabels[goal.metric]

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-4">Goal</h3>
            <div className="space-y-1 mb-4">
              <div className="text-lg font-semibold text-foreground">
                {formatNumber(goal.targetValue)} {metricLabel}
              </div>
              <div className="text-muted-foreground text-sm">Target</div>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-foreground">Current</h4>
              <div className="text-3xl font-bold text-foreground">
                {formatNumber(goal.currentValue)}
              </div>
              <div className="text-sm text-muted-foreground">{metricLabel}</div>
              <div className="text-sm font-medium" style={{ color: 'oklch(0.65 0.25 290)' }}>
                +{formatNumber(goal.todayGrowth)} today
              </div>
            </div>
          </div>

          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={68}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="oklch(0.65 0.25 290)" />
                  <Cell fill="oklch(0.15 0 0)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-foreground">{goal.percentComplete}%</div>
              <div className="text-sm text-muted-foreground">complete</div>
            </div>
          </div>
        </div>

        {/* Last 30 Days Chart */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm text-muted-foreground">Last 30 Days</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.25 340)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.7 0.25 340)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTiktok" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.25 180)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.65 0.25 180)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorYoutube" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.25 290)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.65 0.25 290)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0)" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="oklch(0.6 0 0)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.6 0 0)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0 0)',
                    border: '1px solid oklch(0.25 0 0)',
                    borderRadius: '8px',
                    color: 'oklch(0.985 0 0)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="youtube"
                  stroke="oklch(0.65 0.25 290)"
                  strokeWidth={2}
                  fill="url(#colorYoutube)"
                />
                <Area
                  type="monotone"
                  dataKey="tiktok"
                  stroke="oklch(0.65 0.25 180)"
                  strokeWidth={2}
                  fill="url(#colorTiktok)"
                />
                <Area
                  type="monotone"
                  dataKey="instagram"
                  stroke="oklch(0.7 0.25 340)"
                  strokeWidth={2}
                  fill="url(#colorInstagram)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Legend */}
          <div className="flex items-center justify-center gap-6">
            {Object.entries(platformIcons).map(([platform, icon]) => (
              <div key={platform} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs">
                  {icon}
                </div>
                <span className="text-sm text-muted-foreground capitalize">{platform}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsChangeGoalOpen(true)}
          >
            Change Goal
          </Button>
          <Button
            variant="default"
            className="w-full gap-2"
            onClick={handleGrowQuicker}
          >
            <MessageCircle className="w-4 h-4" />
            Grow Quicker
          </Button>
        </div>
      </CardContent>

      {/* Change Goal Modal */}
      {goal && (
        <ChangeGoalModal
          open={isChangeGoalOpen}
          onOpenChange={setIsChangeGoalOpen}
          currentGoal={goal}
          onSave={loadData}
        />
      )}
    </Card>
  )
}
