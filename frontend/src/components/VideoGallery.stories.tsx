import type { Meta, StoryObj } from '@storybook/react'
import { VideoGallery } from './VideoGallery'

const meta: Meta<typeof VideoGallery> = {
  title: 'Components/VideoGallery',
  component: VideoGallery,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onEditVideo: (url: string) => console.log('Edit video:', url),
  },
}

export default meta
type Story = StoryObj<typeof VideoGallery>

// Mock VideoGallery with sample data
const MockVideoGallery = (args: React.ComponentProps<typeof VideoGallery>) => {
  const sampleVideos = [
    {
      filename: 'sample-video-1.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      uploadedAt: Date.now().toString(),
    },
    {
      filename: 'sample-video-2.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      uploadedAt: (Date.now() - 86400000).toString(),
    },
    {
      filename: 'sample-video-3.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      uploadedAt: (Date.now() - 172800000).toString(),
    },
  ]

  // Override the component to show sample data instead of fetching
  return (
    <div className={args.className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sampleVideos.map((video) => (
          <div key={video.filename} className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-800">
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
              <video
                src={video.url}
                className="w-full h-full object-contain"
                controls
              />
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {video.filename}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(parseInt(video.uploadedAt)).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => console.log('Download:', video.filename)}
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={() => args.onEditVideo?.(video.url)}
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                  onClick={() => console.log('Delete:', video.filename)}
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <MockVideoGallery {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Video gallery displays uploaded videos in a responsive grid. Each video shows a thumbnail, upload date, and actions for editing and deleting. This story uses sample video URLs for demonstration.',
      },
    },
  },
}

export const WithEditCallback: Story = {
  args: {
    onEditVideo: (url: string) => alert(`Editing video: ${url}`),
  },
  render: (args) => <MockVideoGallery {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Gallery with custom edit callback. Videos are automatically refreshed after mutations via React Query.',
      },
    },
  },
}

export const WithCustomClassName: Story = {
  args: {
    className: 'max-w-6xl mx-auto',
  },
  render: (args) => <MockVideoGallery {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Gallery with custom styling and maximum width constraint.',
      },
    },
  },
}

export const Compact: Story = {
  args: {
    className: 'max-w-4xl',
  },
  render: (args) => <MockVideoGallery {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Compact gallery layout suitable for smaller viewports.',
      },
    },
  },
}

export const FullWidth: Story = {
  args: {
    className: 'w-full',
  },
  render: (args) => <MockVideoGallery {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Full-width gallery that adapts to container size.',
      },
    },
  },
}

export const DarkMode: Story = {
  render: (args) => <MockVideoGallery {...args} />,
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Video gallery styled for dark mode with improved contrast.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark p-8">
        <Story />
      </div>
    ),
  ],
}
