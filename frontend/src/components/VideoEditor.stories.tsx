import type { Meta, StoryObj } from '@storybook/react'
import { VideoEditor } from './VideoEditor'
import { useState } from 'react'

const meta: Meta<typeof VideoEditor> = {
  title: 'Components/VideoEditor',
  component: VideoEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onSaveComplete: () => console.log('Save complete'),
  },
}

export default meta
type Story = StoryObj<typeof VideoEditor>

// Sample video URL
const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const shortVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'

// Wrapper component to manage state
const VideoEditorWithState = (args: React.ComponentProps<typeof VideoEditor>) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 fixed top-4 left-4 z-50"
      >
        Open Video Editor
      </button>
      <VideoEditor
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

export const Default: Story = {
  render: (args) => <VideoEditorWithState {...args} />,
  args: {
    src: sampleVideoUrl,
  },
  parameters: {
    docs: {
      description: {
        story: 'Full-featured video editor with trimming capabilities. Uses FFmpeg (WebAssembly) or MediaRecorder API for processing. Includes preview, timeline controls, and save functionality.',
      },
    },
  },
}

export const ShortVideo: Story = {
  render: (args) => <VideoEditorWithState {...args} />,
  args: {
    src: shortVideoUrl,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video editor with a shorter video file for testing trim functionality.',
      },
    },
  },
}

export const WithCustomClassName: Story = {
  render: (args) => <VideoEditorWithState {...args} />,
  args: {
    src: sampleVideoUrl,
    className: 'custom-editor',
  },
  parameters: {
    docs: {
      description: {
        story: 'Video editor with custom CSS class for styling customization.',
      },
    },
  },
}

export const DarkMode: Story = {
  render: (args) => <VideoEditorWithState {...args} />,
  args: {
    src: sampleVideoUrl,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Video editor with dark mode styling for better visibility in dark environments.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}
