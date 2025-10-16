'use client'

import { Eye, Heart, MessageCircle, TrendingUp } from 'lucide-react'

export function StatsCards() {
  // Generate random placeholder stats
  const totalViews = Math.floor(Math.random() * 100000) + 10000
  const totalLikes = Math.floor(Math.random() * 10000) + 1000
  const totalComments = Math.floor(Math.random() * 1000) + 100
  const avgScore = (Math.random() * 5 + 5).toFixed(1) // 5.0 - 10.0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Eye className="w-6 h-6" />}
        label="Total Views"
        value={totalViews.toLocaleString()}
        iconColor="text-blue-600 dark:text-blue-400"
        bgColor="bg-blue-50 dark:bg-blue-950"
      />
      <StatCard
        icon={<Heart className="w-6 h-6" />}
        label="Total Likes"
        value={totalLikes.toLocaleString()}
        iconColor="text-red-600 dark:text-red-400"
        bgColor="bg-red-50 dark:bg-red-950"
      />
      <StatCard
        icon={<MessageCircle className="w-6 h-6" />}
        label="Comments"
        value={totalComments.toLocaleString()}
        iconColor="text-green-600 dark:text-green-400"
        bgColor="bg-green-50 dark:bg-green-950"
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="Average Score"
        value={avgScore}
        iconColor="text-purple-600 dark:text-purple-400"
        bgColor="bg-purple-50 dark:bg-purple-950"
      />
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  iconColor?: string
  bgColor?: string
}

function StatCard({ icon, label, value, iconColor, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bgColor} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}
