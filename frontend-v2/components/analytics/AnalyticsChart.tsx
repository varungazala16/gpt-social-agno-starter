'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartDataPoint, Platform } from '@/types'

interface AnalyticsChartProps {
  data: ChartDataPoint[]
  platforms?: Platform[]
}

const platformIcons: Record<Platform, string> = {
  instagram: '📷',
  tiktok: '🎵',
  youtube: '▶️',
}

function formatYAxis(value: number): string {
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`
  }
  return value.toString()
}

export function AnalyticsChart({ data, platforms = ['instagram', 'tiktok', 'youtube'] }: AnalyticsChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.25 180)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.25 180)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.25 290)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.25 290)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFollows" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.7 0.25 340)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.7 0.25 340)" stopOpacity={0} />
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
            tickFormatter={formatYAxis}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'oklch(0.2 0 0)',
              border: '1px solid oklch(0.3 0 0)',
              borderRadius: '8px',
              color: 'oklch(0.9 0 0)',
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="oklch(0.65 0.25 180)"
            strokeWidth={2}
            fill="url(#colorViews)"
          />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="oklch(0.65 0.25 290)"
            strokeWidth={2}
            fill="url(#colorEngagement)"
          />
          <Area
            type="monotone"
            dataKey="follows"
            stroke="oklch(0.7 0.25 340)"
            strokeWidth={2}
            fill="url(#colorFollows)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Platform Legend */}
      <div className="flex items-center justify-center gap-6">
        {platforms.map((platform) => (
          <div key={platform} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs">
              {platformIcons[platform]}
            </div>
            <span className="text-sm text-muted-foreground capitalize">{platform}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
