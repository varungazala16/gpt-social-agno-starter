'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface HoverVideoPreviewProps {
  src: string
  className?: string
  onClick?: () => void
}

export function HoverVideoPreview({ src, className, onClick }: HoverVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      controls={false}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('w-full h-full object-cover', onClick && 'cursor-pointer', className)}
    />
  )
}
