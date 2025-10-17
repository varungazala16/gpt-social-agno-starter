'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Users, Eye, Heart } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Goal, GoalMetric } from '@/types'
import {
  getMetrics,
  calculatePredictedDate,
  getSuggestedTarget,
  updateGoal,
} from '@/lib/api/mock-goals'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface ChangeGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentGoal: Goal
  onSave: () => void
}

const metricInfo: Record<GoalMetric, { icon: typeof Users; label: string }> = {
  followers: { icon: Users, label: 'Followers' },
  views: { icon: Eye, label: 'Views' },
  likes: { icon: Heart, label: 'Likes' },
}

export function ChangeGoalModal({
  open,
  onOpenChange,
  currentGoal,
  onSave,
}: ChangeGoalModalProps) {
  const [selectedMetric, setSelectedMetric] = useState<GoalMetric>(currentGoal.metric)
  const [targetValue, setTargetValue] = useState(0)
  const [metrics, setMetrics] = useState({ followers: 0, views: 0, likes: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  async function loadData() {
    setIsLoading(true)
    try {
      const metricsData = await getMetrics()
      setMetrics(metricsData)

      // Set selected metric from current goal
      setSelectedMetric(currentGoal.metric)

      // Set suggested target
      const suggested = getSuggestedTarget(currentGoal)
      setTargetValue(suggested)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    const currentMetricValue = metrics[selectedMetric]
    if (targetValue <= currentMetricValue) {
      alert(`Target must be higher than current ${selectedMetric}`)
      return
    }

    setIsSaving(true)
    try {
      await updateGoal(selectedMetric, targetValue)
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update goal:', error)
      alert('Failed to update goal. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return new Intl.NumberFormat('en-US').format(num)
  }

  function formatNumberShort(num: number): string {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const currentMetricValue = metrics[selectedMetric]
  const remaining = targetValue - currentMetricValue
  const percentComplete = Math.min(
    Math.round((currentMetricValue / targetValue) * 100),
    100
  )
  const predictedDate = calculatePredictedDate(
    currentMetricValue,
    targetValue,
    currentGoal.todayGrowth
  )
  const daysToReach = Math.ceil(remaining / currentGoal.todayGrowth)
  const metricLabel = metricInfo[selectedMetric].label

  const data = [
    { value: percentComplete },
    { value: 100 - percentComplete }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full h-screen max-h-screen p-0 gap-0 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Change Goal
            </DialogTitle>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : (
            <>
              {/* Current Goal Summary */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Goal: {formatNumber(targetValue)} {metricLabel}
                    </h3>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Current: {formatNumber(currentMetricValue)} {metricLabel}
                      </div>
                      {remaining > 0 && (
                        <div className="text-sm font-medium" style={{ color: 'oklch(0.65 0.25 290)' }}>
                          {formatNumber(remaining)} to go
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
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
                      <div className="text-3xl font-bold text-foreground">{percentComplete}%</div>
                      <div className="text-xs text-muted-foreground">complete</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Metric Selector */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Goal Metric</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(metricInfo) as [GoalMetric, typeof metricInfo[GoalMetric]][]).map(
                    ([metric, info]) => {
                      const Icon = info.icon
                      const isSelected = selectedMetric === metric
                      const value = metrics[metric]

                      return (
                        <button
                          key={metric}
                          onClick={() => setSelectedMetric(metric)}
                          className={`bg-card border rounded-lg p-4 text-center transition-colors ${
                            isSelected
                              ? 'border-primary'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Icon
                              className="w-6 h-6"
                              style={{
                                color: isSelected ? 'oklch(0.65 0.25 290)' : 'oklch(0.6 0 0)',
                              }}
                            />
                            <div className="text-sm font-medium text-foreground">
                              {info.label}
                            </div>
                            <div className="text-lg font-bold text-foreground">
                              {formatNumberShort(value)}
                            </div>
                          </div>
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Target Input */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Target {metricLabel}</h3>
                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="20000"
                  min={currentMetricValue + 1}
                />
                <p className="text-sm text-muted-foreground">
                  Set a target number of {selectedMetric} you want to reach
                </p>
              </div>

              {/* Predicted Goal Date */}
              {remaining > 0 && currentGoal.todayGrowth > 0 && (
                <div className="bg-secondary border border-border rounded-lg p-6 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Predicted Goal Date
                  </h3>
                  <div className="text-xl font-bold text-foreground">
                    {format(predictedDate, 'MMMM d, yyyy')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on your current growth rate of {currentGoal.todayGrowth} {selectedMetric} per day,
                    you&apos;re on track to reach your goal in {daysToReach} days.
                  </p>
                </div>
              )}

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isSaving || targetValue <= currentMetricValue}
                className="w-full"
                size="lg"
              >
                {isSaving ? 'Saving...' : 'Save Goal'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
