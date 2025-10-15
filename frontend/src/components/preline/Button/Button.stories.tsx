import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup } from './index';
import { PlusCircle, Download, Settings, Trash2, Heart } from 'lucide-react';

const meta = {
  title: 'Preline/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'primary', 'destructive', 'outline', 'secondary', 'ghost', 'soft', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Solid (Default) - Primary blue CTA
 */
export const Solid: Story = {
  args: {
    children: 'Solid Button',
    variant: 'solid',
  },
};

/**
 * Primary - Uses theme primary color
 */
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

/**
 * Destructive - For dangerous actions
 */
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

/**
 * Outline - Secondary actions
 */
export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

/**
 * Secondary - Soft gray background
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

/**
 * Ghost - Minimal style
 */
export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

/**
 * Soft - Subtle with color
 */
export const Soft: Story = {
  args: {
    children: 'Soft',
    variant: 'soft',
  },
};

/**
 * Link - Text link style
 */
export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
};

/**
 * Small Size
 */
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

/**
 * Large Size
 */
export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

/**
 * With Icon
 */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <PlusCircle className="w-4 h-4" />
        Create Post
      </Button>
      <Button variant="outline">
        <Download className="w-4 h-4" />
        Download
      </Button>
      <Button variant="ghost">
        <Settings className="w-4 h-4" />
        Settings
      </Button>
    </div>
  ),
};

/**
 * Icon Only
 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button size="icon" title="Add">
        <PlusCircle className="w-5 h-5" />
      </Button>
      <Button size="icon" variant="outline" title="Download">
        <Download className="w-5 h-5" />
      </Button>
      <Button size="icon" variant="ghost" title="Settings">
        <Settings className="w-5 h-5" />
      </Button>
      <Button size="icon" variant="destructive" title="Delete">
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  ),
};

/**
 * Loading State
 */
export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button isLoading>Processing</Button>
      <Button variant="outline" isLoading>
        Loading
      </Button>
      <Button variant="ghost" isLoading>
        Please wait
      </Button>
    </div>
  ),
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
      <Button variant="destructive" disabled>
        Disabled
      </Button>
    </div>
  ),
};

/**
 * All Variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="solid">Solid</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
};

/**
 * All Sizes
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Heart className="w-5 h-5" />
      </Button>
    </div>
  ),
};

/**
 * Button Group - Horizontal
 */
export const GroupHorizontal: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

/**
 * Button Group - Vertical
 */
export const GroupVertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
};

/**
 * Real-world Example - Post Actions
 */
export const PostActions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg max-w-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Post Actions</h3>
      <div className="flex gap-2">
        <Button className="flex-1">
          <PlusCircle className="w-4 h-4" />
          New Post
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
      <ButtonGroup>
        <Button variant="outline" className="flex-1">
          Draft
        </Button>
        <Button variant="outline" className="flex-1">
          Schedule
        </Button>
        <Button variant="solid" className="flex-1">
          Publish
        </Button>
      </ButtonGroup>
      <Button variant="destructive" size="sm">
        <Trash2 className="w-4 h-4" />
        Delete All Drafts
      </Button>
    </div>
  ),
};
