import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Wrapper component to manage state
const ModalWithState = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Open Modal
      </button>
      <Modal 
        {...args} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Modal Title',
    children: (
      <div>
        <p className="text-gray-700 dark:text-gray-300">
          This is the modal content. It can contain any React components.
        </p>
      </div>
    ),
  },
};

export const WithoutTitle: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    children: (
      <div>
        <p className="text-gray-700 dark:text-gray-300">
          This modal has no title, just content.
        </p>
      </div>
    ),
  },
};

export const LongContent: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Long Content Modal',
    children: (
      <div className="space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="text-gray-700 dark:text-gray-300">
            This is paragraph {i + 1} to demonstrate scrollable content in the modal.
          </p>
        ))}
      </div>
    ),
  },
};

export const CustomClassName: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Custom Styled Modal',
    className: 'max-w-md',
    children: (
      <div>
        <p className="text-gray-700 dark:text-gray-300">
          This modal has a custom max-width applied via className.
        </p>
      </div>
    ),
  },
};
