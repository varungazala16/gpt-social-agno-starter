'use client'

import { forwardRef, useMemo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { PreviewState } from '@/lib/video-editor/core/queue-types'

interface VideoPreviewProps {
  src: string
  previewState?: PreviewState
  onLoadedMetadata?: () => void
  className?: string
}

export const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ src, previewState, onLoadedMetadata, className }, ref) => {
    const localRef = useRef<HTMLVideoElement>(null)

    // Forward ref to parent
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(localRef.current)
      } else if (ref) {
        ref.current = localRef.current
      }
    }, [ref])

    // Calculate video src with Media Fragments for trim
    const videoSrc = useMemo(() => {
      if (!previewState?.trimStart && !previewState?.trimEnd) {
        return src
      }

      // Build Media Fragment URI
      // Format: video.mp4#t=start,end or video.mp4#t=start
      const start = previewState.trimStart ?? 0
      const end = previewState.trimEnd

      if (end !== undefined && end > start) {
        return `${src}#t=${start},${end}`
      } else if (start > 0) {
        return `${src}#t=${start}`
      }

      return src
    }, [src, previewState?.trimStart, previewState?.trimEnd])

    // Calculate CSS transforms from preview state
    const videoStyle = useMemo(() => {
      if (!previewState) return {}

      const transforms: string[] = []

      // Rotation
      if (previewState.rotation !== 0) {
        transforms.push(`rotate(${previewState.rotation}deg)`)
      }

      // Flip
      const scaleX = previewState.flipH ? -1 : 1
      const scaleY = previewState.flipV ? -1 : 1
      if (scaleX !== 1 || scaleY !== 1) {
        transforms.push(`scale(${scaleX}, ${scaleY})`)
      }

      // Filters
      const filters: string[] = []

      // Brightness: -1 to 1 → 0 to 2 (1 is normal)
      if (previewState.brightness !== 0) {
        const brightness = 1 + previewState.brightness
        filters.push(`brightness(${brightness})`)
      }

      // Contrast: -1 to 1 → 0 to 2 (1 is normal)
      if (previewState.contrast !== 0) {
        const contrast = 1 + previewState.contrast
        filters.push(`contrast(${contrast})`)
      }

      // Saturation: 0 to 3 (1 is normal)
      if (previewState.saturation !== 1) {
        filters.push(`saturate(${previewState.saturation})`)
      }

      // Blur: 0 to 20px
      if (previewState.blur > 0) {
        filters.push(`blur(${previewState.blur}px)`)
      }

      return {
        transform: transforms.length > 0 ? transforms.join(' ') : undefined,
        filter: filters.length > 0 ? filters.join(' ') : undefined,
        transition: 'all 0.3s ease' // Smooth transitions
      }
    }, [previewState])

    // Calculate container adjustments for rotation
    const containerStyle = useMemo(() => {
      if (!previewState || (previewState.rotation !== 90 && previewState.rotation !== 270)) {
        return {}
      }

      // For 90/270 degree rotations, we need to swap width/height
      return {
        aspectRatio: '9 / 16' // Inverse of video
      }
    }, [previewState])

    return (
      <div
        className={cn('aspect-video bg-black rounded-xl overflow-hidden shadow-lg flex items-center justify-center', className)}
        style={containerStyle}
      >
        <video
          ref={localRef}
          src={videoSrc}
          className="w-full h-full object-contain"
          controls
          onLoadedMetadata={onLoadedMetadata}
          style={videoStyle}
        />
      </div>
    )
  }
)

VideoPreview.displayName = 'VideoPreview'
