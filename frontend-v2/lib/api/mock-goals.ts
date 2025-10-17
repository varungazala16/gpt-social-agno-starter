import { Goal, GrowthDataPoint, GoalMetric } from '@/types'
import { subDays, format, addDays } from 'date-fns'

const mockGoal: Goal = {
  metric: 'followers',
  targetValue: 20000,
  currentValue: 15646,
  todayGrowth: 122,
  percentComplete: 78,
  // Legacy fields
  targetFollowers: 20000,
  currentFollowers: 15646,
}

// Generate 30 days of growth data
function generateGrowthData(): GrowthDataPoint[] {
  const data: GrowthDataPoint[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i)
    data.push({
      date: format(date, 'MMM d'),
      instagram: 4800 + (29 - i) * 50 + Math.random() * 100,
      tiktok: 5200 + (29 - i) * 75 + Math.random() * 150,
      youtube: 4500 + (29 - i) * 60 + Math.random() * 120,
    })
  }

  return data
}

export async function getGoal(): Promise<Goal> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockGoal
}

export async function getGrowthData(): Promise<GrowthDataPoint[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return generateGrowthData()
}

export async function updateGoal(metric: GoalMetric, targetValue: number): Promise<Goal> {
  await new Promise(resolve => setTimeout(resolve, 400))
  mockGoal.metric = metric
  mockGoal.targetValue = targetValue

  // Update current value based on metric
  const metrics = await getMetrics()
  mockGoal.currentValue = metrics[metric]

  // Update percent complete
  mockGoal.percentComplete = Math.round((mockGoal.currentValue / targetValue) * 100)

  // Update legacy fields if metric is followers
  if (metric === 'followers') {
    mockGoal.targetFollowers = targetValue
    mockGoal.currentFollowers = mockGoal.currentValue
  }

  return mockGoal
}

export async function getMetrics(): Promise<{ followers: number; views: number; likes: number }> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return {
    followers: mockGoal.currentFollowers,
    views: 450000,
    likes: 28500,
  }
}

export function calculatePredictedDate(
  current: number,
  target: number,
  dailyGrowth: number
): Date {
  if (dailyGrowth <= 0 || current >= target) {
    return new Date() // Already reached or no growth
  }

  const remaining = target - current
  const daysToReach = Math.ceil(remaining / dailyGrowth)

  return addDays(new Date(), daysToReach)
}

export function getSuggestedTarget(goal: Goal): number {
  // If goal is reached (or close to it), suggest 20% higher
  if (goal.percentComplete >= 100) {
    return Math.ceil(goal.currentValue * 1.2)
  }
  // Otherwise, keep current target
  return goal.targetValue
}
