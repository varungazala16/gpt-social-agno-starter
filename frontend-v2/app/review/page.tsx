'use client'

import { useState, useEffect } from 'react'
import { Upload, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AccountSelector } from '@/components/AccountSelector'
import { VideoUploader } from '@/components/review/VideoUploader'
import { VideoPreview } from '@/components/review/VideoPreview'
import { AnalysisScores } from '@/components/review/AnalysisScores'
import { FeedbackList } from '@/components/review/FeedbackList'
import { Button } from '@/components/ui/button'
import { VideoReview, VideoAnalysis, FeedbackItem, AnalysisStatus } from '@/types'
import { uploadVideo, analyzeVideoWithCallback, AnalysisUpdate } from '@/lib/api/mock-review'

const TOTAL_FEEDBACK_COUNT = 3

export default function ReviewPage() {
  const router = useRouter()
  const [status, setStatus] = useState<AnalysisStatus>('idle')
  const [video, setVideo] = useState<VideoReview | null>(null)
  const [analysis, setAnalysis] = useState<VideoAnalysis>({ analysisComplete: false })
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])

  useEffect(() => {
    // Cleanup video URL on unmount
    return () => {
      if (video?.videoUrl) {
        URL.revokeObjectURL(video.videoUrl)
      }
    }
  }, [video])

  async function handleUpload(file: File) {
    setStatus('uploading')
    setAnalysis({ analysisComplete: false })
    setFeedback([])

    try {
      const uploadedVideo = await uploadVideo(file)
      setVideo(uploadedVideo)
      setStatus('analyzing')

      // Start analysis with progressive updates
      const cleanup = analyzeVideoWithCallback(uploadedVideo.id, (update: AnalysisUpdate) => {
        setAnalysis((prev) => ({
          ...prev,
          hookScore: update.hookScore ?? prev.hookScore,
          endingScore: update.endingScore ?? prev.endingScore,
          hookReason: update.hookReason ?? prev.hookReason,
          endingReason: update.endingReason ?? prev.endingReason,
          analysisComplete: update.complete ?? prev.analysisComplete,
        }))

        if (update.newFeedback) {
          setFeedback((prev) => [...prev, update.newFeedback!])
        }

        if (update.complete) {
          setStatus('complete')
        }
      })

      // Store cleanup function if needed
      return cleanup
    } catch (error) {
      console.error('Upload failed:', error)
      setStatus('error')
    }
  }

  function handleGetCaptionSuggestions() {
    router.push('/chat?prompt=Generate caption suggestions for my video')
  }

  function handleNewUpload() {
    setVideo(null)
    setAnalysis({ analysisComplete: false })
    setFeedback([])
    setStatus('idle')
  }

  const isAnalyzing = status === 'analyzing'
  const hasVideo = video !== null
  const pendingFeedbackCount = isAnalyzing ? Math.max(0, TOTAL_FEEDBACK_COUNT - feedback.length) : 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Review</h1>
          <AccountSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-3xl">
        {/* Video Upload/Preview Section */}
        {!hasVideo ? (
          <VideoUploader
            onUpload={handleUpload}
            isUploading={status === 'uploading'}
          />
        ) : (
          <VideoPreview
            thumbnailUrl={video.thumbnailUrl}
            videoUrl={video.videoUrl}
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {hasVideo && (
            <Button
              variant="outline"
              onClick={handleNewUpload}
              className="flex-1 gap-2"
              disabled={isAnalyzing}
            >
              <Upload className="w-4 h-4" />
              Upload New Video
            </Button>
          )}
          <Button
            variant="default"
            onClick={handleGetCaptionSuggestions}
            className={`gap-2 ${hasVideo ? 'flex-1' : 'w-full'}`}
          >
            <MessageCircle className="w-4 h-4" />
            Get Caption Suggestions
          </Button>
        </div>

        {/* Analysis Scores */}
        {hasVideo && (
          <AnalysisScores
            hookScore={analysis.hookScore}
            endingScore={analysis.endingScore}
            hookReason={analysis.hookReason}
            endingReason={analysis.endingReason}
            issuesCount={analysis.endingScore !== undefined ? 2 : undefined}
          />
        )}

        {/* Feedback List */}
        {hasVideo && (
          <FeedbackList
            feedback={feedback}
            isAnalyzing={isAnalyzing}
            pendingCount={pendingFeedbackCount}
          />
        )}
      </main>
    </div>
  )
}
