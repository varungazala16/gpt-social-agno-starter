# Local Supabase Setup - Visual Guide

## 📁 Project Structure

```
gpt.social/
├── 📖 Documentation
│   ├── QUICKSTART.md              # ⚡ 5-minute setup guide
│   ├── LOCAL_DEVELOPMENT.md       # 📚 Complete local dev guide
│   ├── LOCAL_VS_REMOTE.md         # 🤔 Choose local vs remote
│   ├── TROUBLESHOOTING.md         # 🔧 Common issues & solutions
│   └── LOCAL_SUPABASE_FEATURE.md  # 📋 Feature summary
│
├── 🗄️ Supabase Configuration
│   └── supabase/
│       ├── config.toml            # Local Supabase settings
│       ├── migrations/            # Database schema versions
│       │   └── 20250101000000_initial_setup.sql
│       ├── seed.sql               # Test data for local dev
│       └── .gitignore
│
├── 🔧 Sync Utilities
│   └── scripts/
│       ├── sync-from-remote.sh    # Remote → Local
│       ├── sync-to-remote.sh      # Local → Remote
│       └── README.md              # Scripts documentation
│
├── 💻 Frontend Application
│   └── frontend/
│       ├── .env.example           # ✅ Pre-configured for local
│       ├── SUPABASE_SETUP.md      # Remote Supabase setup
│       └── package.json           # NPM scripts
│
└── 📦 Root Configuration
    ├── package.json               # Workspace scripts
    └── README.md                  # Main documentation
```

## 🚀 Quick Start Flow

```
┌─────────────────────────────────────────────────────────┐
│  1. Clone Repository                                    │
│  git clone https://github.com/scrollmark/gpt.social    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  2. Install Dependencies                                │
│  npm install                                            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  3. Start Local Supabase                                │
│  npm run supabase:start                                 │
│                                                          │
│  Downloads Docker images (first time: ~3-5 min)         │
│  Starts: PostgreSQL, Storage, Auth, Studio              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  4. Configure Environment                               │
│  cd frontend                                            │
│  cp .env.example .env.local                             │
│  # Already configured for local! ✅                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  5. Run Application                                     │
│  npm run dev                                            │
│                                                          │
│  Open: http://localhost:3000                            │
└─────────────────────────────────────────────────────────┘
                         ↓
                    🎉 You're Ready!
```

## 🌐 Local Supabase Stack

When you run `npm run supabase:start`:

```
┌─────────────────────────────────────────────────────────────┐
│                     DOCKER CONTAINER                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🌐 API Gateway (Kong)                               │  │
│  │  http://127.0.0.1:54321                              │  │
│  │  • REST API                                          │  │
│  │  • GraphQL                                           │  │
│  │  • Realtime                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🗄️ PostgreSQL Database                              │  │
│  │  port 54322                                          │  │
│  │  • User: postgres                                    │  │
│  │  • Pass: postgres                                    │  │
│  │  • RLS enabled                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📦 Storage (S3-compatible)                          │  │
│  │  • File uploads                                      │  │
│  │  • Bucket: 'videos'                                  │  │
│  │  • RLS policies                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🔐 Auth (GoTrue)                                    │  │
│  │  • Email/Password                                    │  │
│  │  • OAuth providers                                   │  │
│  │  • Magic links                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🎨 Supabase Studio                                  │  │
│  │  http://127.0.0.1:54323                              │  │
│  │  • Database viewer                                   │  │
│  │  • SQL editor                                        │  │
│  │  • Storage browser                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📧 Inbucket (Email Testing)                         │  │
│  │  http://127.0.0.1:54324                              │  │
│  │  • View test emails                                  │  │
│  │  • No real emails sent                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Development Workflows

### Workflow 1: Pure Local (Recommended for Development)

```
┌─────────────┐
│   Start     │
│   Supabase  │
│   Locally   │
└─────────────┘
      ↓
┌─────────────┐
│   Develop   │
│   Features  │
└─────────────┘
      ↓
┌─────────────┐
│    Test     │
│   Locally   │
└─────────────┘
      ↓
┌─────────────┐
│   Create    │
│  Migration  │
└─────────────┘
      ↓
┌─────────────┐
│   Commit    │
│   to Git    │
└─────────────┘
```

### Workflow 2: Team Collaboration

```
       Remote Supabase (Shared)
              ↓
       ┌──────────────┐
       │ Pull Schema  │
       └──────────────┘
              ↓
    ┌─────────────────────┐
    │  Local Development  │
    │                     │
    │  Dev 1 → Local DB   │
    │  Dev 2 → Local DB   │
    │  Dev 3 → Local DB   │
    └─────────────────────┘
              ↓
       ┌──────────────┐
       │ Push Changes │
       └──────────────┘
              ↓
       Remote Supabase (Updated)
