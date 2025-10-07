import type { Meta, StoryObj } from '@storybook/react';
import { VideoGallery } from './VideoGallery';

const meta: Meta<typeof VideoGallery> = {
  title: 'Components/VideoGallery',
  component: VideoGallery,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoGallery>;

export const Default: Story = {
  args: {
    onEditVideo: (url: string) => {
      console.log('Edit video:', url);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a gallery of uploaded videos. The gallery will show videos from the public/uploads directory.',
      },
    },
  },
};

export const WithRefreshTrigger: Story = {
  args: {
    refreshTrigger: 1,
    onEditVideo: (url: string) => {
      console.log('Edit video:', url);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'The refreshTrigger prop can be incremented to force a reload of the video list.',
      },
    },
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'max-w-6xl mx-auto',
    onEditVideo: (url: string) => {
      console.log('Edit video:', url);
    },
  },
};
