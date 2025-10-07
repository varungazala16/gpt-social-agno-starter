import type { Meta, StoryObj } from '@storybook/react'
import { AlertDialog } from './AlertDialog'
import { useState } from 'react'

const meta: Meta<typeof AlertDialog> = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AlertDialog>

const AlertDialogWithState = (args: React.ComponentProps<typeof AlertDialog>) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Show Alert
      </button>
      <AlertDialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

export const SuccessMessage: Story = {
  render: (args) => <AlertDialogWithState {...args} />,
  args: {
    title: 'Upload Successful',
    message: 'Your video has been uploaded successfully and is now available in your gallery.',
    variant: 'success',
  },
}

export const ErrorMessage: Story = {
  render: (args) => <AlertDialogWithState {...args} />,
  args: {
    title: 'Upload Failed',
    message: 'Failed to upload your video. Please check your internet connection and try again.',
    variant: 'error',
  },
}

export const InfoMessage: Story = {
  render: (args) => <AlertDialogWithState {...args} />,
  args: {
    title: 'Processing Video',
    message: 'Your video is being processed. This may take a few minutes depending on the file size.',
    variant: 'info',
  },
}

export const LongMessage: Story = {
  render: (args) => <AlertDialogWithState {...args} />,
  args: {
    title: 'Important Update',
    message: 'We have updated our terms of service and privacy policy. Please review the changes at your earliest convenience. These updates include new features, improved security measures, and better privacy controls for your content.',
    variant: 'info',
  },
}

export const ShortMessage: Story = {
  render: (args) => <AlertDialogWithState {...args} />,
  args: {
    title: 'Done',
    message: 'Video saved.',
    variant: 'success',
  },
}

export const NoTitle: Story = {
  render: (args) => <AlertDialogWithState {...args} />,
  args: {
    message: 'This is an alert without a custom title.',
    variant: 'info',
  },
}

export const NetworkError: Story = {
  render: (args) => <AlertDialogWithState {...args} />,
  args: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again later.',
    variant: 'error',
  },
}

export const RecordingSaved: Story = {
  render: (args) => <AlertDialogWithState {...args} />,
  args: {
    title: 'Recording Saved',
    message: 'Your video recording has been saved to your gallery and is ready to share.',
    variant: 'success',
  },
}
