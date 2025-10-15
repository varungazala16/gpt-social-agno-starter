# Post Studio Design System

**Version:** 1.0.0
**Framework:** Preline UI + Tailwind CSS
**Mobile-First:** 375px breakpoint
**Last Updated:** 2025-01-15

---

## Philosophy

This design system is built on Preline UI patterns while maintaining flexibility to replace the underlying component library later. All components use utility-first Tailwind CSS with a consistent API that can be adapted to other libraries.

### Core Principles

1. **Mobile-First**: All components start at 375px and scale up
2. **Accessible**: WCAG 2.1 AA compliance minimum
3. **Dark Mode**: Full support via next-themes
4. **Intuitive**: Clear, predictable component APIs
5. **Powerful**: Rich feature set without complexity
6. **Adaptable**: Easy to replace Preline with another library

---

## Color System

We maintain the existing HSL color variables for brand consistency while mapping them to Preline patterns.

### Color Tokens

```css
/* Light Mode */
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
--primary: 222.2 47.4% 11.2%
--primary-foreground: 210 40% 98%
--secondary: 210 40% 96.1%
--destructive: 0 84.2% 60.2%
--border: 214.3 31.8% 91.4%
--ring: 222.2 84% 4.9%

/* Dark Mode */
--background: 222.2 84% 4.9%
--foreground: 210 40% 98%
--primary: 210 40% 98%
--border: 217.2 32.6% 17.5%
```

### Semantic Colors

- **Primary**: Blue (#0ea5e9) - CTAs, links, active states
- **Success**: Green - Positive actions, success states
- **Warning**: Yellow - Caution, intermediate states
- **Danger**: Red - Destructive actions, errors
- **Neutral**: Gray scale - Backgrounds, borders, text

---

## Spacing & Sizing

Using Tailwind's default spacing scale (1 unit = 0.25rem = 4px):

### Spacing Scale
- `xs`: 2 (8px)
- `sm`: 3 (12px)
- `md`: 4 (16px)
- `lg`: 6 (24px)
- `xl`: 8 (32px)
- `2xl`: 12 (48px)
- `3xl`: 16 (64px)

### Component Sizes
- **Small**: Compact UI, mobile contexts
- **Default**: Standard desktop/mobile
- **Large**: Prominent actions, hero sections

---

## Typography

### Font Stack
```css
font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
```

### Type Scale
- **Display**: text-4xl to text-6xl (36px - 60px)
- **Heading**: text-2xl to text-3xl (24px - 30px)
- **Body**: text-base (16px)
- **Small**: text-sm (14px)
- **Tiny**: text-xs (12px)

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## Breakpoints

Mobile-first responsive design:

```javascript
{
  xs: '375px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Large screens
}
```

---

## Component Priority

Development order based on user requirements:

1. **Cards & Content Layouts** - Core content display
2. **Buttons & CTAs** - Primary interactions
3. **Forms & Inputs** - Data entry
4. **Modals & Overlays** - Contextual UI
5. **Navigation & Sidebar** - App navigation (hamburger menu)

---

## Component Patterns

### Naming Convention

```
{Component}{Variant?}{Size?}
```

Examples:
- `CardPost` - Post-specific card
- `ButtonPrimary` - Primary button
- `InputText` - Text input field

### Props API

All components follow this pattern:

```typescript
interface BaseComponentProps {
  className?: string        // Additional Tailwind classes
  variant?: 'default' | ... // Visual variant
  size?: 'sm' | 'default' | 'lg' // Size variant
  disabled?: boolean        // Disabled state
  children?: React.ReactNode
}
```

### File Structure

```
src/components/
├── preline/              # Preline-based components
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── CardPost.tsx
│   │   ├── Card.stories.tsx
│   │   └── index.ts
│   ├── Button/
│   ├── Form/
│   ├── Modal/
│   └── Navigation/
├── ui/                   # Existing shadcn/ui components
└── [feature]/            # Feature-specific components
```

---

## Mobile-First Patterns

### Navigation
- **< 768px**: Hamburger menu (bottom or top)
- **≥ 768px**: Expanded sidebar

### Cards
- **< 640px**: Single column, full-width
- **≥ 640px**: 2 columns
- **≥ 1024px**: 3 columns

### Forms
- **< 640px**: Stacked labels
- **≥ 640px**: Inline labels where appropriate

---

## Dark Mode Implementation

Using `next-themes` with class-based dark mode:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">Content</p>
</div>
```

---

## Accessibility

### Requirements
- Keyboard navigation for all interactive elements
- ARIA labels where needed
- Focus indicators (ring-2 ring-offset-2)
- Semantic HTML
- Color contrast ratio ≥ 4.5:1

### Focus States
```css
focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
```

---

## Animation & Transitions

### Standard Transitions
```css
transition-all duration-200 ease-in-out
```

### Hover States
```css
hover:bg-gray-100 dark:hover:bg-gray-800
```

### Loading States
- Skeleton loaders for content
- Spinners for actions
- Progressive loading for images

---

## Iconography

Using **Lucide React** icons:

```tsx
import { PlusCircle, Settings, Video } from 'lucide-react'

<PlusCircle className="w-5 h-5" />
```

### Icon Sizes
- Small: w-4 h-4 (16px)
- Default: w-5 h-5 (20px)
- Large: w-6 h-6 (24px)

---

## Component Catalog

### 1. Cards (Priority 1)
- `CardPost` - Video post display
- `CardMedia` - Media-focused card
- `CardSimple` - Basic content card
- `CardInteractive` - Clickable card with hover effects

### 2. Buttons (Priority 2)
- `ButtonPrimary` - Main CTAs
- `ButtonSecondary` - Secondary actions
- `ButtonGhost` - Tertiary actions
- `ButtonIcon` - Icon-only buttons

### 3. Forms (Priority 3)
- `Input` - Text input
- `Textarea` - Multi-line text
- `Select` - Dropdown select
- `FileInput` - File upload
- `Switch` - Toggle switch

### 4. Modals (Priority 4)
- `Modal` - Standard modal
- `ModalConfirm` - Confirmation dialog
- `Drawer` - Slide-out panel

### 5. Navigation (Priority 5)
- `NavbarMobile` - Mobile hamburger navigation
- `Sidebar` - Desktop sidebar
- `NavLink` - Navigation link component

---

## Usage Examples

### Card Component

```tsx
import { CardPost } from '@/components/preline/Card'

<CardPost
  title="My Video Post"
  status="draft"
  videoUrl="/path/to/video.mp4"
  onEdit={() => {}}
  onDelete={() => {}}
/>
```

### Button Component

```tsx
import { ButtonPrimary } from '@/components/preline/Button'

<ButtonPrimary
  size="lg"
  onClick={handleClick}
  disabled={isLoading}
>
  Create Post
</ButtonPrimary>
```

---

## Testing Strategy

### Unit Tests
- Component rendering
- Prop variations
- Event handlers

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- ARIA attributes

### Visual Regression
- Storybook snapshots
- Cross-browser testing

---

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

## Migration Path

To replace Preline with another library:

1. Components use standard prop interfaces
2. Utility classes are portable to any Tailwind-based library
3. Component logic is library-agnostic
4. Update imports in `preline/` folder only

---

## Resources

- [Preline Documentation](https://preline.co/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Next.js](https://nextjs.org)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

