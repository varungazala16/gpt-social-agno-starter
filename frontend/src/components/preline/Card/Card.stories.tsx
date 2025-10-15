import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter, CardPost } from './index';

const meta = {
  title: 'Preline/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Card
 */
export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Card Title
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Card subtitle
        </p>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This is some text within a card body. Cards are flexible containers with
          support for headers, bodies, and footers.
        </p>
      </CardBody>
      <CardFooter>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Action
        </button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with Image
 */
export const WithImage: Story = {
  render: () => (
    <Card className="max-w-sm" hover>
      <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600" />
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Beautiful Card
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          With an image header
        </p>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Cards can include images at the top for visual appeal.
        </p>
      </CardBody>
    </Card>
  ),
};

/**
 * Outlined Variant
 */
export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="max-w-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Outlined Card
        </h3>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This card uses the outlined variant.
        </p>
      </CardBody>
    </Card>
  ),
};

/**
 * Elevated Variant
 */
export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="max-w-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Elevated Card
        </h3>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This card has an elevated shadow effect.
        </p>
      </CardBody>
    </Card>
  ),
};

/**
 * Card Grid
 */
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} hover>
          <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-600" />
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Card {i}
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Grid layout demonstration
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

/**
 * Post Card - Draft Status
 */
export const PostDraft: Story = {
  render: () => (
    <div className="max-w-sm">
      <CardPost
        id="1"
        caption="My awesome video post about web development"
        status="draft"
        videoCount={2}
        createdAt={new Date().toISOString()}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
        onClick={() => console.log('Card clicked')}
        thumbnail={
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">📹</span>
          </div>
        }
      />
    </div>
  ),
};

/**
 * Post Card - Posted Status
 */
export const PostPosted: Story = {
  render: () => (
    <div className="max-w-sm">
      <CardPost
        id="2"
        caption="Check out my latest tutorial on React hooks!"
        status="posted"
        videoCount={1}
        createdAt="2025-01-10"
        publishedAt="2025-01-12"
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
        onClick={() => console.log('Card clicked')}
        thumbnail={
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">✅</span>
          </div>
        }
      />
    </div>
  ),
};

/**
 * Post Card - Scheduled Status
 */
export const PostScheduled: Story = {
  render: () => (
    <div className="max-w-sm">
      <CardPost
        id="3"
        caption="Upcoming video about Next.js 15 features"
        status="scheduled"
        videoCount={3}
        createdAt="2025-01-14"
        publishedAt="2025-01-20"
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
        onClick={() => console.log('Card clicked')}
        thumbnail={
          <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">⏰</span>
          </div>
        }
      />
    </div>
  ),
};

/**
 * Post Card - No Caption
 */
export const PostNoCaption: Story = {
  render: () => (
    <div className="max-w-sm">
      <CardPost
        id="4"
        status="draft"
        videoCount={0}
        createdAt={new Date().toISOString()}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  ),
};

/**
 * Post Card - Deleting State
 */
export const PostDeleting: Story = {
  render: () => (
    <div className="max-w-sm">
      <CardPost
        id="5"
        caption="This post is being deleted..."
        status="draft"
        videoCount={1}
        createdAt={new Date().toISOString()}
        isDeleting={true}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  ),
};

/**
 * Post Cards Grid
 */
export const PostsGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <CardPost
        id="1"
        caption="First post with a long caption that demonstrates text truncation"
        status="posted"
        videoCount={2}
        createdAt="2025-01-10"
        publishedAt="2025-01-12"
        onEdit={() => console.log('Edit 1')}
        onDelete={() => console.log('Delete 1')}
        thumbnail={<div className="w-full h-full bg-green-500" />}
      />
      <CardPost
        id="2"
        caption="Draft post"
        status="draft"
        videoCount={1}
        createdAt="2025-01-14"
        onEdit={() => console.log('Edit 2')}
        onDelete={() => console.log('Delete 2')}
        thumbnail={<div className="w-full h-full bg-blue-500" />}
      />
      <CardPost
        id="3"
        caption="Scheduled for later"
        status="scheduled"
        videoCount={3}
        createdAt="2025-01-14"
        publishedAt="2025-01-20"
        onEdit={() => console.log('Edit 3')}
        onDelete={() => console.log('Delete 3')}
        thumbnail={<div className="w-full h-full bg-yellow-500" />}
      />
    </div>
  ),
};
