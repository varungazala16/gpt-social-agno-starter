# Storybook Configuration

This directory contains the Storybook configuration for the Video Studio application.

## Files

- **main.ts** - Main Storybook configuration
  - Defines story file locations
  - Configures addons
  - Sets up the Next.js framework integration
  - Configures static file serving

- **preview.ts** - Global preview configuration
  - Imports global styles (Tailwind CSS)
  - Sets default parameters for all stories

## Configuration Details

### Story Locations

Stories are located in:
- `../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)` - Example stories
- `../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)` - Component stories

### Addons

- **@storybook/addon-docs** - Automatic documentation generation
- **@storybook/addon-onboarding** - Guided onboarding experience

### Framework

Uses `@storybook/nextjs` for seamless Next.js integration, supporting:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Client components

### Static Files

Static files from `../public` are served at the root path `/` in Storybook.

## Development

To run Storybook:
```bash
npm run storybook
```

To build Storybook for production:
```bash
npm run build-storybook
```
