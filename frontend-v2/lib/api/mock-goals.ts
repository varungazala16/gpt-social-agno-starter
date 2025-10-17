import { Goal, GrowthDataPoint } from '@/types'
import { subDays, format } from 'date-fns'

const mockGoal: Goal = {
  targetFollowers: 20000,
  currentFollowers: 15646,
  todayGrowth: 122,
  percentComplete: 78,
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

export async function updateGoal(targetFollowers: number): Promise<Goal> {
  await new Promise(resolve => setTimeout(resolve, 400))
  mockGoal.targetFollowers = targetFollowers
  mockGoal.percentComplete = Math.round((mockGoal.currentFollowers / targetFollowers) * 100)
  return mockGoal
}
