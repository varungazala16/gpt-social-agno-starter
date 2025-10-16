'use client'

import { PostStatus } from '@/actions/post'
import { Button } from '@/components/ui/button'

interface StatusButtonsProps {
  currentStatus: PostStatus
  onStatusChange: (status: PostStatus) => void
  canPublish: boolean // true if caption, published date, and assets are all filled
}

export function StatusButtons({ currentStatus, onStatusChange, canPublish }: StatusButtonsProps) {
  if (currentStatus === 'draft') {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onStatusChange('scheduled')}
          disabled={!canPublish}
          variant="secondary"
          size="sm"
        >
          Schedule
        </Button>
        <Button
          onClick={() => onStatusChange('posted')}
          disabled={!canPublish}
          variant="default"
          size="sm"
        >
          Publish
        </Button>
      </div>
    )
  }

  if (currentStatus === 'scheduled') {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onStatusChange('draft')}
          variant="outline"
          size="sm"
        >
          Draft
        </Button>
        <Button
          onClick={() => onStatusChange('posted')}
          variant="default"
          size="sm"
        >
          Publish
        </Button>
      </div>
    )
  }

  if (currentStatus === 'posted') {
    return (
      <Button
        onClick={() => onStatusChange('draft')}
        variant="outline"
        size="sm"
      >
        Unpublish
      </Button>
    )
  }

  return null
}
