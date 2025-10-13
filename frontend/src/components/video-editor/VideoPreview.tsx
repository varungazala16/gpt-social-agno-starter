'use client'

import { forwardRef, useMemo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { VideoControls } from './VideoControls'
import { Monitor } from 'lucide-react'
import type { PreviewState } from '@/lib/video-editor/core/queue-types'

export type AspectRatioPreset = '16:9' | '9:16' | '1:1' | '4:5' | '4:3'

export const ASPECT_RATIOS = {
  '16:9': { ratio: '16 / 9', label: '16:9 Landscape', description: 'YouTube, TV' },
  '9:16': { ratio: '9 / 16', label: '9:16 Portrait', description: 'TikTok, Stories' },
  '1:1': { ratio: '1 / 1', label: '1:1 Square', description: 'Instagram' },
  '4:5': { ratio: '4 / 5', label: '4:5 Portrait', description: 'Instagram Feed' },
  '4:3': { ratio: '4 / 3', label: '4:3 Classic', description: 'Classic TV' }
} as const

// Crop Overlay Component
interface CropOverlayProps {
  cropAspectRatio: { width: number; height: number; label: string }
  cropMode: 'letterbox' | 'crop'
  containerAspectRatio: string
}

function CropOverlay({ cropAspectRatio, cropMode, containerAspectRatio }: CropOverlayProps) {
  const [containerWidth, containerHeight] = containerAspectRatio.split(' / ').map(Number)
  const containerRatio = containerWidth / containerHeight
  const cropRatio = cropAspectRatio.width / cropAspectRatio.height

  // Determine if we need horizontal or vertical bars
  const needsHorizontalBars = cropRatio < containerRatio
  const needsVerticalBars = cropRatio > containerRatio

  if (cropMode === 'letterbox') {
    // Show black bars where letterboxing will occur
    if (needsHorizontalBars) {
      // Top and bottom bars
      const barHeightPercent = ((containerRatio - cropRatio) / containerRatio) * 50
      return (
        <>
          <div className="absolute top-0 left-0 right-0 bg-black/80 pointer-events-none" style={{ height: `${barHeightPercent}%` }} />
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 pointer-events-none" style={{ height: `${barHeightPercent}%` }} />
        </>
      )
    } else if (needsVerticalBars) {
      // Left and right bars
      const barWidthPercent = ((1 - cropRatio / containerRatio) / 2) * 100
      return (
        <>
          <div className="absolute top-0 left-0 bottom-0 bg-black/80 pointer-events-none" style={{ width: `${barWidthPercent}%` }} />
          <div className="absolute top-0 right-0 bottom-0 bg-black/80 pointer-events-none" style={{ width: `${barWidthPercent}%` }} />
        </>
      )
    }
  } else {
    // Crop mode: show dimmed overlay outside crop region
    if (needsHorizontalBars) {
      // Crop top and bottom
      const cropHeightPercent = ((containerRatio - cropRatio) / containerRatio) * 50
      return (
        <>
          <div className="absolute top-0 left-0 right-0 bg-red-500/20 pointer-events-none border-b-2 border-red-500" style={{ height: `${cropHeightPercent}%` }} />
          <div className="absolute bottom-0 left-0 right-0 bg-red-500/20 pointer-events-none border-t-2 border-red-500" style={{ height: `${cropHeightPercent}%` }} />
        </>
      )
    } else if (needsVerticalBars) {
      // Crop left and right
      const cropWidthPercent = ((1 - cropRatio / containerRatio) / 2) * 100
      return (
        <>
          <div className="absolute top-0 left-0 bottom-0 bg-red-500/20 pointer-events-none border-r-2 border-red-500" style={{ width: `${cropWidthPercent}%` }} />
          <div className="absolute top-0 right-0 bottom-0 bg-red-500/20 pointer-events-none border-l-2 border-red-500" style={{ width: `${cropWidthPercent}%` }} />
        </>
      )
    }
  }

  return null
}

interface VideoPreviewProps {
  src: string
  previewState?: PreviewState
  onLoadedMetadata?: () => void
  aspectRatio?: AspectRatioPreset
  onAspectRatioChange?: (ratio: AspectRatioPreset) => void
  className?: string
}

export const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ src, previewState, onLoadedMetadata, aspectRatio = '16:9', onAspectRatioChange, className }, ref) => {
    const localRef = useRef<HTMLVideoElement>(null)
    const ratioConfig = ASPECT_RATIOS[aspectRatio]

    // Forward ref to parent
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(localRef.current)
      } else if (ref) {
        ref.current = localRef.current
      }
    }, [ref])

    // Apply speed (playbackRate) when preview state changes
    useEffect(() => {
      const video = localRef.current
      if (!video) return

      if (previewState?.speed !== undefined) {
        video.playbackRate = previewState.speed
      } else {
        video.playbackRate = 1.0 // Reset to normal speed
      }
    }, [previewState?.speed])

    // Handle trim preview with event listeners (more reliable than Media Fragments)
    useEffect(() => {
      const video = localRef.current
      if (!video) return

      const trimStart = previewState?.trimStart
      const trimEnd = previewState?.trimEnd

      // No trim applied, clear listeners
      if (trimStart === undefined && trimEnd === undefined) {
        return
      }

      // Constrain playback to trim range
      const handleTimeUpdate = () => {
        if (trimEnd !== undefined && video.currentTime >= trimEnd) {
          // Loop back to start or pause at end
          if (trimStart !== undefined) {
            video.currentTime = trimStart
          } else {
            video.pause()
          }
        }
      }

      // Start at trim start time when loaded
      const handleLoadedMetadata = () => {
        if (trimStart !== undefined && video.currentTime < trimStart) {
          video.currentTime = trimStart
        }
      }

      // When seeking, constrain to trim range
      const handleSeeking = () => {
        if (trimStart !== undefined && video.currentTime < trimStart) {
          video.currentTime = trimStart
        }
        if (trimEnd !== undefined && video.currentTime > trimEnd) {
          video.currentTime = trimEnd
        }
      }

      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('seeking', handleSeeking)

      // Set initial time if video is already loaded
      if (video.readyState >= 1 && trimStart !== undefined) {
        video.currentTime = trimStart
      }

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('seeking', handleSeeking)
      }
    }, [previewState?.trimStart, previewState?.trimEnd])

    // Calculate CSS transforms and sizing from preview state
    const videoStyle = useMemo(() => {
      if (!previewState) return {}

      const transforms: string[] = []

      // Rotation with scaling to fit
      if (previewState.rotation !== 0) {
        transforms.push(`rotate(${previewState.rotation}deg)`)

        // For 90/270 rotations, scale down so the rotated video fits in the container
        if (previewState.rotation === 90 || previewState.rotation === 270) {
          const [width, height] = ratioConfig.ratio.split(' / ').map(Number)
          const aspectRatio = width / height
          // Scale by the inverse aspect ratio to fit rotated dimensions
          const scaleFactor = Math.min(aspectRatio, 1 / aspectRatio)
          transforms.push(`scale(${scaleFactor})`)
        }
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
    }, [previewState, ratioConfig])

    return (
      <div
        className={cn(
          'bg-black overflow-hidden relative mx-auto w-full',
          className
        )}
        style={{
          aspectRatio: ratioConfig.ratio,
          maxWidth: '1280px'
        }}
      >
        {/* Aspect Ratio Selector */}
        {onAspectRatioChange && (
          <div className="absolute top-2 left-2 z-30">
            <select
              value={aspectRatio}
              onChange={(e) => onAspectRatioChange(e.target.value as AspectRatioPreset)}
              className={cn(
                'text-xs px-2 py-1 rounded',
                'bg-black/60 backdrop-blur-sm text-white',
                'border border-white/20',
                'hover:bg-black/80 transition-colors',
                'cursor-pointer'
              )}
              title="Select aspect ratio"
            >
              {(Object.keys(ASPECT_RATIOS) as AspectRatioPreset[]).map((key) => (
                <option key={key} value={key}>
                  {ASPECT_RATIOS[key].label} - {ASPECT_RATIOS[key].description}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="w-full h-full flex items-center justify-center relative">
          <video
            ref={localRef}
            src={src}
            className="w-full h-full object-contain"
            onLoadedMetadata={onLoadedMetadata}
            style={videoStyle}
          />

          {/* Crop Preview Overlay */}
          {previewState?.cropAspectRatio && previewState?.cropMode && (
            <CropOverlay
              cropAspectRatio={previewState.cropAspectRatio}
              cropMode={previewState.cropMode}
              containerAspectRatio={ratioConfig.ratio}
            />
          )}
        </div>

        <VideoControls
          videoRef={localRef}
          trimStart={previewState?.trimStart}
          trimEnd={previewState?.trimEnd}
        />
      </div>
    )
  }
)

VideoPreview.displayName = 'VideoPreview'
