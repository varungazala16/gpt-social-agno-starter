'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  src: string
  onLoadedMetadata?: () => void
  className?: string
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, onLoadedMetadata, className }, ref) => {
    return (
      <div className={cn('aspect-video bg-black overflow-hidden', className)}>
        <video
          ref={ref}
          src={src}
          className="w-full h-full object-contain"
          controls
          onLoadedMetadata={onLoadedMetadata}
        />
      </div>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'
