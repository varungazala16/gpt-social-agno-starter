'use client'

import { useState } from 'react'
import {
  Scissors,
  Crop,
  RotateCw,
  Gauge,
  Volume2,
  Sparkles,
  Download,
  Upload,
  Loader2,
  AlertCircle,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '../Modal'
import { AlertDialog } from '../AlertDialog'
import { VideoPlayer } from './VideoPlayer'
import { VideoPreview } from './VideoPreview'
import { QueuePanel } from './QueuePanel'
import {
  TrimControls,
  CropControls,
  RotateControls,
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

type Tab = 'trim' | 'crop' | 'rotate' | 'speed' | 'volume' | 'filters'

const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: 'trim', label: 'Trim', icon: Scissors },
  { id: 'crop', label: 'Crop', icon: Crop },
  { id: 'rotate', label: 'Rotate', icon: RotateCw },
  { id: 'speed', label: 'Speed', icon: Gauge },
  { id: 'volume', label: 'Volume', icon: Volume2 },
  { id: 'filters', label: 'Filters', icon: Sparkles },
]

export function VideoEditorModal({
  src,
  isOpen,
  onClose,
  onSaveComplete,
  className
}: VideoEditorModalProps) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<Tab>('trim')
  const [showResultModal, setShowResultModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
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

  // Queue mode state
  const [queueMode, setQueueMode] = useState(false)
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; operation: string } | null>(null)

  // Initialize queue mode hook
  const {
    operations,
    addOperation,
    removeOperation,
    clearQueue,
    previewState,
    previewEnabled
  } = useQueueMode()

  const {
    videoRef,
    metadata,
    onVideoMetadataLoaded: handleVideoMetadataLoaded,
    ffmpegLoaded,
    ffmpegLoading,
    ffmpegProgress,
    isProcessing,
    processingOperation,
    result,
    trim,
    crop,
    rotate,
    flip,
    speed,
    volume,
    filters
  } = useVideoEditor({
    videoSrc: src,
    autoLoadFFmpeg: isOpen,
    onProcessingComplete: () => {
      setShowResultModal(true)
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
    if (queueMode) {
      // Add to queue instead of processing
      const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      }
      const label = `Trim: ${formatTime(startTime)} → ${formatTime(endTime)}`
      addOperation('trim', label, { startTime, endTime })
    } else {
      // Immediate processing (existing behavior)
      await trim({ startTime, endTime })
    }
  }

  const handleCrop = async (aspectRatio: AspectRatio, mode: 'letterbox' | 'crop') => {
    if (queueMode) {
      const label = `Crop: ${aspectRatio.label} (${mode})`
      addOperation('crop', label, {
        width: aspectRatio.width,
        height: aspectRatio.height,
        label: aspectRatio.label,
        mode
      } as unknown as import('@/lib/video-editor').CropOptions)
    } else {
      await crop(aspectRatio, mode)
    }
  }

  const handleRotate = async (degrees: 0 | 90 | 180 | 270) => {
    if (queueMode) {
      const label = `Rotate: ${degrees}°`
      addOperation('rotate', label, { degrees })
    } else {
      await rotate({ degrees })
    }
  }

  const handleFlip = async (horizontal: boolean, vertical: boolean) => {
    if (queueMode) {
      const label = `Flip: ${horizontal ? 'Horizontal' : ''}${horizontal && vertical ? ' + ' : ''}${vertical ? 'Vertical' : ''}`
      addOperation('flip', label, { horizontal, vertical })
    } else {
      await flip({ horizontal, vertical })
    }
  }

  const handleSpeed = async (speedValue: number) => {
    if (queueMode) {
      const label = `Speed: ${speedValue}x`
      addOperation('speed', label, { speed: speedValue })
    } else {
      await speed({ speed: speedValue })
    }
  }

  const handleVolume = async (volumeValue: number) => {
    if (queueMode) {
      const label = `Volume: ${Math.round(volumeValue * 100)}%`
      addOperation('volume', label, { volume: volumeValue })
    } else {
      await volume({ volume: volumeValue })
    }
  }

  const handleFilters = async (filterOptions: import('@/lib/video-editor').FilterOptions) => {
    if (queueMode) {
      const parts: string[] = []
      if (filterOptions.brightness) parts.push(`Brightness ${filterOptions.brightness > 0 ? '+' : ''}${Math.round(filterOptions.brightness * 100)}%`)
      if (filterOptions.contrast) parts.push(`Contrast ${filterOptions.contrast > 0 ? '+' : ''}${Math.round(filterOptions.contrast * 100)}%`)
      if (filterOptions.saturation !== undefined && filterOptions.saturation !== 1) parts.push(`Saturation ${Math.round(filterOptions.saturation * 100)}%`)
      if (filterOptions.blur) parts.push(`Blur ${filterOptions.blur}px`)
      const label = `Filters: ${parts.join(', ')}`
      addOperation('filters', label, filterOptions)
    } else {
      await filters(filterOptions)
    }
  }

  // Batch processing handler
  const handleApplyAll = async () => {
    if (operations.length === 0) return

    try {
      setBatchProgress({ current: 0, total: operations.length, operation: 'Starting...' })

      const ffmpegManager = FFmpegManager.getInstance()
      const ffmpegInstance = ffmpegManager.getFFmpeg()

      await processBatch(
        ffmpegInstance,
        src,
        operations,
        metadata,
        (current, total, operation) => {
          setBatchProgress({ current, total, operation })
        }
      )

      // Show result
      setShowResultModal(true)
      clearQueue()

    } catch (error) {
      setAlertDialog({
        isOpen: true,
        title: 'Batch Processing Error',
        message: error instanceof Error ? error.message : 'Failed to process operations',
        variant: 'error'
      })
    } finally {
      setBatchProgress(null)
    }
  }

  // Download result
  const handleDownload = () => {
    if (!result) return

    const url = URL.createObjectURL(result.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `edited-${Date.now()}.${result.format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Save to gallery
  const handleSave = async () => {
    if (!result) return

    try {
      setIsSaving(true)
      const filename = `edited-${Date.now()}.${result.format}`

      const formData = new FormData()
      formData.append('video', result.blob, filename)

      const uploadResult = await uploadVideo(formData)

      if (uploadResult.success) {
        queryClient.invalidateQueries({ queryKey: ['videos'] })

        setAlertDialog({
          isOpen: true,
          title: 'Success',
          message: 'Video saved successfully!',
          variant: 'success'
        })
        setShowResultModal(false)
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

  const getProgressPercentage = () => {
    return Math.round((ffmpegProgress?.progress || 0) * 100)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Video">
        <div className={cn('w-full space-y-4 sm:space-y-6', className)}>
          {/* Video Player - with preview support */}
          {queueMode ? (
            <VideoPreview
              ref={videoRef}
              src={src}
              previewState={previewEnabled ? previewState : undefined}
              onLoadedMetadata={handleMetadataLoad}
            />
          ) : (
            <VideoPlayer
              ref={videoRef}
              src={src}
              onLoadedMetadata={handleMetadataLoad}
            />
          )}

          {/* FFmpeg Loading Indicator */}
          {ffmpegLoading && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Loading video editor... This may take a moment.
              </p>
            </div>
          )}

          {/* Queue Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium">Queue Mode</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (Stack operations before processing)
              </span>
            </div>

            <button
              onClick={() => setQueueMode(!queueMode)}
              disabled={isProcessing}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                queueMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700',
                isProcessing && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  queueMode ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Processing Progress */}
          {(isProcessing || batchProgress) && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: batchProgress
                      ? `${Math.round((batchProgress.current / batchProgress.total) * 100)}%`
                      : `${getProgressPercentage()}%`
                  }}
                />
              </div>
              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                {batchProgress
                  ? `${batchProgress.operation} (${batchProgress.current}/${batchProgress.total})`
                  : `${processingOperation ? `${processingOperation}: ` : ''}${getProgressPercentage()}%`
                }
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={isProcessing || !ffmpegLoaded}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
                      (isProcessing || !ffmpegLoaded) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            {activeTab === 'trim' && (
              <TrimControls
                startTime={startTime}
                endTime={endTime}
                duration={metadata.duration}
                onStartTimeChange={handleStartTimeChange}
                onEndTimeChange={setEndTime}
                onTrim={handleTrim}
                disabled={isProcessing || !ffmpegLoaded}
                queueMode={queueMode}
              />
            )}

            {activeTab === 'crop' && (
              <CropControls
                onCrop={handleCrop}
                disabled={isProcessing || !ffmpegLoaded}
                queueMode={queueMode}
              />
            )}

            {activeTab === 'rotate' && (
              <RotateControls
                onRotate={(options) => handleRotate(options.degrees)}
                onFlip={(options) => handleFlip(options.horizontal, options.vertical)}
                disabled={isProcessing || !ffmpegLoaded}
                queueMode={queueMode}
              />
            )}

            {activeTab === 'speed' && (
              <SpeedControls
                onApplySpeed={handleSpeed}
                disabled={isProcessing || !ffmpegLoaded}
                queueMode={queueMode}
              />
            )}

            {activeTab === 'volume' && (
              <VolumeControls
                onApplyVolume={handleVolume}
                disabled={isProcessing || !ffmpegLoaded}
                queueMode={queueMode}
              />
            )}

            {activeTab === 'filters' && (
              <FiltersControls
                onApplyFilters={handleFilters}
                disabled={isProcessing || !ffmpegLoaded}
                queueMode={queueMode}
              />
            )}
          </div>

          {/* Queue Panel - shows only in queue mode */}
          {queueMode && (
            <QueuePanel
              operations={operations}
              onRemove={removeOperation}
              onClear={clearQueue}
              onApplyAll={handleApplyAll}
              isProcessing={isProcessing || batchProgress !== null}
            />
          )}

          {/* Info Message */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-200">
              All video processing happens entirely in your browser using FFmpeg WebAssembly.
              Your video data never leaves your device.
            </p>
          </div>
        </div>
      </Modal>

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        title="Video Processed Successfully"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Your edited video is ready!
              </p>
              <p className="text-sm text-green-800 dark:text-green-200">
                The video was processed entirely in your browser using FFmpeg WebAssembly.
                The exported file is in {result?.format.toUpperCase()} format.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={isSaving}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors',
                isSaving && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors',
                isSaving && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Save to Gallery
                </>
              )}
            </button>
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
