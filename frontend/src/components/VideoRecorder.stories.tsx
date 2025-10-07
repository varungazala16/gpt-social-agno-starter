import type { Meta, StoryObj } from '@storybook/react'
import { VideoRecorder } from './VideoRecorder'

const meta: Meta<typeof VideoRecorder> = {
  title: 'Components/VideoRecorder',
  component: VideoRecorder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onRecordingComplete: (url: string, filename: string) => console.log('Recording complete:', { url, filename }),
  },
}

export default meta
type Story = StoryObj<typeof VideoRecorder>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Video recorder with camera preview and recording controls. Requires camera and microphone permissions. Records in WebM format with VP8 video and Opus audio codecs.',
      },
    },
  },
}

export const Compact: Story = {
  args: {
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version suitable for smaller layouts or sidebars.',
      },
    },
  },
}

export const Standard: Story = {
  args: {
    className: 'max-w-2xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard size video recorder for typical use cases.',
      },
    },
  },
}

export const FullWidth: Story = {
  args: {
    className: 'w-full max-w-4xl',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Full-width video recorder with maximum width constraint.',
      },
    },
  },
}

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Video recorder styled for dark mode with improved visibility.',
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
