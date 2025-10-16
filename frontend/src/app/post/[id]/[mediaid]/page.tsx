'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/preline/Button'
import { AlertDialog } from '@/components/AlertDialog'
import { VideoPreview, AspectRatioPreset, ASPECT_RATIOS } from '@/components/video-editor/VideoPreview'
import { FloatingIconStack } from '@/components/video-editor/FloatingIconStack'
import { EffectSelectionOverlay } from '@/components/video-editor/EffectSelectionOverlay'
import { EffectEditorOverlay } from '@/components/video-editor/EffectEditorOverlay'
import { ProcessingOverlay } from '@/components/video-editor/ProcessingOverlay'
import {
  TrimControls,
  CropControls,
  RotateControls,
  FlipControls,
  SpeedControls,
  VolumeControls,
  FiltersControls
} from '@/components/video-editor/controls'
import { useVideoEditor } from '@/hooks/video-editor'
import { useQueueMode } from '@/hooks/video-editor/useQueueMode'
import { uploadVideo } from '@/actions/video'
import { usePost } from '@/hooks/usePost'
import { useQueryClient } from '@tanstack/react-query'
import { removeVideoFromPost } from '@/actions/post'
import type { AspectRatio } from '@/lib/video-editor'
import { processBatch } from '@/lib/video-editor/operations/batch'
import { FFmpegManager } from '@/lib/video-editor/core/ffmpeg-manager'
import type { ProcessingResult } from '@/lib/video-editor/core/types'
import { createClient } from '@/lib/supabase/client'

type EffectType = 'trim' | 'crop' | 'rotate' | 'flip' | 'speed' | 'volume' | 'filters'

// Helper function to get video URL from storage path
function getVideoUrl(path: string) {
  const supabase = createClient()
  const { data } = supabase.storage.from('videos').getPublicUrl(path)
  return data.publicUrl
}

export default function VideoEditorPage({
  params
}: {
  params: Promise<{ id: string; mediaid: string }>
}) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [postId, setPostId] = useState<string | null>(null)
  const [mediaIndex, setMediaIndex] = useState<number | null>(null)
  const { data: post } = usePost(postId)

  const [videoSrc, setVideoSrc] = useState<string>('')
  const [, setIsSaving] = useState(false)
  const [showEffectSelection, setShowEffectSelection] = useState(false)
  const [activeEffect, setActiveEffect] = useState<EffectType | null>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('9:16')
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    variant: 'info' | 'error' | 'success'
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info'
  })

  // Trim state
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  // Batch processing state
  const [batchProgress, setBatchProgress] = useState<{
    current: number
    total: number
    operation: string
    subProgress?: number
  } | null>(null)
  const [, setBatchResult] = useState<{ blob: Blob; format: 'mp4' | 'webm' } | null>(null)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  // Initialize params
  useEffect(() => {
    params.then(({ id, mediaid }) => {
      setPostId(id)
      const index = parseInt(mediaid, 10)
      setMediaIndex(isNaN(index) ? null : index)
    })
  }, [params])

  // Load video URL when post and mediaIndex are available
  useEffect(() => {
    if (post && mediaIndex !== null) {
      const assets = post.assets || []
      if (mediaIndex >= 0 && mediaIndex < assets.length) {
        const videoPath = assets[mediaIndex]
        setVideoSrc(getVideoUrl(videoPath))
      }
    }
  }, [post, mediaIndex])

  // Initialize queue mode hook
  const {
    operations,
    addOperation,
    removeOperation,
    clearQueue,
    previewState,
    previewEnabled
  } = useQueueMode()

  // Helper to create remove handlers
  const createRemoveHandler = (type: string) => () => {
    removeOperation(type)
    switch (type) {
      case 'trim':
        setStartTime(0)
        setEndTime(metadata.duration || 0)
        break
    }
  }

  const {
    videoRef,
    metadata,
    onVideoMetadataLoaded: handleVideoMetadataLoaded,
    ffmpegLoaded,
    ffmpegLoading,
    isProcessing
  } = useVideoEditor({
    videoSrc,
    autoLoadFFmpeg: true,
    onProcessingComplete: async (result) => {
      await handleAutoSave(result)
    },
    onError: (error) => {
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: error.message,
        variant: 'error'
      })
    }
  })

  // Set end time when metadata loads
  const handleMetadataLoad = () => {
    handleVideoMetadataLoaded()
    if (videoRef.current) {
      setEndTime(videoRef.current.duration)
    }
  }

  // Handle trim start time change
  const handleStartTimeChange = (time: number) => {
    setStartTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  // Handle operations
  const handleTrim = async () => {
    if (startTime === 0 && endTime === metadata.duration) {
      removeOperation('trim')
      return
    }

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    const label = `Trim: ${formatTime(startTime)} → ${formatTime(endTime)}`
    addOperation('trim', label, { startTime, endTime })
  }

  const handleCrop = async (aspectRatio: AspectRatio, mode: 'letterbox' | 'crop') => {
    const label = `Crop: ${aspectRatio.label} (${mode})`
    addOperation('crop', label, {
      width: aspectRatio.width,
      height: aspectRatio.height,
      label: aspectRatio.label,
      mode
    } as unknown as import('@/lib/video-editor').CropOptions)
  }

  const handleRotate = async (degrees: 0 | 90 | 180 | 270) => {
    if (degrees === 0) {
      removeOperation('rotate')
      return
    }
    const label = `Rotate: ${degrees}°`
    addOperation('rotate', label, { degrees })
  }

  const handleFlip = async (horizontal: boolean, vertical: boolean) => {
    if (!horizontal && !vertical) {
      removeOperation('flip')
      return
    }
    const label = `Flip: ${horizontal ? 'Horizontal' : ''}${horizontal && vertical ? ' + ' : ''}${vertical ? 'Vertical' : ''}`
    addOperation('flip', label, { horizontal, vertical })
  }

  const handleSpeed = async (speedValue: number) => {
    if (speedValue === 1.0) {
      removeOperation('speed')
      return
    }
    const label = `Speed: ${speedValue}x`
    addOperation('speed', label, { speed: speedValue })
  }

  const handleVolume = async (volumeValue: number) => {
    if (volumeValue === 1.0) {
      removeOperation('volume')
      return
    }
    const label = `Volume: ${Math.round(volumeValue * 100)}%`
    addOperation('volume', label, { volume: volumeValue })
  }

  const handleFilters = async (filterOptions: import('@/lib/video-editor').FilterOptions) => {
    const allDefault =
      (filterOptions.brightness === undefined || filterOptions.brightness === 0) &&
      (filterOptions.contrast === undefined || filterOptions.contrast === 0) &&
      (filterOptions.saturation === undefined || filterOptions.saturation === 1) &&
      (filterOptions.blur === undefined || filterOptions.blur === 0)

    if (allDefault) {
      removeOperation('filters')
      return
    }

    const parts: string[] = []
    if (filterOptions.brightness) parts.push(`Brightness ${filterOptions.brightness > 0 ? '+' : ''}${Math.round(filterOptions.brightness * 100)}%`)
    if (filterOptions.contrast) parts.push(`Contrast ${filterOptions.contrast > 0 ? '+' : ''}${Math.round(filterOptions.contrast * 100)}%`)
    if (filterOptions.saturation !== undefined && filterOptions.saturation !== 1) parts.push(`Saturation ${Math.round(filterOptions.saturation * 100)}%`)
    if (filterOptions.blur) parts.push(`Blur ${filterOptions.blur}px`)
    const label = `Filters: ${parts.join(', ')}`
    addOperation('filters', label, filterOptions)
  }

  // Auto-save to database after processing
  const handleAutoSave = async (videoResult: ProcessingResult) => {
    try {
      setIsSaving(true)
      const filename = `edited-${Date.now()}.${videoResult.format}`

      const formData = new FormData()
      formData.append('video', videoResult.blob, filename)

      const uploadResult = await uploadVideo(formData)

      if (uploadResult.success) {
        queryClient.invalidateQueries({ queryKey: ['videos'] })
        queryClient.invalidateQueries({ queryKey: ['post', postId] })

        setAlertDialog({
          isOpen: true,
          title: 'Success',
          message: 'Video saved successfully!',
          variant: 'success'
        })

        // Navigate back to post page after short delay
        setTimeout(() => {
          router.push(`/post/${postId}`)
        }, 1500)
      } else {
        setAlertDialog({
          isOpen: true,
          title: 'Error',
          message: 'Failed to save video: ' + uploadResult.error,
          variant: 'error'
        })
      }
    } catch (error) {
      console.error('Save error:', error)
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to save video',
        variant: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Delete video handler
  const handleDeleteVideo = async () => {
    if (!postId || mediaIndex === null || !post) return

    const videoPath = post.assets[mediaIndex]
    if (!videoPath) return

    if (confirm('Remove this video from the post? This action cannot be undone.')) {
      const result = await removeVideoFromPost(postId, videoPath)
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['post', postId] })
        router.push(`/post/${postId}`)
      } else {
        setAlertDialog({
          isOpen: true,
          title: 'Error',
          message: 'Failed to remove video: ' + result.error,
          variant: 'error'
        })
      }
    }
  }

  // Cancel processing handler
  const handleCancelProcessing = async () => {
    setIsCancelling(true)

    try {
      const ffmpegManager = FFmpegManager.getInstance()
      ffmpegManager.terminate()
      await ffmpegManager.load()
    } catch (error) {
      console.error('Error terminating FFmpeg:', error)
    }
  }

  // Batch processing handler
  const handleApplyAll = async () => {
    if (operations.length === 0) return

    try {
      setProcessingError(null)
      setIsCancelling(false)
      setBatchProgress({ current: 0, total: operations.length, operation: 'Starting...' })

      const ffmpegManager = FFmpegManager.getInstance()
      const ffmpegInstance = ffmpegManager.getFFmpeg()

      const result = await processBatch(
        ffmpegInstance,
        videoSrc,
        operations,
        metadata,
        (current, total, operation, subProgress) => {
          if (isCancelling) {
            throw new Error('Processing cancelled by user')
          }
          setBatchProgress({ current, total, operation, subProgress })
        }
      )

      if (isCancelling) {
        return
      }

      setBatchResult(result)
      await handleAutoSave(result)
      clearQueue()

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : ''
      const isCancellationError =
        errorMsg === 'Processing cancelled by user' ||
        errorMsg.includes('terminated') ||
        errorMsg.includes('terminate()') ||
        errorMsg.includes('FFmpeg not loaded') ||
        isCancelling

      if (!isCancellationError) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to process operations'
        setProcessingError(errorMessage)
      }
    } finally {
      setBatchProgress(null)
      setIsCancelling(false)
    }
  }

  const appliedEffects = operations.map(op => op.type)

  if (!videoSrc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push(`/post/${postId}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Post
            </Button>

            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Video
            </h1>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteVideo}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
          {/* Aspect Ratio Selector */}
          <div className="mb-3">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatioPreset)}
              className={cn(
                'text-sm px-3 py-2 rounded',
                'bg-white dark:bg-gray-800',
                'border-2 border-gray-300 dark:border-gray-600',
                'text-gray-900 dark:text-white',
                'hover:border-gray-400 dark:hover:border-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'transition-colors',
                'cursor-pointer w-full'
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

          {/* Video Preview with Floating Controls and Overlays */}
          <div className="relative">
            <VideoPreview
              ref={videoRef}
              src={videoSrc}
              previewState={previewEnabled ? previewState : undefined}
              aspectRatio={aspectRatio}
              onLoadedMetadata={handleMetadataLoad}
            />

            {/* Floating Icon Stack */}
            <FloatingIconStack
              operations={operations}
              onOpenEditor={() => setShowEffectSelection(true)}
              onOpenEffect={(type) => setActiveEffect(type as EffectType)}
              onApply={handleApplyAll}
              isProcessing={isProcessing || batchProgress !== null}
            />

            {/* Effect Selection Overlay */}
            <EffectSelectionOverlay
              isOpen={showEffectSelection}
              onClose={() => setShowEffectSelection(false)}
              onSelectEffect={(type) => setActiveEffect(type)}
              appliedEffects={appliedEffects}
            />

            {/* Effect Editor Overlays */}
            {activeEffect === 'trim' && (
              <EffectEditorOverlay
                isOpen={true}
                effectType="trim"
                onClose={() => setActiveEffect(null)}
                onClear={createRemoveHandler('trim')}
              >
                <TrimControls
                  startTime={startTime}
                  endTime={endTime}
                  duration={metadata.duration}
                  onStartTimeChange={handleStartTimeChange}
                  onEndTimeChange={setEndTime}
                  onTrim={handleTrim}
                  disabled={isProcessing || !ffmpegLoaded}
                  className="text-white"
                />
              </EffectEditorOverlay>
            )}

            {activeEffect === 'crop' && (
              <EffectEditorOverlay
                isOpen={true}
                effectType="crop"
                onClose={() => setActiveEffect(null)}
                onClear={createRemoveHandler('crop')}
              >
                <CropControls
                  onCrop={handleCrop}
                  disabled={isProcessing || !ffmpegLoaded}
                  className="text-white"
                />
              </EffectEditorOverlay>
            )}

            {activeEffect === 'rotate' && (
              <EffectEditorOverlay
                isOpen={true}
                effectType="rotate"
                onClose={() => setActiveEffect(null)}
                onClear={createRemoveHandler('rotate')}
              >
                <RotateControls
                  onRotate={(options) => handleRotate(options.degrees)}
                  disabled={isProcessing || !ffmpegLoaded}
                  className="text-white"
                />
              </EffectEditorOverlay>
            )}

            {activeEffect === 'flip' && (
              <EffectEditorOverlay
                isOpen={true}
                effectType="flip"
                onClose={() => setActiveEffect(null)}
                onClear={createRemoveHandler('flip')}
              >
                <FlipControls
                  onFlip={(options) => handleFlip(options.horizontal, options.vertical)}
                  disabled={isProcessing || !ffmpegLoaded}
                  className="text-white"
                />
              </EffectEditorOverlay>
            )}

            {activeEffect === 'speed' && (
              <EffectEditorOverlay
                isOpen={true}
                effectType="speed"
                onClose={() => setActiveEffect(null)}
                onClear={createRemoveHandler('speed')}
              >
                <SpeedControls
                  onApplySpeed={handleSpeed}
                  disabled={isProcessing || !ffmpegLoaded}
                  className="text-white"
                />
              </EffectEditorOverlay>
            )}

            {activeEffect === 'volume' && (
              <EffectEditorOverlay
                isOpen={true}
                effectType="volume"
                onClose={() => setActiveEffect(null)}
                onClear={createRemoveHandler('volume')}
              >
                <VolumeControls
                  onApplyVolume={handleVolume}
                  disabled={isProcessing || !ffmpegLoaded}
                  className="text-white"
                />
              </EffectEditorOverlay>
            )}

            {activeEffect === 'filters' && (
              <EffectEditorOverlay
                isOpen={true}
                effectType="filters"
                onClose={() => setActiveEffect(null)}
                onClear={createRemoveHandler('filters')}
              >
                <FiltersControls
                  onApplyFilters={handleFilters}
                  disabled={isProcessing || !ffmpegLoaded}
                  className="text-white"
                />
              </EffectEditorOverlay>
            )}

            {/* Processing Overlay */}
            <ProcessingOverlay
              isProcessing={batchProgress !== null}
              progress={batchProgress}
              error={processingError}
              onCancel={handleCancelProcessing}
            />
          </div>

          {/* FFmpeg Loading Indicator */}
          {ffmpegLoading && (
            <div className="flex items-center gap-2 p-3 mt-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Loading video editor... This may take a moment.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
      />
    </div>
  )
}
