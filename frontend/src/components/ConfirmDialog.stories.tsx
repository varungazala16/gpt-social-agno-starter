import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmDialog } from './ConfirmDialog'
import { useState } from 'react'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onConfirm: () => console.log('onConfirm called'),
  },
}

export default meta
type Story = StoryObj<typeof ConfirmDialog>

const ConfirmDialogWithState = (args: React.ComponentProps<typeof ConfirmDialog>) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Open Dialog
      </button>
      <ConfirmDialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          args.onConfirm()
          setIsOpen(false)
        }}
      />
    </>
  )
}

export const DangerVariant: Story = {
  render: (args) => <ConfirmDialogWithState {...args} />,
  args: {
    title: 'Delete Video',
    message: 'Are you sure you want to delete this video? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  },
}

export const WarningVariant: Story = {
  render: (args) => <ConfirmDialogWithState {...args} />,
  args: {
    title: 'Confirm Action',
    message: 'This will discard all your unsaved changes. Do you want to continue?',
    confirmText: 'Continue',
    cancelText: 'Go Back',
    variant: 'warning',
  },
}

export const InfoVariant: Story = {
  render: (args) => <ConfirmDialogWithState {...args} />,
  args: {
    title: 'Save Changes',
    message: 'Your video has been edited. Would you like to save these changes?',
    confirmText: 'Save',
    cancelText: 'Don\'t Save',
    variant: 'info',
  },
}

export const LongMessage: Story = {
  render: (args) => <ConfirmDialogWithState {...args} />,
  args: {
    title: 'Terms and Conditions',
    message: 'By continuing, you agree to our terms of service and privacy policy. Your video will be uploaded to our secure servers and may be processed for optimization. You retain all rights to your content, but grant us a license to display and distribute it on our platform.',
    confirmText: 'I Agree',
    cancelText: 'Decline',
    variant: 'info',
  },
}

export const CustomButtonText: Story = {
  render: (args) => <ConfirmDialogWithState {...args} />,
  args: {
    title: 'Exit Editor',
    message: 'You have unsaved changes in your video editor.',
    confirmText: 'Exit Anyway',
    cancelText: 'Keep Editing',
    variant: 'warning',
  },
}

export const MinimalText: Story = {
  render: (args) => <ConfirmDialogWithState {...args} />,
  args: {
    title: 'Confirm',
    message: 'Continue?',
    confirmText: 'Yes',
    cancelText: 'No',
    variant: 'info',
  },
}
