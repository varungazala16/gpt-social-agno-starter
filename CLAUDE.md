# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GPT Social is a full-stack video studio application with social media integration. It's a monorepo with:
- **Frontend**: Next.js 15.5 application with video capabilities, Supabase auth/storage, Storybook components, and CopilotKit integration
- **Backend**: FastAPI application for social media OAuth, AI agents (Agno), and credit management

## Common Development Commands

### Frontend (from root or `frontend/` directory)
```bash
npm run dev                    # Start Next.js dev server (port 3000)
npm run build                  # Build for production
npm run lint                   # Run ESLint
npm test                       # Run Vitest tests in watch mode
npm test -- --run              # Run tests once
npm run test:ui                # Run tests with UI
npm run test:coverage          # Run tests with coverage
npm run storybook              # Start Storybook (port 6006)
npm run build-storybook        # Build Storybook

# Supabase commands (run from root or frontend/)
npm run supabase:start         # Start local Supabase
npm run supabase:stop          # Stop local Supabase
npm run supabase:status        # Check Supabase status
npm run supabase:reset         # Reset local database
npm run supabase:pull          # Pull schema from remote
npm run supabase:push          # Push migrations to remote
```

### Backend (from `backend/` directory)
```bash
poetry install                 # Install dependencies
poetry run uvicorn app.main:app --reload  # Start FastAPI server (port 8000)
poetry run alembic upgrade head           # Run migrations
poetry run alembic revision --autogenerate -m "description"  # Create new migration

# Code quality
poetry run ruff check .        # Run linter
poetry run ruff format .       # Format code
poetry run mypy .              # Type check
poetry run pytest              # Run tests
poetry run pre-commit run --all-files  # Run all pre-commit hooks
```

## Architecture

### Backend Architecture

