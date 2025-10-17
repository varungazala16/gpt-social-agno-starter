interface VideoPreviewProps {
  thumbnailUrl: string
  videoUrl?: string
}

export function VideoPreview({ thumbnailUrl, videoUrl }: VideoPreviewProps) {
  return (
    <div className="relative w-full max-w-sm mx-auto rounded-lg overflow-hidden bg-secondary" style={{ aspectRatio: '9/16' }}>
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  )
}
