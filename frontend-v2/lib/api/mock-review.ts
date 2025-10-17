import { VideoReview, VideoAnalysis, FeedbackItem } from '@/types'

const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    type: 'positive',
    timestamp: '0:12',
    title: 'Excellent use of contrast in visual elements for emphasis',
    description: 'The color contrast makes key information stand out effectively',
    explanation: 'Using high contrast between text and background improves readability and draws viewer attention to important content. This technique is particularly effective in short-form video content where you have limited time to communicate your message.',
  },
  {
    id: '2',
    type: 'negative',
    timestamp: '0:35',
    title: 'Background noise distracts',
    description: 'Ambient sound reduces audio clarity',
    explanation: 'Background noise can significantly impact viewer retention. Studies show that viewers are 40% more likely to watch until completion when audio is clear. Consider recording in a quieter environment or using noise reduction in post-production.',
  },
  {
    id: '3',
    type: 'negative',
    timestamp: '1:24',
    title: 'Abrupt ending feels incomplete',
    description: 'The video ends without a clear call-to-action or conclusion',
    explanation: 'A strong ending is crucial for engagement. Include a clear call-to-action, ask viewers to engage (like, comment, follow), or tease your next video. This can increase engagement rates by up to 30%.',
  },
]

export async function uploadVideo(file: File): Promise<VideoReview> {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Create mock video URL and thumbnail
  const videoUrl = URL.createObjectURL(file)
  const thumbnailUrl = videoUrl // In real app, would generate thumbnail

  return {
    id: String(Date.now()),
    videoUrl,
    thumbnailUrl,
    uploadedAt: new Date(),
  }
}

export interface AnalysisUpdate {
  hookScore?: number
  endingScore?: number
  hookReason?: string
  endingReason?: string
  newFeedback?: FeedbackItem
  complete?: boolean
  issuesCount?: number
}

export async function* analyzeVideo(videoId: string): AsyncGenerator<AnalysisUpdate> {
  // Simulate analysis with progressive updates

  // First update: Hook score (after 1.5s)
  await new Promise(resolve => setTimeout(resolve, 1500))
  yield {
    hookScore: 87,
    hookReason: 'Strong opening that captures attention immediately with a clear problem statement',
  }

  // Second update: Ending score (after 1s more)
  await new Promise(resolve => setTimeout(resolve, 1000))
  yield {
    endingScore: 71,
    endingReason: 'Ending could be stronger with a clearer call-to-action and summary',
    issuesCount: 2,
  }

  // Third update: First feedback item (after 1.2s more)
  await new Promise(resolve => setTimeout(resolve, 1200))
  yield {
    newFeedback: mockFeedback[0],
  }

  // Fourth update: Second feedback item (after 1.5s more)
  await new Promise(resolve => setTimeout(resolve, 1500))
  yield {
    newFeedback: mockFeedback[1],
  }

  // Fifth update: Third feedback item (after 1.5s more)
  await new Promise(resolve => setTimeout(resolve, 1500))
  yield {
    newFeedback: mockFeedback[2],
  }

  // Final update: Analysis complete (after 0.5s more)
  await new Promise(resolve => setTimeout(resolve, 500))
  yield {
    complete: true,
  }
}

// Alternative approach using callback pattern (easier to use in React)
export function analyzeVideoWithCallback(
  videoId: string,
  onUpdate: (update: AnalysisUpdate) => void
): () => void {
  let cancelled = false

  const runAnalysis = async () => {
    // Hook score
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (cancelled) return
    onUpdate({
      hookScore: 87,
      hookReason: 'Strong opening that captures attention immediately with a clear problem statement',
    })

    // Ending score
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (cancelled) return
    onUpdate({
      endingScore: 71,
      endingReason: 'Ending could be stronger with a clearer call-to-action and summary',
      issuesCount: 2,
    })

    // Feedback items
    for (const feedback of mockFeedback) {
      await new Promise(resolve => setTimeout(resolve, 1200))
      if (cancelled) return
      onUpdate({ newFeedback: feedback })
    }

    // Complete
    await new Promise(resolve => setTimeout(resolve, 500))
    if (cancelled) return
    onUpdate({ complete: true })
  }

  runAnalysis()

  // Return cleanup function
  return () => {
    cancelled = true
  }
}
