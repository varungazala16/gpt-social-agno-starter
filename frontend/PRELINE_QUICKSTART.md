# Preline UI Design System - Quick Start Guide

## ✅ What's Been Implemented

### 1. **Preline Initialization** ✓
- Properly configured for Next.js App Router
- Client-side initialization with route change detection
- TypeScript type definitions
- Tailwind Forms plugin installed

### 2. **Design System Foundation** ✓
- Comprehensive design system documentation (`DESIGN_SYSTEM.md`)
- Mobile-first breakpoints (375px primary)
- Dark mode support
- HSL color system maintained
- Accessibility standards defined

### 3. **Card Components** (Priority 1) ✓
Located in: `src/components/preline/Card/`

- `Card` - Flexible base card component
- `CardHeader` - Header section
- `CardBody` - Content section
- `CardFooter` - Footer section with actions
- `CardPost` - Specialized component for video posts
  - Status badges (draft/scheduled/posted)
  - Video count indicator
  - Edit/delete actions
  - Loading states
  - Responsive grid layouts

### 4. **Button Components** (Priority 2) ✓
Located in: `src/components/preline/Button/`

- `Button` - Main button component with variants:
  - **solid** - Blue primary CTA (default)
  - **primary** - Theme-based primary
  - **destructive** - Red danger actions
  - **outline** - Secondary actions
  - **secondary** - Soft gray
  - **ghost** - Minimal style
  - **soft** - Subtle colored
  - **link** - Text link style

- Sizes: sm, default, lg, icon
- States: loading, disabled
- Icon support (Lucide React)
- `ButtonGroup` - Grouped button layouts

### 5. **Storybook Documentation** ✓
- Complete stories for all Card variants
- Complete stories for all Button variants
- Real-world usage examples
- Interactive controls

## 🚀 Using the Components

### Import Components

```tsx
// Cards
import { Card, CardHeader, CardBody, CardFooter, CardPost } from '@/components/preline/Card';

// Buttons
import { Button, ButtonGroup } from '@/components/preline/Button';
```

### Card Example

```tsx
<Card variant="elevated" hover>
  <CardHeader>
    <h3 className="text-lg font-semibold">Title</h3>
  </CardHeader>
  <CardBody>
    <p>Content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### CardPost Example

```tsx
<CardPost
  id="post-1"
  caption="My awesome video"
  status="draft"
  videoCount={2}
  createdAt={new Date().toISOString()}
  onEdit={() => handleEdit()}
  onDelete={() => handleDelete()}
  thumbnail={<VideoPlayer src={url} />}
/>
```

### Button Example

```tsx
// Primary CTA
<Button>
  <PlusCircle /> New Post
</Button>

// Secondary action
<Button variant="outline" size="sm">
  Cancel
</Button>

// Danger action
<Button variant="destructive">
  <Trash2 /> Delete
</Button>

// Loading state
<Button isLoading>Saving...</Button>
```

### Button Group Example

```tsx
<ButtonGroup>
  <Button variant="outline">Draft</Button>
  <Button variant="outline">Schedule</Button>
  <Button>Publish</Button>
</ButtonGroup>
```

## 📦 Component Priorities

**Completed:**
- ✅ Priority 1: Cards & Content Layouts
- ✅ Priority 2: Buttons & CTAs

**Remaining:**
- ⏳ Priority 3: Forms & Inputs
- ⏳ Priority 4: Modals & Overlays
- ⏳ Priority 5: Navigation & Hamburger Menu

## 🎨 Viewing in Storybook

```bash
npm run storybook
```

Then navigate to:
- Preline > Card
- Preline > Button

## 🎯 Next Steps

1. **Continue building remaining priorities:**
   - Form inputs (text, textarea, select, file, switch)
   - Modal/dialog components
   - Mobile navigation with hamburger menu

2. **Integrate into existing app:**
   - Replace PostGallery cards with new CardPost
   - Update buttons to use new Button component
   - Apply consistent styling

3. **Test & refine:**
   - Cross-browser testing
   - Mobile testing (375px+)
   - Dark mode verification
   - Accessibility audit

## 📚 Documentation

- **Design System:** `DESIGN_SYSTEM.md`
- **Preline Docs:** https://preline.co/docs
- **Storybook:** Run `npm run storybook`

## 🔥 Key Features

- **Mobile-First:** All components start at 375px
- **Dark Mode:** Full support out of the box
- **Accessible:** Keyboard navigation, focus states, ARIA
- **Flexible:** Easy to extend and customize
- **Documented:** Complete Storybook coverage
- **Type-Safe:** Full TypeScript support

---

**Ready to continue?** Let me know if you want to:
1. Build the remaining components (forms, modals, navigation)
2. Integrate these components into the existing app
3. Refine and customize the current components
4. Something else!
