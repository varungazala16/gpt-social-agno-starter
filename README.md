# Video Studio - GPT Social

A modern, mobile-first Next.js application for playing, uploading, recording, and editing videos.

## Features

- 📹 **Video Player** - Custom video player with full playback controls
- ⬆️ **Upload Videos** - Upload videos up to 100MB (MP4, WebM, OGG)
- 🎥 **Record Videos** - Record videos directly from your camera/microphone
- ✂️ **Edit Videos** - Basic video editing capabilities with trim preview
- 📱 **Mobile-First Design** - Fully responsive, optimized for mobile devices
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React
- **Video Libraries**: Remotion Player & CLI
- **UI Framework**: Preline UI patterns
- **Testing**: Vitest with React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/scrollmark/gpt.social.git
cd gpt.social

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Testing

The project uses Vitest for unit and component testing with React Testing Library.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Tests are located in the `__tests__` directory:

```
__tests__/
├── actions/          # Server actions tests
├── components/       # Component tests
└── lib/              # Utility function tests
```

### Writing Tests

Example component test:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Features Overview

### Video Gallery
- View all uploaded and recorded videos
- Grid layout that adapts to screen size
- Delete videos with confirmation
- Automatic refresh on new uploads/recordings

### Video Upload
- Drag-and-drop file upload
- File type validation (video formats only)
- File size limit (100MB max)
- Progress feedback during upload
- Server-side file storage

### Video Recording
- Direct camera/microphone access
- Real-time preview while recording
- WebM format output
- Visual recording indicator
- Automatic save to gallery

### Video Editor
- Load videos from URL or gallery
- Trim video with start/end time controls
- Real-time preview
- Download capability
- Note: Advanced editing requires server-side processing with FFmpeg

## Project Structure

```
gpt.social/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main application page
├── components/
│   ├── VideoPlayer.tsx       # Custom video player with controls
│   ├── VideoUpload.tsx       # File upload component
│   ├── VideoRecorder.tsx     # Video recording component
│   ├── VideoEditor.tsx       # Video editing component
│   └── VideoGallery.tsx      # Video gallery grid
├── actions/
│   └── video.ts              # Server actions for video operations
├── lib/
│   └── utils.ts              # Utility functions
├── __tests__/                # Test files
│   ├── actions/              # Server actions tests
│   ├── components/           # Component tests
│   └── lib/                  # Utility tests
├── public/
│   └── uploads/              # Uploaded video storage
├── vitest.config.ts          # Vitest configuration
└── package.json
```

## Server Actions

The application uses Next.js Server Actions for backend operations:

- `uploadVideo` - Handle video file uploads
- `saveRecording` - Save recorded videos from base64
- `getVideos` - Retrieve all videos from storage
- `deleteVideo` - Remove videos from storage

## Environment Variables

No environment variables are required for basic functionality. All videos are stored locally in `public/uploads/`.

## Mobile Support

The application is built with a mobile-first approach:

- Responsive navigation tabs
- Touch-friendly controls
- Optimized layouts for small screens
- Adaptive video player controls

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- Built with Next.js 15.5
- Styled with Tailwind CSS
- UI patterns from Preline
- Icons from Lucide React

