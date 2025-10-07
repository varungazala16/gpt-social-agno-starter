import type { Meta, StoryObj } from '@storybook/react'
import { VideoPlayer } from './VideoPlayer'

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof VideoPlayer>

// Sample video URL (using a publicly available sample video)
const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export const Default: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-[640px]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default video player with custom controls including play/pause, volume, seek, restart, and fullscreen.',
      },
    },
  },
}

export const Small: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-[400px]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Smaller video player suitable for thumbnails or preview mode.',
      },
    },
  },
}

export const Large: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-[800px]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Larger video player for prominent video display.',
      },
    },
  },
}

export const FullWidth: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-full max-w-4xl',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Full-width responsive video player with maximum width constraint.',
      },
    },
  },
}

export const MobileView: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-[375px]',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Video player optimized for mobile viewport with responsive controls.',
      },
    },
  },
}

export const Portrait: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-[400px] aspect-[9/16]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Video player with portrait aspect ratio for vertical videos.',
      },
    },
  },
}
