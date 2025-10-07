import type { Meta, StoryObj } from '@storybook/react'
import { VideoUpload } from './VideoUpload'

const meta: Meta<typeof VideoUpload> = {
  title: 'Components/VideoUpload',
  component: VideoUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onUploadSuccess: (url: string, filename: string) => console.log('Upload success:', { url, filename }),
  },
}

export default meta
type Story = StoryObj<typeof VideoUpload>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default video upload component with drag-and-drop support. Accepts MP4, WebM, or OGG files up to 100MB.',
      },
    },
  },
}

export const WithCustomClassName: Story = {
  args: {
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Upload component with custom max-width styling.',
      },
    },
  },
}

export const FullWidth: Story = {
  args: {
    className: 'w-full max-w-2xl',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Full-width upload component with a maximum width constraint.',
      },
    },
  },
}

export const Compact: Story = {
  args: {
    className: 'max-w-sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version suitable for sidebars or smaller spaces.',
      },
    },
  },
}

export const InDarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Upload component styled for dark mode.',
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
