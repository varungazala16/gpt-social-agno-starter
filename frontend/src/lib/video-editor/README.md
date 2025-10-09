# Video Editor Library

A modular, browser-based video editing library using FFmpeg WebAssembly.

## Architecture

The video editor is built with a three-layer architecture for maximum flexibility and maintainability:

### 1. Core Layer (`core/`)

Pure business logic with no UI dependencies.

- **`types.ts`** - TypeScript interfaces and types for all operations
- **`ffmpeg-manager.ts`** - Singleton FFmpeg instance manager with lifecycle management

### 2. Operations Layer (`operations/`)

Pure functions for video processing. Each operation is self-contained and composable.

- **`trim.ts`** - Cut video to specific time range
- **`crop.ts`** - Crop video or change aspect ratio
- **`rotate.ts`** - Rotate video by 90°, 180°, or 270°
- **`flip.ts`** - Flip video horizontally or vertically
- **`speed.ts`** - Adjust playback speed (0.25x - 4x)
- **`volume.ts`** - Adjust audio volume (0% - 200%)
- **`filters.ts`** - Apply visual filters (brightness, contrast, saturation, blur)

### 3. UI Layer (`../../components/video-editor/`)

React components that connect to operations via hooks.

- **`controls/`** - Feature-specific UI controls for each operation
- **`VideoPlayer.tsx`** - Video preview component
- **`VideoEditorModal.tsx`** - Main editor with tabbed interface

### 4. Hooks Layer (`../../hooks/video-editor/`)

React hooks that connect UI to core operations.

- **`useFFmpeg.ts`** - FFmpeg lifecycle management
- **`useVideoEditor.ts`** - Main editor state and operations

## Usage

### Basic Usage

```tsx
import { VideoEditor } from '@/components/VideoEditor'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <VideoEditor
      src="/path/to/video.mp4"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSaveComplete={() => console.log('Video saved!')}
    />
  )
}
```

### Using Operations Directly

```tsx
import { trimVideo, rotateVideo, getFFmpegManager } from '@/lib/video-editor'

async function processVideo() {
  // Initialize FFmpeg
  const ffmpegManager = getFFmpegManager()
  await ffmpegManager.load()

  // Perform operations
  const trimResult = await trimVideo(
    ffmpegManager.getFFmpeg(),
    '/path/to/video.mp4',
    { startTime: 5, endTime: 15 }
  )

  const rotateResult = await rotateVideo(
    ffmpegManager.getFFmpeg(),
    '/path/to/video.mp4',
    { degrees: 90 }
  )

  // Results contain blob and format
  console.log(trimResult.blob, trimResult.format)
}
```

### Using the Hook

```tsx
import { useVideoEditor } from '@/hooks/video-editor'

function CustomVideoEditor({ videoSrc }: { videoSrc: string }) {
  const {
    videoRef,
    metadata,
    onVideoMetadataLoaded,
    ffmpegLoaded,
    isProcessing,
    trim,
    rotate,
    filters
  } = useVideoEditor({
    videoSrc,
    onProcessingComplete: (result) => {
      console.log('Processing complete:', result)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })

  return (
    <div>
      <video
        ref={videoRef}
        src={videoSrc}
        onLoadedMetadata={onVideoMetadataLoaded}
      />

      <button
        onClick={() => trim({ startTime: 0, endTime: 10 })}
        disabled={!ffmpegLoaded || isProcessing}
      >
        Trim to 10 seconds
      </button>

      <button
        onClick={() => rotate({ degrees: 90 })}
        disabled={!ffmpegLoaded || isProcessing}
      >
        Rotate 90°
      </button>
    </div>
  )
}
```

### Custom UI Components

```tsx
import { TrimControls, SpeedControls } from '@/components/video-editor/controls'

function CustomEditor() {
  // Your custom logic here

  return (
    <div>
      {/* Use individual control components */}
      <TrimControls
        startTime={0}
        endTime={10}
        duration={30}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onTrim={handleTrim}
      />

      <SpeedControls
        onApplySpeed={handleSpeed}
      />
    </div>
  )
}
```

