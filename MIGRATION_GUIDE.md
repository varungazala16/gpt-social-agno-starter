# Monorepo Migration Guide

This document describes the migration to a monorepo structure for the GPT Social project.

## What Changed

The project has been restructured into a monorepo with separate workspaces for frontend and backend:

### Before
```
gpt.social/
├── app/
├── components/
├── lib/
├── package.json
└── ... (all files at root)
```

### After
```
gpt.social/
├── frontend/          # Next.js application
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── ...
├── backend/           # Backend API (placeholder)
│   ├── package.json
│   └── README.md
├── package.json       # Root workspace configuration
├── .mise.toml         # Tool version management
└── README.md          # Monorepo documentation
```

## Key Changes

### 1. File Structure
- All frontend code moved to `frontend/` directory
- Created `backend/` directory as placeholder
- Added root-level configuration files

### 2. NPM Workspaces
- Added root `package.json` with workspace configuration
- Frontend and backend are now npm workspaces
- Can run commands from root: `npm run dev`, `npm run build`, `npm run lint`, `npm test`

### 3. Tool Version Management (mise)
- Added `.mise.toml` for managing Node.js versions
- Added `.tool-versions` for asdf compatibility
- Configured for Node.js 20 LTS

### 4. Code Quality Improvements
- Fixed all ESLint errors
- Ensured strict linting rules are followed
- All builds pass successfully

### 5. Git Ignore
- Updated root `.gitignore` for monorepo
- Frontend retains its own `.gitignore` for frontend-specific ignores

## How to Use

### Installation

```bash
# Clone the repository
git clone https://github.com/scrollmark/gpt.social.git
cd gpt.social

# Install mise (optional)
curl https://mise.run | sh
mise install

# Install all dependencies
npm install
```

### Development

```bash
# From root directory
npm run dev         # Start frontend dev server
npm run build       # Build frontend
npm run lint        # Lint frontend
npm test            # Test frontend
npm run storybook   # Start Storybook

# Or from frontend directory
cd frontend
npm run dev
```

### Working with Workspaces

```bash
# Run command in specific workspace
npm run <script> --workspace=frontend
npm run <script> --workspace=backend

# Install dependency in specific workspace
npm install <package> --workspace=frontend
```

## Migration Checklist

If you're migrating an existing clone or fork:

- [ ] Pull latest changes
- [ ] Delete old `node_modules/` and `.next/` at root
- [ ] Run `npm install` from root
- [ ] Update any scripts that referenced old paths
- [ ] Install mise (optional): `curl https://mise.run | sh && mise install`
- [ ] Verify: `npm run lint && npm run build && npm test`

## Benefits

1. **Clear Separation**: Frontend and backend code are clearly separated
2. **Scalability**: Easy to add new workspaces (mobile app, shared packages, etc.)
3. **Tool Management**: mise ensures consistent Node.js versions across team
4. **Better Organization**: Each workspace has its own dependencies and configuration
5. **Simplified CI/CD**: Can build/test workspaces independently

## Troubleshooting

### "Cannot find module" errors
- Make sure you've run `npm install` from the root directory
- Check that you're in the correct directory when running commands

### Mise not working
- Ensure mise is installed: `curl https://mise.run | sh`
- Activate mise in your shell (see [mise docs](https://mise.jdx.dev/))
- Run `mise install` to install configured Node.js version

### ESLint errors
- Run `npm run lint` from root or frontend directory
- Check that ESLint configuration exists in `frontend/.eslintrc.json`

## Next Steps

1. Backend implementation in `backend/` directory
2. Shared packages (if needed) in `packages/` directory
3. CI/CD pipeline updates for monorepo structure
4. Consider adding Turborepo or Nx for build optimization (optional)

## Questions?

See the main [README.md](./README.md) or check the documentation in each workspace:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
