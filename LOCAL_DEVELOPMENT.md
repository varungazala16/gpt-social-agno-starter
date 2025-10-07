# Local Supabase Development Guide

This guide will help you set up and use Supabase locally for development, including syncing with your remote Supabase instance.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker Desktop (required for local Supabase)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Local Supabase

```bash
npm run supabase:start
```

This will start the local Supabase stack with:
- PostgreSQL database on port 54322
- Supabase Studio on http://127.0.0.1:54323
- API Gateway on http://127.0.0.1:54321
- Inbucket (email testing) on http://127.0.0.1:54324

The first time you run this, it will download the necessary Docker images (~2-3GB).

### 3. Configure Environment Variables

Copy the example environment file and use the local Supabase credentials:

```bash
cd frontend
cp .env.example .env.local
```

The `.env.example` is already configured with local Supabase defaults:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
ADMIN_EMAIL=admin@example.com
```

### 4. Run the Application

```bash
npm run dev
```

Your app is now running against the local Supabase instance!

## Supabase Studio

Access Supabase Studio (local dashboard) at http://127.0.0.1:54323

Here you can:
- View and edit database tables
- Test SQL queries
- Manage storage buckets
- View authentication users
- Test real-time subscriptions

## Email Testing

Local Supabase includes Inbucket for email testing. View emails at http://127.0.0.1:54324

This is useful for testing:
- Email confirmations
- Password reset emails
- Magic link authentication

## Available Scripts

### Start/Stop Local Supabase

```bash
# Start local Supabase
npm run supabase:start

# Stop local Supabase
npm run supabase:stop

# Check status
npm run supabase:status
```

### Database Management

```bash
# Reset database to initial state (runs migrations and seeds)
npm run supabase:reset

# Create a new migration
npm run supabase:migration:new <migration_name>
```

### Sync with Remote Supabase

```bash
# Link to your remote Supabase project (one-time setup)
npm run supabase:link

# Pull schema from remote to local (generates migration)
npm run supabase:pull

# Push local migrations to remote
npm run supabase:push
```

## Working with Migrations

### Creating Migrations

Migrations are SQL files that define your database schema. They live in `supabase/migrations/`.

To create a new migration:

```bash
npm run supabase:migration:new add_new_table
```

This creates a file like `supabase/migrations/20250107120000_add_new_table.sql`

Example migration:

```sql
-- Create a new table
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own posts"
ON public.posts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### Applying Migrations

Migrations are automatically applied when you:
- Start Supabase: `npm run supabase:start`
- Reset the database: `npm run supabase:reset`

## Syncing Between Local and Remote

### Initial Setup: Link to Remote Project

First, link your local development to your remote Supabase project:

```bash
npm run supabase:link
```

You'll be prompted for:
- Your Supabase project reference ID (find it in your project URL: `https://app.supabase.com/project/YOUR_REF_ID`)
- Your database password

### Pulling Schema from Remote

To sync your remote database schema to local:

```bash
npm run supabase:pull
```

This will:
1. Connect to your remote database
2. Generate SQL migrations based on the remote schema
3. Save them in `supabase/migrations/`

**Important:** Review the generated migrations before committing them!

### Pushing Changes to Remote

After creating and testing migrations locally, push them to remote:

```bash
npm run supabase:push
```

This applies all local migrations to your remote database.

**Warning:** This can modify your production database. Use with caution!

## Data Seeding

### Local Seed Data

The file `supabase/seed.sql` contains seed data for local development. It runs automatically during `npm run supabase:reset`.

Example seed file:

```sql
-- Create a test user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

### Syncing Data from Remote

To copy data from remote to local:

```bash
# Dump data from remote
npx supabase db dump --data-only -f supabase/seed.sql

# Apply to local
npm run supabase:reset
```

## Storage Buckets

### Local Storage Setup

Storage buckets are configured in `supabase/migrations/20250101000000_initial_setup.sql`.

The `videos` bucket is created with RLS policies that:
- Allow authenticated users to upload videos to their own folder
- Restrict access to user's own videos
- Enable full CRUD operations on user's videos

### Testing Storage Locally

1. Upload a file through your app
2. View it in Supabase Studio → Storage
3. Files are stored in Docker volumes (persist across restarts)

## Switching Between Local and Remote

### Use Local for Development

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### Use Remote for Testing/Production

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

Having issues? See [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) for common problems and solutions.

### Docker Issues

**Problem:** `Cannot connect to Docker daemon`

**Solution:** Make sure Docker Desktop is running

```bash
# Check Docker status
docker ps
```

### Port Conflicts

**Problem:** Port already in use

**Solution:** Stop conflicting services or change ports in `supabase/config.toml`

```toml
[api]
port = 54321  # Change if needed

[db]
port = 54322  # Change if needed

[studio]
port = 54323  # Change if needed
```

### Reset Everything

If you encounter issues, try a clean reset:

```bash
# Stop Supabase
npm run supabase:stop

# Remove all data
npx supabase db reset --force

# Start fresh
npm run supabase:start
```

### Migration Conflicts

**Problem:** Migration fails due to existing objects

**Solution:** Migrations should be idempotent. Use `IF NOT EXISTS` or `ON CONFLICT`:

```sql
-- Good
CREATE TABLE IF NOT EXISTS posts (...);

-- Good
INSERT INTO storage.buckets (id, name)
VALUES ('videos', 'videos')
ON CONFLICT (id) DO NOTHING;
```

## Best Practices

### 1. Always Use Migrations

Don't make schema changes directly in the database. Always create migrations:

```bash
npm run supabase:migration:new descriptive_name
```

### 2. Test Migrations Locally First

```bash
# Reset and test migration
npm run supabase:reset

# If it works, push to remote
npm run supabase:push
```

### 3. Keep Local and Remote in Sync

Regularly pull changes from remote if working in a team:

```bash
npm run supabase:pull
```

### 4. Use Seed Data for Testing

Keep `supabase/seed.sql` updated with realistic test data:

```sql
-- Create test users
-- Create sample data
-- Set up test scenarios
```

### 5. Version Control

Commit these files:
- ✅ `supabase/config.toml`
- ✅ `supabase/migrations/*.sql`
- ✅ `supabase/seed.sql`

Don't commit:
- ❌ `.env.local`
- ❌ `supabase/.temp/` (already in .gitignore)

## Advanced: Custom Sync Scripts

You can create custom scripts for data syncing. Example:

```bash
#!/bin/bash
# scripts/sync-from-remote.sh

# Pull schema
npm run supabase:pull

# Dump specific tables
npx supabase db dump --data-only --table users > supabase/dumps/users.sql

# Import to local
npx supabase db reset
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/dumps/users.sql
```

## Resources

- [Supabase Local Development Docs](https://supabase.com/docs/guides/local-development)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/database/migrations)
- [Local Development Best Practices](https://supabase.com/docs/guides/local-development/best-practices)

## Getting Help

- Check Supabase logs: `npx supabase logs`
- View specific service logs: `npx supabase logs db` or `npx supabase logs api`
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues
