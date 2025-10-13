'use client'

import { useState } from 'react'
import { Loader2, AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '../Modal'
import { AlertDialog } from '../AlertDialog'
import { VideoPreview, AspectRatioPreset } from './VideoPreview'
import { FloatingIconStack } from './FloatingIconStack'
import { EffectSelectionOverlay } from './EffectSelectionOverlay'
import { EffectEditorOverlay } from './EffectEditorOverlay'
import { ProcessingOverlay } from './ProcessingOverlay'
import {
  TrimControls,
  CropControls,
  RotateControls,
  FlipControls,
  SpeedControls,
  VolumeControls,
  FiltersControls
} from './controls'
import { useVideoEditor } from '@/hooks/video-editor'
import { useQueueMode } from '@/hooks/video-editor/useQueueMode'
import { uploadVideo } from '@/actions/video'
import { useQueryClient } from '@tanstack/react-query'
import type { AspectRatio } from '@/lib/video-editor'
import { processBatch } from '@/lib/video-editor/operations/batch'
import { FFmpegManager } from '@/lib/video-editor/core/ffmpeg-manager'

interface VideoEditorModalProps {
  src: string
  isOpen: boolean
  onClose: () => void
  onSaveComplete?: () => void
  className?: string
}

type EffectType = 'trim' | 'crop' | 'rotate' | 'flip' | 'speed' | 'volume' | 'filters'

export function VideoEditorModal({
  src,
  isOpen,
  onClose,
  onSaveComplete,
  className
}: VideoEditorModalProps) {
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const [showEffectSelection, setShowEffectSelection] = useState(false)
  const [activeEffect, setActiveEffect] = useState<EffectType | null>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('16:9')
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
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; operation: string; subProgress?: number } | null>(null)
  const [batchResult, setBatchResult] = useState<{ blob: Blob; format: 'mp4' | 'webm' } | null>(null)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  // Initialize queue mode hook
  const {
    operations,
    addOperation,
    getOperation,
    removeOperation,
    clearQueue,
    previewState,
    previewEnabled
  } = useQueueMode()

  // Helper to check if an operation type is queued
  const hasQueued = (type: string) => !!getOperation(type)

  // Helper to create remove handlers
  const createRemoveHandler = (type: string) => () => {
    removeOperation(type)
    // Reset local state based on type
    switch (type) {
      case 'trim':
        setStartTime(0)
        setEndTime(metadata.duration || 0)
        break
      // Note: Other operation types (crop, rotate, flip, speed, volume, filters)
      // maintain their own state within their respective control components
    }
  }

  const {
    videoRef,
    metadata,
    onVideoMetadataLoaded: handleVideoMetadataLoaded,
    ffmpegLoaded,
    ffmpegLoading,
    ffmpegProgress,
    isProcessing,
    processingOperation,
    result
  } = useVideoEditor({
    videoSrc: src,
    autoLoadFFmpeg: isOpen,
    onProcessingComplete: async (result) => {
      // Automatically save to database instead of showing result modal
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
    // Remove operation if trim is default (entire video)
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
    // Remove operation if no rotation (0 degrees)
    if (degrees === 0) {
      removeOperation('rotate')
      return
    }
    const label = `Rotate: ${degrees}°`
    addOperation('rotate', label, { degrees })
  }

  const handleFlip = async (horizontal: boolean, vertical: boolean) => {
    // Remove operation if both flips are off
    if (!horizontal && !vertical) {
      removeOperation('flip')
      return
    }
    const label = `Flip: ${horizontal ? 'Horizontal' : ''}${horizontal && vertical ? ' + ' : ''}${vertical ? 'Vertical' : ''}`
    addOperation('flip', label, { horizontal, vertical })
  }

  const handleSpeed = async (speedValue: number) => {
    // Remove operation if speed is normal (1.0x)
    if (speedValue === 1.0) {
      removeOperation('speed')
      return
    }
    const label = `Speed: ${speedValue}x`
    addOperation('speed', label, { speed: speedValue })
  }

  const handleVolume = async (volumeValue: number) => {
    // Remove operation if volume is original (1.0 / 100%)
    if (volumeValue === 1.0) {
      removeOperation('volume')
      return
    }
    const label = `Volume: ${Math.round(volumeValue * 100)}%`
    addOperation('volume', label, { volume: volumeValue })
  }

  const handleFilters = async (filterOptions: import('@/lib/video-editor').FilterOptions) => {
    // Check if all filters are at default values
    const allDefault =
      (filterOptions.brightness === undefined || filterOptions.brightness === 0) &&
      (filterOptions.contrast === undefined || filterOptions.contrast === 0) &&
      (filterOptions.saturation === undefined || filterOptions.saturation === 1) &&
      (filterOptions.blur === undefined || filterOptions.blur === 0)

    // Remove operation if all filters are default
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

        setAlertDialog({
          isOpen: true,
          title: 'Success',
          message: 'Video saved successfully!',
          variant: 'success'
        })
        onClose()
        if (onSaveComplete) {
          onSaveComplete()
        }
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

  // Cancel processing handler
  const handleCancelProcessing = () => {
    setIsCancelling(true)
    setBatchProgress(null)
    setProcessingError(null)
    setIsCancelling(false)
    // Note: FFmpeg processing cannot be truly cancelled mid-operation,
    // but we can stop showing the overlay and prevent auto-save
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
        src,
        operations,
        metadata,
        (current, total, operation, subProgress) => {
          if (isCancelling) {
            throw new Error('Processing cancelled by user')
          }
          setBatchProgress({ current, total, operation, subProgress })
        }
      )

      // Check if cancelled during processing
      if (isCancelling) {
        setBatchProgress(null)
        return
      }

      // Save batch result for Download/Save buttons
      setBatchResult(result)

      // Automatically save to database
      await handleAutoSave(result)
      clearQueue()

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process operations'
      setProcessingError(errorMessage)
    } finally {
      if (!isCancelling) {
        setBatchProgress(null)
      }
    }
  }

  const getProgressPercentage = () => {
    return Math.round((ffmpegProgress?.progress || 0) * 100)
  }

  // Get list of applied effect types for filtering in selection overlay
  const appliedEffects = operations.map(op => op.type)

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Video">
        <div className={cn('w-full', className)}>
          {/* Video Preview with Floating Controls and Overlays */}
          <div className="relative">
            <VideoPreview
              ref={videoRef}
              src={src}
              previewState={previewEnabled ? previewState : undefined}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
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

            {/* Effect Selection Overlay - appears over video */}
            <EffectSelectionOverlay
              isOpen={showEffectSelection}
              onClose={() => setShowEffectSelection(false)}
              onSelectEffect={(type) => setActiveEffect(type)}
              appliedEffects={appliedEffects}
            />

            {/* Effect Editor Overlays - appear over video */}
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

          {/* Info Message */}
          <div className="flex items-start gap-2 p-3 mt-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 dark:text-gray-300">
              All video processing happens entirely in your browser using FFmpeg WebAssembly.
              Your video data never leaves your device.
            </p>
          </div>
        </div>
      </Modal>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
      />
    </>
  )
}
