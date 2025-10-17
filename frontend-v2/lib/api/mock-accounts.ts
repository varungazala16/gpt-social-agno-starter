import { SocialAccount } from '@/types'

const mockAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'instagram',
    username: 'sarahtravels',
    displayName: 'sarahtravels',
    profileImage: '/api/placeholder/100/100',
    followerCount: 45200,
    isConnected: true,
    isSelected: true,
  },
  {
    id: '2',
    platform: 'tiktok',
    username: 'sarah.travels',
    displayName: 'sarah.travels',
    profileImage: '/api/placeholder/100/100',
    followerCount: 128000,
    isConnected: true,
    isSelected: true,
  },
  {
    id: '3',
    platform: 'youtube',
    username: 'SarahTravels',
    displayName: 'Sarah Travels',
    profileImage: '/api/placeholder/100/100',
    followerCount: 89500,
    isConnected: true,
    isSelected: true,
  },
]

export async function getAccounts(): Promise<SocialAccount[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockAccounts
}

export async function getSelectedAccounts(): Promise<SocialAccount[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockAccounts.filter(acc => acc.isSelected)
}

export async function toggleAccountSelection(accountId: string): Promise<SocialAccount[]> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const account = mockAccounts.find(acc => acc.id === accountId)
  if (account) {
    account.isSelected = !account.isSelected
  }
  return mockAccounts
}

export async function deleteAccount(accountId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400))
  const index = mockAccounts.findIndex(acc => acc.id === accountId)
  if (index > -1) {
    mockAccounts.splice(index, 1)
  }
}

export async function addAccount(platform: import('@/types').Platform): Promise<SocialAccount> {
  await new Promise(resolve => setTimeout(resolve, 600))

  // Check if platform already has an account
  const existingAccount = mockAccounts.find(acc => acc.platform === platform)
  if (existingAccount) {
    throw new Error(`An account for ${platform} already exists`)
  }

  const newAccount: SocialAccount = {
    id: String(Date.now()),
    platform,
    username: `newuser_${platform}`,
    displayName: `New ${platform} User`,
    profileImage: '/api/placeholder/100/100',
    followerCount: 0,
    isConnected: true,
    isSelected: true,
  }

  mockAccounts.push(newAccount)
  return newAccount
}

export async function getAvailablePlatforms(): Promise<import('@/types').Platform[]> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const connectedPlatforms = mockAccounts.map(acc => acc.platform)
  const allPlatforms: import('@/types').Platform[] = ['instagram', 'tiktok', 'youtube']
  return allPlatforms.filter(platform => !connectedPlatforms.includes(platform))
}
