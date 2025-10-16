'use client'

import * as React from 'react'
import { Post } from '@/actions/post'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isValid,
} from 'date-fns'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '../Button'

interface CalendarProps {
  posts: Post[]
  className?: string
}

const STATUS_COLORS = {
  draft: 'bg-gray-500 dark:bg-gray-600',
  scheduled: 'bg-blue-500 dark:bg-blue-600',
  posted: 'bg-green-500 dark:bg-green-600',
}

/**
 * Calendar Component - Preline UI Style
 *
 * A month view calendar for displaying posts with status indicators
 * Follows Preline UI design patterns and styling conventions
 */
export function Calendar({ posts, className }: CalendarProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get calendar dates for the current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Group posts by date
  const postsByDate = posts.reduce((acc, post) => {
    try {
      const dateToUse = post.published || post.created_at
      if (!dateToUse) return acc

      const postDate = parseISO(dateToUse)
      if (!isValid(postDate)) return acc

      const dateKey = format(postDate, 'yyyy-MM-dd')
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(post)
    } catch (error) {
      console.error('Error parsing date:', error)
    }

    return acc
  }, {} as Record<string, Post[]>)

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`)
  }

  const getStatusColor = (status: Post['status']) => {
    return STATUS_COLORS[status] || STATUS_COLORS.draft
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="h-9 w-9 text-gray-800 dark:text-neutral-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="h-9 w-9 text-gray-800 dark:text-neutral-200"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div
              key={day}
              className={cn(
                'py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-400',
                index > 0 && 'border-l border-gray-200 dark:border-neutral-700'
              )}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, dayIdx) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const dayPosts = postsByDate[dateKey] || []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <button
                key={dayIdx}
                type="button"
                className={cn(
                  'relative min-h-[100px] sm:min-h-[120px] p-2 text-left transition-colors',
                  'border-b border-gray-200 dark:border-neutral-700',
                  dayIdx % 7 !== 0 && 'border-l border-gray-200 dark:border-neutral-700',
                  dayIdx < 35 && 'border-b',
                  !isCurrentMonth && 'bg-gray-50/50 dark:bg-neutral-900/50',
                  isCurrentMonth && 'hover:bg-gray-50 dark:hover:bg-neutral-800',
                  isToday && 'ring-2 ring-inset ring-blue-500 dark:ring-blue-600'
                )}
              >
                {/* Day Number */}
                <div
                  className={cn(
                    'text-sm font-medium mb-1',
                    isCurrentMonth
                      ? 'text-gray-900 dark:text-neutral-200'
                      : 'text-gray-400 dark:text-neutral-600',
                    isToday && 'text-blue-600 dark:text-blue-500 font-semibold'
                  )}
                >
                  {format(day, 'd')}
                </div>

                {/* Post Indicators */}
                <div className="space-y-1">
                  {dayPosts.slice(0, 3).map((post) => {
                    const captionPreview = post.caption
                      ? post.caption.split('\n')[0].slice(0, 20)
                      : 'Untitled'

                    return (
                      <div
                        key={post.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePostClick(post.id)
                        }}
                        className={cn(
                          'group relative px-1.5 py-1 rounded text-xs text-white truncate cursor-pointer transition-opacity',
                          'hover:opacity-80',
                          getStatusColor(post.status)
                        )}
                        title={post.caption || 'Untitled Post'}
                      >
                        <div className="font-medium truncate">{captionPreview}</div>
                      </div>
                    )
                  })}

                  {/* More indicator */}
                  {dayPosts.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-neutral-500 pl-1.5">
                      +{dayPosts.length - 3} more
                    </div>
                  )}
                </div>

                {/* Event dot indicators (Preline style) */}
                {dayPosts.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                    {dayPosts.slice(0, 3).map((post, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          'block w-1 h-1 rounded-full',
                          getStatusColor(post.status)
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="block w-3 h-3 rounded bg-gray-500 dark:bg-gray-600" />
          <span className="text-gray-600 dark:text-neutral-400">Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="block w-3 h-3 rounded bg-blue-500 dark:bg-blue-600" />
          <span className="text-gray-600 dark:text-neutral-400">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="block w-3 h-3 rounded bg-green-500 dark:bg-green-600" />
          <span className="text-gray-600 dark:text-neutral-400">Posted</span>
        </div>
      </div>
    </div>
  )
}
