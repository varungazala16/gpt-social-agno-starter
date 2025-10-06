# Video Studio - GPT Social

A modern, mobile-first Next.js application for playing, uploading, recording, and editing videos.

## Features

- 📹 **Video Player** - Custom video player with full playback controls
- ⬆️ **Upload Videos** - Upload videos up to 100MB (MP4, WebM, OGG)
- 🎥 **Record Videos** - Record videos directly from your camera/microphone
- ✂️ **Edit Videos** - Basic video editing capabilities with trim preview
- 📱 **Mobile-First Design** - Fully responsive, optimized for mobile devices
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS
- 🔐 **Authentication** - Secure user authentication with Supabase
- 🗄️ **Cloud Storage** - Per-user video storage with Supabase Storage
- 👤 **User Profiles** - Personal video libraries for each user
- 🛡️ **Admin Dashboard** - Role-based access control for administrators

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React
- **Video Libraries**: Remotion Player & CLI
- **UI Framework**: Preline UI patterns
- **Backend**: Supabase (Authentication & Storage)
- **Database**: Supabase PostgreSQL

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

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**Note**: You'll need to set up Supabase before the application will work. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
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
│   ├── admin/                 # Admin dashboard (role-protected)
│   ├── auth/                  # Auth callback handlers
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── globals.css            # Global styles and Tailwind config
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Main application page
├── components/
│   ├── VideoPlayer.tsx        # Custom video player with controls
│   ├── VideoUpload.tsx        # File upload component
│   ├── VideoRecorder.tsx      # Video recording component
│   ├── VideoEditor.tsx        # Video editing component
│   ├── VideoGallery.tsx       # Video gallery grid
│   └── UserProfile.tsx        # User profile and auth UI
├── actions/
│   └── video.ts               # Server actions for video operations
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase client for browser
│   │   ├── server.ts          # Supabase client for server
│   │   └── middleware.ts      # Auth middleware utilities
│   └── utils.ts               # Utility functions
├── middleware.ts              # Next.js middleware for auth
├── .env.example               # Environment variables template
├── SUPABASE_SETUP.md         # Detailed Supabase setup guide
└── package.json
```

## Server Actions

The application uses Next.js Server Actions for backend operations:

- `uploadVideo` - Handle video file uploads to Supabase Storage (per user)
- `saveRecording` - Save recorded videos to Supabase Storage (per user)
- `getVideos` - Retrieve user's videos from Supabase Storage
- `deleteVideo` - Remove videos from Supabase Storage (user's own files only)

## Authentication

The application uses Supabase Authentication with:

- Email/password authentication
- Protected routes (requires login)
- Role-based access control for admin features
- Automatic session management

## Environment Variables

Required environment variables (see `.env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ADMIN_EMAIL=your-admin-email@example.com
```

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

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