## Features

### Available Operations

| Feature | Description | Range/Options |
|---------|-------------|---------------|
| **Trim** | Cut video to specific time range | Start time → End time |
| **Crop** | Change aspect ratio with letterbox or crop | 16:9, 9:16, 4:3, 1:1, 21:9, 4:5 |
| **Rotate** | Rotate video | 90°, 180°, 270° |
| **Flip** | Mirror video | Horizontal, Vertical, or both |
| **Speed** | Adjust playback speed | 0.25x - 4x |
| **Volume** | Adjust audio volume | 0% - 200% |
| **Filters** | Visual adjustments | Brightness, Contrast, Saturation, Blur |

### Key Benefits

- ✅ **Decoupled Architecture** - UI completely separate from business logic
- ✅ **Type-Safe** - Full TypeScript support throughout
- ✅ **Testable** - Pure functions easy to unit test
- ✅ **Reusable** - Use operations anywhere in your app
- ✅ **Extensible** - Add new features without modifying existing code
- ✅ **Browser-Based** - All processing happens client-side
- ✅ **Privacy-First** - Video data never leaves the user's device

## Adding New Features

To add a new video operation:

1. **Define types** in `core/types.ts`:
   ```typescript
   export interface MyNewOptions {
     param1: string
     param2: number
   }
   ```

2. **Create operation function** in `operations/my-new-feature.ts`:
   ```typescript
   export async function myNewOperation(
     ffmpeg: FFmpeg,
     videoSrc: string,
     options: MyNewOptions
   ): Promise<ProcessingResult> {
     // Implementation using FFmpeg
   }
   ```

3. **Add to operations index** in `operations/index.ts`:
   ```typescript
   export { myNewOperation } from './my-new-feature'
   ```

4. **Add to hook** in `useVideoEditor.ts`:
   ```typescript
   const myNewFeature = useCallback(
     async (options: MyNewOptions) => {
       return executeOperation('my-new-feature', () =>
         myNewOperation(ffmpeg.getFFmpeg(), videoSrc, options)
       )
     },
     [executeOperation, ffmpeg, videoSrc]
   )
   ```

5. **Create UI control** in `components/video-editor/controls/MyNewControls.tsx`:
   ```typescript
   export function MyNewControls({ onApply, disabled }: Props) {
     // Your UI here
   }
   ```

6. **Add tab** to `VideoEditorModal.tsx`

That's it! Your new feature is fully integrated.

## Performance

All video processing happens in the browser using FFmpeg WebAssembly:

- **First load**: ~5-10 seconds to download and initialize FFmpeg core
- **Subsequent operations**: Depends on video size and operation complexity
- **Memory usage**: Efficient - processes videos in chunks when possible
- **Output quality**: High quality with configurable encoding (CRF 23 by default)

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 89+
- ✅ Safari 15.4+
- ⚠️ Mobile browsers may have limitations with large videos

## Technical Details

### FFmpeg Commands Used

Each operation uses optimized FFmpeg commands:

- **Trim**: `-ss` (start), `-t` (duration), with H.264/AAC encoding
- **Crop**: `-filter:v crop=w:h:x:y`
- **Rotate**: `-filter:v transpose=N`
- **Flip**: `-filter:v hflip/vflip`
- **Speed**: `-filter:v setpts`, `-filter:a atempo` (chained for >2x)
- **Volume**: `-filter:a volume=N`
- **Filters**: `-filter:v eq` (brightness/contrast/saturation), `boxblur` (blur)

### Output Format

All operations output MP4 files with:
- **Video codec**: H.264 (libx264)
- **Audio codec**: AAC
- **Quality**: CRF 23 (good balance of quality/size)
- **Preset**: fast (good encoding speed)

## License

Part of the gpt.social project.
