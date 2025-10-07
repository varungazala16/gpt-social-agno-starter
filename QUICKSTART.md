# Quick Start Guide

Get up and running with GPT Social in 5 minutes using local Supabase!

## Prerequisites

✅ Node.js 18+  
✅ Docker Desktop (running)

## 1️⃣ Install Dependencies

```bash
npm install
```

## 2️⃣ Start Local Supabase

```bash
npm run supabase:start
```

This starts:
- PostgreSQL database
- Supabase Studio (dashboard)
- API Gateway
- Email testing server

**First run takes ~3-5 minutes to download Docker images.**

Once complete, you'll see:

```
API URL: http://127.0.0.1:54321
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
```

## 3️⃣ Configure Environment

```bash
cd frontend
cp .env.example .env.local
```

The `.env.example` is already configured for local development - no changes needed! 🎉

## 4️⃣ Run the App

```bash
npm run dev
```

Open http://localhost:3000

## 5️⃣ Create Your First User

1. Click "Sign Up"
2. Enter email and password
3. Check http://127.0.0.1:54324 for confirmation email (if needed)
4. Sign in and start using the app!

## 🎨 Explore Supabase Studio

Visit http://127.0.0.1:54323 to:
- View database tables
- Browse uploaded videos
- Manage users
- Run SQL queries

## 🛠️ Common Commands

```bash
# Check Supabase status
npm run supabase:status

# Stop Supabase
npm run supabase:stop

# Reset database (fresh start)
npm run supabase:reset

# Run tests
npm test

# Build for production
npm run build
```

## 📚 Next Steps

- **Local Development:** See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)
- **Remote Supabase:** See [frontend/SUPABASE_SETUP.md](./frontend/SUPABASE_SETUP.md)
- **Component Library:** Run `npm run storybook`

## 🐛 Troubleshooting

### Docker not running
```bash
# Start Docker Desktop first, then:
npm run supabase:start
```

### Port conflicts
If ports are in use, edit `supabase/config.toml` to change:
- API port (default: 54321)
- DB port (default: 54322)
- Studio port (default: 54323)

### Reset everything
```bash
npm run supabase:stop
npx supabase db reset --force
npm run supabase:start
```

**📚 For more help, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

## 🚀 Production Setup

For production, you'll want to:
1. Create a remote Supabase project
2. Link: `npm run supabase:link`
3. Push schema: `npm run supabase:push`
4. Update `.env.local` with remote credentials

See [frontend/SUPABASE_SETUP.md](./frontend/SUPABASE_SETUP.md) for details.

---

**That's it! You're ready to build! 🎉**
