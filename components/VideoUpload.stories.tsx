import type { Meta, StoryObj } from '@storybook/react';
import { VideoUpload } from './VideoUpload';

const meta: Meta<typeof VideoUpload> = {
  title: 'Components/VideoUpload',
  component: VideoUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoUpload>;

export const Default: Story = {
  args: {
    onUploadSuccess: (url: string, filename: string) => {
      console.log('Upload successful:', { url, filename });
    },
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'max-w-md',
    onUploadSuccess: (url: string, filename: string) => {
      console.log('Upload successful:', { url, filename });
    },
  },
};

export const FullWidth: Story = {
  args: {
    className: 'w-full max-w-2xl',
    onUploadSuccess: (url: string, filename: string) => {
      console.log('Upload successful:', { url, filename });
    },
  },
  parameters: {
    layout: 'padded',
  },
};
