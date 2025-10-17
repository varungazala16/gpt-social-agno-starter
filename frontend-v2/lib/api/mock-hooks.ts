import { Hook } from '@/types'

const mockHooks: Hook[] = [
  {
    id: '1',
    text: 'Travel hack everyone needs to know',
    type: 'Video Concept',
    isSaved: false,
    details: {
      description: [
        'A 5-7s video of you packing a carry-on with the text on screen: "Travel hack everyone needs to know" showing 3 space-saving techniques that resonate with your <stay-at-home-mom niche>',
      ],
      examples: [
        'rolling clothes instead of folding',
        'using packing cubes for organization',
        'stuffing shoes with socks to save space',
      ],
    },
  },
  {
    id: '2',
    text: 'Packing hack that saves space',
    type: 'Video Concept',
    isSaved: false,
    details: {
      description: [
        'Show a before/after comparison of packing methods',
        'Demonstrate how much more fits with proper organization',
        'Target <travel enthusiasts> looking to maximize luggage space',
      ],
      examples: [
        'vacuum seal bags for bulky items',
        'roll and bundle method',
        'use every inch including shoes',
      ],
    },
  },
  {
    id: '3',
    text: 'Airport security tip',
    type: 'Video Concept',
    isSaved: false,
    details: {
      description: [
        'Quick 10-second tip that speeds up security screening',
        'Appeals to <frequent flyers> who value efficiency',
        'Simple, actionable advice anyone can use',
      ],
      examples: [
        'wear slip-on shoes',
        'organize electronics in one bin',
        'TSA PreCheck application process',
      ],
    },
  },
  {
    id: '4',
    text: 'Best time to post content',
    type: 'Video Concept',
    isSaved: false,
    details: {
      description: [
        'Data-driven insights about optimal posting times',
        'Tailored for <content creators> looking to maximize reach',
        'Include platform-specific recommendations',
      ],
      examples: [
        'analyze your audience insights',
        'test different time slots',
        'consider timezone differences',
      ],
    },
  },
  {
    id: '5',
    text: 'I fear I do enjoy...',
    type: 'Opening Line',
    isSaved: false,
    details: {
      description: [
        'A vulnerable confession that hooks viewers immediately',
        'Creates curiosity about what you enjoy',
        'Works well for <lifestyle content> and personal stories',
      ],
    },
  },
]

let todaysHookId = mockHooks[0].id

// Load saved hooks from localStorage
function loadSavedHooks(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  const saved = localStorage.getItem('saved_hooks')
  return saved ? new Set(JSON.parse(saved)) : new Set()
}

// Save hooks to localStorage
function saveSavedHooks(savedIds: Set<string>) {
  if (typeof window === 'undefined') return
  localStorage.setItem('saved_hooks', JSON.stringify(Array.from(savedIds)))
}

export async function getTodaysHook(): Promise<Hook> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const savedHooks = loadSavedHooks()
  const hook = mockHooks.find(h => h.id === todaysHookId)
  if (hook) {
    return { ...hook, isSaved: savedHooks.has(hook.id) }
  }
  return { ...mockHooks[0], isSaved: savedHooks.has(mockHooks[0].id) }
}

export async function getSuggestedHooks(): Promise<Hook[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const savedHooks = loadSavedHooks()
  return mockHooks.map(hook => ({
    ...hook,
    isSaved: savedHooks.has(hook.id),
  }))
}

export async function getSavedHooks(): Promise<Hook[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const savedHooks = loadSavedHooks()
  return mockHooks
    .filter(hook => savedHooks.has(hook.id))
    .map(hook => ({ ...hook, isSaved: true }))
}

export async function getNextHook(): Promise<Hook> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const savedHooks = loadSavedHooks()
  const currentIndex = mockHooks.findIndex(h => h.id === todaysHookId)
  const nextIndex = (currentIndex + 1) % mockHooks.length
  const hook = mockHooks[nextIndex]
  return { ...hook, isSaved: savedHooks.has(hook.id) }
}

export async function dismissHook(): Promise<Hook> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const currentIndex = mockHooks.findIndex(h => h.id === todaysHookId)
  const nextIndex = (currentIndex + 1) % mockHooks.length
  todaysHookId = mockHooks[nextIndex].id
  return getTodaysHook()
}

export async function saveHook(hookId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const savedHooks = loadSavedHooks()
  savedHooks.add(hookId)
  saveSavedHooks(savedHooks)
}

export async function unsaveHook(hookId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const savedHooks = loadSavedHooks()
  savedHooks.delete(hookId)
  saveSavedHooks(savedHooks)
}

export async function toggleSaveHook(hookId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const savedHooks = loadSavedHooks()

  if (savedHooks.has(hookId)) {
    savedHooks.delete(hookId)
    saveSavedHooks(savedHooks)
    return false
  } else {
    savedHooks.add(hookId)
    saveSavedHooks(savedHooks)
    return true
  }
}
