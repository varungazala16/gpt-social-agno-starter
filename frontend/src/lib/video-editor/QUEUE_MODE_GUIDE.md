# Queue Mode Implementation Guide

## Overview

Queue mode allows users to:
1. **Stack multiple operations** - Add operations to a queue instead of applying immediately
2. **Preview changes** - See CSS/canvas-based previews before processing
3. **Batch process** - Apply all operations at once for efficiency

## Architecture

```
New Files Created:
├── core/
│   ├── queue-types.ts         ✅ Operation queue types
│   └── queue-manager.ts       ✅ Queue management logic
├── operations/
│   └── batch.ts               ✅ Batch processing
├── hooks/
│   └── useQueueMode.ts        ✅ Queue state management
└── components/
    ├── VideoPreview.tsx       ✅ CSS-based preview
    └── QueuePanel.tsx         ✅ Queue UI component
```

## Implementation Steps

### Step 1: Update VideoEditorModal Import

```typescript
// Add new imports
import { VideoPreview } from './VideoPreview'
import { QueuePanel } from './QueuePanel'
import { useQueueMode } from '@/hooks/video-editor/useQueueMode'
import { processBatch } from '@/lib/video-editor/operations/batch'
import { QueueManager } from '@/lib/video-editor/core/queue-manager'
import { Layers } from 'lucide-react' // For queue mode toggle button
```

### Step 2: Add Queue Mode State

```typescript
export function VideoEditorModal({ src, isOpen, onClose, onSaveComplete, className }: VideoEditorModalProps) {
  // ... existing state ...

  // Add queue mode state
  const [queueMode, setQueueMode] = useState(false)
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; operation: string } | null>(null)

  // Initialize queue mode hook
  const {
    operations,
    operationCount,
    addOperation,
    removeOperation,
    clearQueue,
    previewState,
    previewEnabled,
    togglePreview
  } = useQueueMode()
```

### Step 3: Modify Operation Handlers for Queue Mode

```typescript
// Update each handler to support queue mode
const handleTrim = async () => {
  if (queueMode) {
    // Add to queue instead of processing
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
    addOperation('crop', label, { ...aspectRatio, mode })
  } else {
    await crop(aspectRatio, mode)
  }
}

// Similar pattern for all other operations...
```

### Step 4: Add Batch Processing Handler

```typescript
const handleApplyAll = async () => {
  if (operations.length === 0) return

  try {
    setIsProcessing(true)
    setBatchProgress({ current: 0, total: operations.length, operation: 'Starting...' })

    const result = await processBatch(
      ffmpeg.getFFmpeg(),
      src,
      operations,
      metadata,
      (current, total, operation) => {
        setBatchProgress({ current, total, operation })
      }
    )

    // Show result
    setResult(result)
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
    setIsProcessing(false)
    setBatchProgress(null)
  }
}
```

### Step 5: Update UI - Add Mode Toggle

```typescript
// Add after FFmpeg loading indicator
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
```

### Step 6: Replace Video Player with Preview Component

```typescript
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
```

### Step 7: Add Queue Panel

```typescript
{/* Queue Panel - shows only in queue mode */}
{queueMode && (
  <QueuePanel
    operations={operations}
    onRemove={removeOperation}
    onClear={clearQueue}
    onApplyAll={handleApplyAll}
    isProcessing={isProcessing}
  />
)}
```

### Step 8: Update Processing Progress for Batch Mode

```typescript
{/* Processing Progress */}
{isProcessing && (
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
```

### Step 9: Update Control Buttons Text

```typescript
// In control components, change button text based on mode
<button
  onClick={handleTrim}
  disabled={isProcessing || startTime >= endTime || !ffmpegLoaded}
  className={/* ... */}
>
  <Scissors className="w-4 h-4" />
  <span>{queueMode ? 'Add to Queue' : 'Trim Video'}</span>
</button>
```

### Step 10: Add Preview Toggle (Optional)

```typescript
{/* Preview Toggle - in queue mode */}
{queueMode && operations.length > 0 && (
  <div className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={previewEnabled}
      onChange={togglePreview}
      id="preview-toggle"
      className="rounded"
    />
    <label htmlFor="preview-toggle" className="cursor-pointer">
      Show live preview
    </label>
  </div>
)}
```

