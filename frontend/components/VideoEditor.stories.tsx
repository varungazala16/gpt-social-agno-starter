import type { Meta, StoryObj } from '@storybook/react';
import { VideoEditor } from './VideoEditor';
import { useState } from 'react';

const meta: Meta<typeof VideoEditor> = {
  title: 'Components/VideoEditor',
  component: VideoEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoEditor>;

// Sample video URL
const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// Wrapper component to manage state
const VideoEditorWithState = (args: React.ComponentProps<typeof VideoEditor>) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Open Video Editor
      </button>
      <VideoEditor 
        {...args} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <VideoEditorWithState {...args} />,
  args: {
    src: sampleVideoUrl,
    onSaveComplete: () => {
      console.log('Video save complete');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Video editor allows trimming videos using FFmpeg (WebAssembly) or MediaRecorder API. FFmpeg provides more accurate results.',
      },
    },
  },
};

export const WithCustomClassName: Story = {
  render: (args) => <VideoEditorWithState {...args} />,
  args: {
    src: sampleVideoUrl,
    className: 'custom-editor',
    onSaveComplete: () => {
      console.log('Video save complete');
    },
  },
};
