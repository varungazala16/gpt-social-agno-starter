import { Post } from '@/types'

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Morning routine that changed...',
    thumbnailUrl: '/api/placeholder/400/300',
    analytics: {
      hookScore: 87,
      endingScore: 92,
      views: 45200,
    },
    platforms: ['instagram', 'tiktok', 'youtube'],
  },
  {
    id: '2',
    title: 'Why I quit my 9-5 to create...',
    thumbnailUrl: '/api/placeholder/400/300',
    analytics: {
      hookScore: 72,
      endingScore: 65,
      views: 128000,
    },
    platforms: ['instagram', 'youtube'],
  },
  {
    id: '3',
    title: '3 productivity hacks you\'re not...',
    thumbnailUrl: '/api/placeholder/400/300',
    analytics: {
      hookScore: 94,
      endingScore: 88,
      views: 89500,
    },
    platforms: ['tiktok', 'youtube'],
  },
]

export async function getPosts(): Promise<Post[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockPosts
}

export async function getPost(id: string): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockPosts.find(post => post.id === id)
}
