# Social Studio - Frontend v2

A mobile-first social media management app built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### Implemented ✅

- **Responsive Layout**: Mobile-first with bottom navigation tabs, desktop sidebar navigation
- **Home Dashboard**:
  - Account selector with multi-platform support (Instagram, TikTok, YouTube)
  - Goal tracking card with circular progress visualization
  - 30-day follower growth chart
  - AI-powered hook suggestions
  - Post coach section with analytics

- **Navigation**: Chat, Hooks, Home, Review, Analytics tabs
- **Dark Theme**: Custom purple/pink accent colors
- **Mock API**: Simulated API calls for easy backend integration later

### Components

- `AccountSelector`: Dropdown to select/toggle social media accounts
- `GoalCard`: Goal progress with circular chart (recharts)
- `FollowerGrowthChart`: Multi-line chart showing growth across platforms
- `NextHookCard`: AI hook suggestions with type selector
- `PostCoachSection`: Post cards with hook/ending scores and view counts
- `MobileTabBar`: Bottom navigation for mobile
- `DesktopSidebar`: Left sidebar navigation for desktop

### API Structure

All mock APIs are in `/lib/api/mock-*.ts`:
- `mock-accounts.ts`: Social account management
- `mock-goals.ts`: Goal and growth data
- `mock-hooks.ts`: Hook suggestions
- `mock-posts.ts`: Post data and analytics

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
frontend-v2/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics page
│   ├── chat/             # Chat page (CopilotKit placeholder)
│   ├── hooks/            # Hooks library page
│   ├── review/           # Content review page
│   ├── settings/         # Settings page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── home/             # Home page components
│   │   ├── GoalCard.tsx
│   │   ├── FollowerGrowthChart.tsx
│   │   ├── NextHookCard.tsx
│   │   └── PostCoachSection.tsx
│   ├── navigation/       # Navigation components
│   │   ├── AppLayout.tsx
│   │   ├── MobileTabBar.tsx
│   │   └── DesktopSidebar.tsx
│   ├── ui/              # shadcn/ui components
│   └── AccountSelector.tsx
├── lib/
│   ├── api/             # Mock API services
│   ├── chat/            # Chat context (placeholder for CopilotKit)
│   └── utils.ts
└── types/               # TypeScript type definitions
```

## Next Steps / TODOs

1. **CopilotKit Integration**: Replace chat placeholder with full CopilotKit implementation
2. **Supabase Backend**: Connect to real Supabase backend for data persistence
3. **Authentication**: Add Supabase Auth
4. **Settings Page**: Build account connection and management UI
5. **All Hooks Page**: Complete hooks library interface
6. **Analytics Page**: Detailed analytics dashboard
7. **Review Page**: Content review and approval workflow
8. **Real Images**: Replace placeholder gradients with real profile/post images
9. **Animations**: Add transitions and loading states
10. **Error Handling**: Comprehensive error boundaries

## Design Notes

- **Mobile-first**: Optimized for mobile screens (320px+)
- **Dark theme default**: Purple (#a855f7) and pink (#ec4899) accents
- **Responsive breakpoints**: Mobile < 768px (bottom tabs), Desktop ≥ 768px (sidebar)
- **Chart colors**: Uses CSS variables for consistent theming

## Button Prompt Mappings

Chat navigation with prefilled prompts:
- "Grow Quicker" → `/chat?prompt=Help me grow my social media faster`
- "Write Script" → `/chat?prompt=Write a script for: [hook text]`
- "Analytics" button → `/analytics?postId=[post_id]`

These can be customized in:
- `components/home/GoalCard.tsx` (Grow Quicker)
- `components/home/NextHookCard.tsx` (Write Script)
- `components/home/PostCoachSection.tsx` (Analytics)