**Core Layers:**
- **app/main.py**: FastAPI app entry point with CORS, router registration
- **app/core/**: Core infrastructure
  - `config.py`: Pydantic settings from `.env` (Supabase, OAuth, DB, AI keys)
  - `database.py`: SQLAlchemy async engine with `AsyncSessionLocal`
  - `auth.py`: Supabase JWT auth with `get_current_user()`, `require_credits()` decorator
  - `streaming.py`: SSE streaming utilities for AI agent responses
- **app/api/v1/**: API endpoints (`auth`, `connections`, `tiktok`, `instagram`, `youtube`, `agent`, `copilot`, `credits`)
- **app/models/**: SQLAlchemy models (`User`, `SocialAccount`, `AgentSession`, `AgentMessage`, `UserCredit`, `CreditTransaction`)
- **app/services/**: Business logic
  - `oauth/`: TikTok, Instagram, YouTube OAuth flows
  - `ai/`: AI agents (`script_generator.py` - Agno agent, `copilot_assistant.py` - CopilotKit integration)
  - `credits.py`: Credit management with `CreditsService`
  - `agent_storage.py`: Persist agent sessions/messages
  - `notifications.py`: User notifications

**Key Patterns:**
- **Dependency Injection**: FastAPI `Depends()` for `Database`, `SupabaseClient`, `User`, `CreditsService`
- **Authentication**: All protected endpoints use `current_user: User` parameter (validates Supabase JWT)
- **Credits System**: Use `@require_credits(cost=N)` decorator on endpoints to check/deduct credits
- **Streaming**: Agent responses use SSE via `StreamingResponse` with `create_agent_stream()`
- **Database**: PostgreSQL via Supabase with async SQLAlchemy, Alembic migrations in `app/alembic/`

**OAuth Flow:**
1. Frontend redirects to `/api/v1/{platform}/oauth2/login`
2. Backend redirects to platform OAuth
3. Platform redirects to `/api/v1/{platform}/oauth2/callback/`
4. Backend stores encrypted tokens in `SocialAccount` model
5. Returns success page or redirects to frontend

**AI Integration:**
- **Agno**: Used for script generation (`ScriptGeneratorAgent`)
- **CopilotKit**: AG-UI protocol endpoint at `/api/v1/copilot/agno-agent` for conversational UI
- **Anthropic/OpenAI**: Configured via `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`, default model in `DEFAULT_LLM_MODEL`

### Frontend Architecture

**Key Technologies:**
- **Next.js 15.5**: App Router, Server Components, Server Actions
- **Supabase**: Auth (@supabase/ssr, @supabase/supabase-js) and Storage
- **UI**: Tailwind CSS, Radix UI components, Preline patterns, Lucide icons
- **State**: React Query (@tanstack/react-query) for server state
- **Testing**: Vitest + React Testing Library
- **Video**: FFmpeg (@ffmpeg/ffmpeg), Remotion (@remotion/player)
- **AI**: CopilotKit (@copilotkit/react-core, @copilotkit/react-ui) with AG-UI (@ag-ui/client)

**Important Frontend Patterns:**
- Local Supabase for development (see `LOCAL_DEVELOPMENT.md`)
- Supabase auth uses cookie-based sessions with SSR
- Video features: player, upload, recording, editing
- Storybook for component documentation

## Database

**Connection:**
- PostgreSQL via Supabase
- Async SQLAlchemy with `postgresql+asyncpg://` driver
- Connection string built from `POSTGRES_SERVER`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

**Migrations:**
- Alembic managed in `backend/app/alembic/`
- Run `poetry run alembic upgrade head` after pulling
- Create migrations: `poetry run alembic revision --autogenerate -m "description"`

**Key Models:**
- `User`: Synced with Supabase auth
- `SocialAccount`: OAuth tokens (encrypted with `SQLALCHEMY_ENCRYPTION_KEY`)
- `UserCredit`, `CreditTransaction`: Credit system (users start with 1000 credits)
- `AgentSession`, `AgentMessage`: AI conversation history

## Environment Configuration

**Backend** (`.env` in `backend/`):
- Required: `SUPABASE_URL`, `SUPABASE_KEY` (service role key)
- Required: `POSTGRES_*` credentials matching Supabase DB
- Required: `SQLALCHEMY_ENCRYPTION_KEY` (64-char hex for encrypting OAuth tokens)
- Required: `SECRET_KEY`, `FIRST_SUPERUSER`, `FIRST_SUPERUSER_PASSWORD`
- OAuth: `TIKTOK_*`, `INSTAGRAM_*`, `YOUTUBE_*` credentials and redirect URIs
- AI: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `DEFAULT_LLM_MODEL`
- Optional: `BACKEND_CORS_ORIGINS` (comma-separated URLs)

**Frontend** (`.env.local` in `frontend/`):
- Supabase connection details
- Backend API URL

## Testing Strategy

**Backend:**
- Framework: pytest with pytest-asyncio
- Type checking: mypy with strict mode
- Linting: Ruff (line length 120)
- Run single test: `poetry run pytest tests/test_file.py::test_name`

**Frontend:**
- Framework: Vitest + React Testing Library
- Run single test: `npm test -- path/to/test.test.ts`

## Development Workflow

1. **Starting Development:**
   - Frontend: `npm run supabase:start` then `npm run dev`
   - Backend: `poetry run uvicorn app.main:app --reload`

2. **Database Changes:**
   - Modify models in `app/models/`
   - Generate migration: `poetry run alembic revision --autogenerate -m "description"`
   - Apply: `poetry run alembic upgrade head`

3. **Adding New Endpoints:**
   - Create router in `app/api/v1/`
   - Register in `app/main.py`
   - Add schemas in `app/schemas/`
   - Implement business logic in `app/services/`

4. **OAuth Integration:**
   - Add credentials to `.env`
   - Create OAuth service in `app/services/oauth/`
   - Create router in `app/api/v1/`
   - Store tokens in `SocialAccount` model (auto-encrypted)

5. **Credit-Gated Operations:**
   - Add `@require_credits(cost=N)` decorator to endpoint
   - Ensure endpoint has `current_user: User`, `db: Database`, `supabase_client: SupabaseClient` parameters

## Deployment

**Backend:**
- GitHub Actions auto-deploys to GCP Cloud Run on push to `main`
- Environment variables stored in GCP Secret Manager
- Docker container built from `backend/` directory
- See `backend/README.md` for GCP setup details

## Important Notes

- Frontend and backend are separate applications - start both for full stack development
- Local Supabase is recommended for development (Docker required)
- OAuth redirect URIs must match environment (localhost:8000 for local)
- Credits are automatically initialized to 1000 for new users
- All OAuth tokens are encrypted at rest using `SQLALCHEMY_ENCRYPTION_KEY`
- Agent streaming uses SSE (Server-Sent Events) for real-time responses
