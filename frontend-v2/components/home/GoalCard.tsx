'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Goal } from '@/types'
import { getGoal } from '@/lib/api/mock-goals'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export function GoalCard() {
  const router = useRouter()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGoal()
  }, [])

  async function loadGoal() {
    try {
      const data = await getGoal()
      setGoal(data)
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

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-2">Goal</h3>
            <div className="space-y-1 mb-4">
              <div className="text-lg font-semibold text-foreground">
                {formatNumber(goal.targetFollowers)} Followers
              </div>
              <div className="text-muted-foreground text-sm">Target</div>
            </div>

            <div className="space-y-1 mb-6">
              <h4 className="text-lg font-semibold text-foreground">Current</h4>
              <div className="text-3xl font-bold text-foreground">
                {formatNumber(goal.currentFollowers)} <span className="text-lg text-muted-foreground">Followers</span>
              </div>
              <div className="text-sm text-primary font-medium">
                +{formatNumber(goal.todayGrowth)} today
              </div>
            </div>

            <div className="text-xs text-muted-foreground mb-4">Last 30 Days</div>
          </div>

          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="hsl(var(--primary))" />
                  <Cell fill="hsl(var(--secondary))" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-foreground">{goal.percentComplete}%</div>
              <div className="text-sm text-muted-foreground">complete</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="outline" className="w-full">
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
    </Card>
  )
}
