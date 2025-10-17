'use client'

import { TimeRange } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TimeRangeSelectorProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
}

const timeRangeLabels: Record<TimeRange, string> = {
  last_24_hours: 'Last 24 hours',
  last_7_days: 'Last 7 days',
  last_28_days: 'Last 28 days',
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-card border-border">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="last_24_hours">{timeRangeLabels.last_24_hours}</SelectItem>
        <SelectItem value="last_7_days">{timeRangeLabels.last_7_days}</SelectItem>
        <SelectItem value="last_28_days">{timeRangeLabels.last_28_days}</SelectItem>
      </SelectContent>
    </Select>
  )
}
