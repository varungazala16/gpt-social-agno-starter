# GPT Social - Video Studio

A modern, full-stack video studio application for playing, uploading, recording, and editing videos.

## Project Structure

This is a monorepo containing:

```
gpt.social/
├── frontend/          # Next.js frontend application
├── backend/           # Backend API server (coming soon)
└── README.md          # This file
```

## Frontend

The frontend is a Next.js 15.5 application with:
- Video player, upload, recording, and editing capabilities
- Supabase authentication and storage
- Storybook component documentation
- Vitest testing with React Testing Library

[View Frontend Documentation](./frontend/README.md)

## Backend

Backend API server (coming soon).

[View Backend Documentation](./backend/README.md)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [mise](https://github.com/jdx/mise) (recommended for managing tool versions)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/scrollmark/gpt.social.git
cd gpt.social
```

2. Install mise (optional but recommended):
```bash
# Install mise (see https://mise.jdx.dev/getting-started.html)
curl https://mise.run | sh

# Activate mise and install Node.js
mise install
```

3. Install dependencies:
```bash
# Install all workspace dependencies from the root
npm install

# Or install frontend dependencies individually
cd frontend
npm install
```

4. Set up the frontend:
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

5. Run the development server:
```bash
# From the root directory
npm run dev

# Or from the frontend directory
cd frontend
npm run dev
```

## Development

### Available Scripts

From the root directory, you can run:

- `npm run dev` - Start the frontend development server
- `npm run build` - Build the frontend for production
- `npm run lint` - Lint the frontend code
- `npm test` - Run frontend tests
- `npm run storybook` - Start Storybook for component development

Each workspace has its own development setup. See the respective README files for details:

- [Frontend Development](./frontend/README.md)
- [Backend Development](./backend/README.md)

## Testing

Run tests from the root or frontend directory:

```bash
# From root
npm test

# From frontend directory
cd frontend
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## Linting

Run linting from the root or frontend directory:

```bash
# From root
npm run lint

# From frontend directory
cd frontend
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- Built with Next.js 15.5
- Styled with Tailwind CSS
- UI patterns from Preline
- Icons from Lucide React
- Component documentation with Storybook 9