## Features

### 1. CSS Preview (Instant)

Operations that can be previewed with CSS:
- ✅ **Rotate** - CSS transform
- ✅ **Flip** - CSS scale(-1)
- ✅ **Brightness** - CSS filter
- ✅ **Contrast** - CSS filter
- ✅ **Saturation** - CSS filter
- ✅ **Blur** - CSS filter

Operations that CANNOT be previewed:
- ❌ **Trim** - Requires actual processing
- ❌ **Crop** - Requires actual processing
- ❌ **Speed** - Requires actual processing
- ❌ **Volume** - Audio only

### 2. Batch Processing Benefits

**Performance:**
- Operations processed sequentially
- Intermediate results piped between operations
- Only final result needs to be saved

**User Experience:**
- See all planned changes before processing
- Reorder operations if needed
- Remove unwanted operations
- Process once instead of multiple times

## Usage Example

```typescript
// User workflow:

1. Click "Queue Mode" toggle → ON
2. Add Trim: 0:05 → 0:30
3. Add Rotate: 90°
4. Add Filters: Brightness +20%
5. See preview update in real-time ✅
6. Click "Apply All Operations (3)"
7. Progress: "Trimming (1/3)" → "Rotating (2/3)" → "Applying filters (3/3)"
8. Result ready for download/save
```

## Testing Checklist

- [ ] Toggle queue mode on/off
- [ ] Add multiple operations to queue
- [ ] Preview updates correctly
- [ ] Remove individual operations
- [ ] Clear all operations
- [ ] Apply all operations in batch
- [ ] Progress shows for each operation
- [ ] Result is correct after batch processing
- [ ] Can toggle preview on/off
- [ ] Queue persists when switching tabs
- [ ] Queue clears after successful processing

## Migration from Current Implementation

**No breaking changes!** Queue mode is additive:
- Default behavior unchanged (instant apply)
- Queue mode is opt-in via toggle
- All existing code continues to work
- New features layered on top

## File Structure After Implementation

```
frontend/src/
├── lib/video-editor/
│   ├── core/
│   │   ├── types.ts                  (existing)
│   │   ├── ffmpeg-manager.ts         (existing)
│   │   ├── queue-types.ts            ✅ NEW
│   │   └── queue-manager.ts          ✅ NEW
│   ├── operations/
│   │   ├── trim.ts                   (existing)
│   │   ├── ...                       (existing)
│   │   └── batch.ts                  ✅ NEW
│   └── index.ts                      (update exports)
│
├── hooks/video-editor/
│   ├── useFFmpeg.ts                  (existing)
│   ├── useVideoEditor.ts             (existing)
│   └── useQueueMode.ts               ✅ NEW
│
└── components/video-editor/
    ├── VideoEditorModal.tsx          (update)
    ├── VideoPlayer.tsx               (existing)
    ├── VideoPreview.tsx              ✅ NEW
    ├── QueuePanel.tsx                ✅ NEW
    └── controls/                     (update button text)
```

## Next Steps

1. ✅ Core queue system created
2. ✅ Batch processing implemented
3. ✅ Preview system built
4. ⚠️ **TODO:** Update VideoEditorModal with the steps above
5. ⚠️ **TODO:** Update control component button text
6. ⚠️ **TODO:** Export new modules in index files
7. ⚠️ **TODO:** Test end-to-end workflow

## Performance Notes

**Preview (CSS):**
- Instant - no processing
- Smooth transitions
- Limited to visual changes only

**Batch Processing:**
- Sequential processing
- Progress tracking per operation
- Intermediate results piped
- Memory efficient
- Typical time: Sum of individual operation times + ~10% overhead

**Optimization Opportunities:**
- Future: Chain compatible operations in single FFmpeg pass
- Future: Parallel processing for independent operations
- Future: WebGL preview for more accurate representation

---

**Ready to implement!** All core infrastructure is built. Follow the steps above to integrate queue mode into VideoEditorModal.
