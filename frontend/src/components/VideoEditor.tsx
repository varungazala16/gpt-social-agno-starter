/**
 * VideoEditor - Main export
 *
 * This file now exports the new modular VideoEditorModal component
 * while maintaining backwards compatibility with the original interface.
 *
 * The new architecture features:
 * - Decoupled UI from business logic
 * - Multiple editing features (trim, crop, rotate, speed, volume, filters)
 * - Modular, reusable components
 * - Easy to extend with new features
 *
 * For more control, you can import individual components:
 * - VideoEditorModal: Main editor component
 * - VideoPlayer: Video preview component
 * - TrimControls, CropControls, etc.: Individual feature controls
 */

import { VideoEditorModal } from './video-editor/VideoEditorModal'

// Export with original name for backwards compatibility
export { VideoEditorModal as VideoEditor }

// Also export as default for convenience
export default VideoEditorModal
