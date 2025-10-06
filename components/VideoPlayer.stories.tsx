import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from './VideoPlayer';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

// Sample video URL (using a publicly available sample video)
const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const Default: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-[640px]',
  },
};

export const Small: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-[400px]',
  },
};

export const Large: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-[800px]',
  },
};

export const FullWidth: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-full max-w-4xl',
  },
  parameters: {
    layout: 'padded',
  },
};
