'use client'

import { Eye, Heart, MessageCircle, Star } from 'lucide-react'

export function PostStats() {
  // Generate random placeholder stats
  const views = Math.floor(Math.random() * 10000) + 100
  const likes = Math.floor(Math.random() * 1000) + 10
  const comments = Math.floor(Math.random() * 100) + 1
  const score = (Math.random() * 5 + 5).toFixed(1) // 5.0 - 10.0

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Post Performance</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Eye className="w-5 h-5" />} label="Views" value={views.toLocaleString()} />
        <StatCard icon={<Heart className="w-5 h-5" />} label="Likes" value={likes.toLocaleString()} />
        <StatCard icon={<MessageCircle className="w-5 h-5" />} label="Comments" value={comments.toLocaleString()} />
        <StatCard icon={<Star className="w-5 h-5" />} label="Score" value={score} />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-gray-500 dark:text-gray-400 mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  )
}