```

### Workflow 3: Migration Pipeline

```
┌────────────────────┐
│  Local Supabase    │
│                    │
│  • Create migration│
│  • Test locally    │
└────────────────────┘
          ↓
┌────────────────────┐
│  Remote Staging    │
│                    │
│  • Push migration  │
│  • Test staging    │
└────────────────────┘
          ↓
┌────────────────────┐
│  Remote Production │
│                    │
│  • Deploy          │
│  • Monitor         │
└────────────────────┘
```

## 🎯 NPM Scripts Reference

### Essential Commands

```bash
# Start/Stop
npm run supabase:start          # 🚀 Start local Supabase
npm run supabase:stop           # 🛑 Stop local Supabase
npm run supabase:status         # 📊 Check status

# Reset
npm run supabase:reset          # 🔄 Reset DB (migrations + seeds)

# Development
npm run dev                     # 💻 Start Next.js dev server
npm test                        # 🧪 Run tests
npm run build                   # 📦 Build for production
```

### Schema Management

```bash
# Migrations
npm run supabase:migration:new  # ✨ Create new migration
npm run supabase:pull           # ⬇️ Pull schema from remote
npm run supabase:push           # ⬆️ Push migrations to remote

# Link
npm run supabase:link           # 🔗 Connect to remote project
```

### Complete Sync

```bash
# Sync from remote to local
npm run supabase:sync:from-remote
# ↓ Pulls schema
# ↓ Optionally dumps data
# ↓ Generates migrations

# Sync from local to remote
npm run supabase:sync:to-remote
# ↓ Shows pending changes
# ↓ Asks confirmation
# ↓ Pushes migrations
```

## 🔑 Environment Variables

### Local Development (Default)

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=admin@example.com
```

### Remote Production

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
ADMIN_EMAIL=admin@production.com
```

## 📚 Documentation Map

```
Need help with...              Read this...
─────────────────────────────────────────────────────────
Getting started quickly        → QUICKSTART.md
Understanding local dev        → LOCAL_DEVELOPMENT.md
Choosing local vs remote       → LOCAL_VS_REMOTE.md
Fixing issues                  → TROUBLESHOOTING.md
Feature overview               → LOCAL_SUPABASE_FEATURE.md
Remote Supabase setup          → frontend/SUPABASE_SETUP.md
Sync scripts                   → scripts/README.md
```

## ⚡ Quick Commands Cheatsheet

```bash
# First Time Setup
npm install
npm run supabase:start
cd frontend && cp .env.example .env.local
npm run dev

# Daily Development
npm run supabase:start  # (if not running)
npm run dev

# Create New Feature
npm run supabase:migration:new feature_name
# Edit: supabase/migrations/XXXXX_feature_name.sql
npm run supabase:reset  # Test
git add . && git commit  # Save

# Deploy to Remote
npm run supabase:link    # (first time only)
npm run supabase:push    # Push migrations

# Team Sync
npm run supabase:sync:from-remote  # Get latest
npm run supabase:reset             # Apply locally

# Troubleshooting
npm run supabase:stop
npm run supabase:start
npm run supabase:reset  # Clean slate
```

## 🎯 Access Points

When local Supabase is running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend App** | http://localhost:3000 | Your Next.js app |
| **Supabase API** | http://127.0.0.1:54321 | REST/GraphQL API |
| **Supabase Studio** | http://127.0.0.1:54323 | Database dashboard |
| **Email Testing** | http://127.0.0.1:54324 | View test emails |
| **PostgreSQL** | port 54322 | Direct DB access |

## 🏆 Best Practices

### ✅ DO

- ✅ Develop locally first
- ✅ Create migrations for schema changes
- ✅ Test migrations locally before pushing
- ✅ Use seed data for realistic testing
- ✅ Commit migrations to git
- ✅ Pull remote changes regularly (teams)
- ✅ Use `npm run supabase:reset` to get clean state

### ❌ DON'T

- ❌ Edit remote schema directly
- ❌ Skip migrations
- ❌ Commit `.env.local` files
- ❌ Push untested migrations to production
- ❌ Forget to run migrations on remote
- ❌ Use local DB for production

## 🚀 Ready to Start?

1. **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)
2. **Deep Dive**: See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)
3. **Having Issues**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Happy Coding! 🎉**
