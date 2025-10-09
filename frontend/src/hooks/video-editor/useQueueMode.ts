/**
 * useQueueMode hook - Manages operation queue and batch processing
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { QueueManager } from '@/lib/video-editor/core/queue-manager'
import type { QueuedOperation, PreviewState } from '@/lib/video-editor/core/queue-types'

export function useQueueMode() {
  const [queueManager] = useState(() => new QueueManager())
  const [operations, setOperations] = useState<QueuedOperation[]>([])
  const [previewEnabled, setPreviewEnabled] = useState(true)

  // Subscribe to queue changes
  useEffect(() => {
    const unsubscribe = queueManager.subscribe(() => {
      setOperations(queueManager.getOperations())
    })
    return unsubscribe
  }, [queueManager])

  // Add operation to queue
  const addOperation = useCallback((
    type: QueuedOperation['type'],
    label: string,
    options: QueuedOperation['options']
  ) => {
    return queueManager.addOperation({ type, label, options })
  }, [queueManager])

  // Remove operation from queue
  const removeOperation = useCallback((id: string) => {
    queueManager.removeOperation(id)
  }, [queueManager])

  // Reorder operation
  const reorderOperation = useCallback((id: string, newIndex: number) => {
    queueManager.reorderOperation(id, newIndex)
  }, [queueManager])

  // Clear all operations
  const clearQueue = useCallback(() => {
    queueManager.clear()
  }, [queueManager])

  // Get preview state
  const previewState = useMemo<PreviewState | undefined>(() => {
    if (!previewEnabled) return undefined
    return queueManager.calculatePreviewState()
  }, [queueManager, operations, previewEnabled])

  // Toggle preview
  const togglePreview = useCallback(() => {
    setPreviewEnabled(prev => !prev)
  }, [])

  return {
    operations,
    operationCount: operations.length,
    addOperation,
    removeOperation,
    reorderOperation,
    clearQueue,
    previewState,
    previewEnabled,
    togglePreview
  }
}
