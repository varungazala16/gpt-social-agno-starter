import type { Meta, StoryObj } from '@storybook/react';
import { VideoRecorder } from './VideoRecorder';

const meta: Meta<typeof VideoRecorder> = {
  title: 'Components/VideoRecorder',
  component: VideoRecorder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoRecorder>;

export const Default: Story = {
  args: {
    onRecordingComplete: (url: string, filename: string) => {
      console.log('Recording complete:', { url, filename });
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'This component requires camera and microphone permissions. Click "Allow" when prompted by your browser.',
      },
    },
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'max-w-2xl',
    onRecordingComplete: (url: string, filename: string) => {
      console.log('Recording complete:', { url, filename });
    },
  },
};

export const FullWidth: Story = {
  args: {
    className: 'w-full max-w-4xl',
    onRecordingComplete: (url: string, filename: string) => {
      console.log('Recording complete:', { url, filename });
    },
  },
  parameters: {
    layout: 'padded',
  },
};
