# Supabase Sync Scripts

Utility scripts for syncing data and schema between remote and local Supabase instances.

## Available Scripts

### `sync-from-remote.sh`

Pulls schema and optionally data from remote Supabase to local.

**Usage:**
```bash
npm run supabase:sync:from-remote
```

**What it does:**
1. Pulls schema changes from remote (generates migrations)
2. Optionally dumps data from specific tables
3. Provides instructions for applying changes locally

**Prerequisites:**
- Must be linked to remote: `npm run supabase:link`
- Local Supabase must be running: `npm run supabase:start`

### `sync-to-remote.sh`

Pushes local migrations to remote Supabase.

**Usage:**
```bash
npm run supabase:sync:to-remote
```

**What it does:**
1. Shows pending migrations
2. Confirms before pushing
3. Applies local migrations to remote database

**⚠️ Warning:** This modifies your remote database. Use with caution!

## Typical Workflow

### Initial Setup
```bash
# Link to remote project
npm run supabase:link

# Pull existing schema from remote
npm run supabase:sync:from-remote

# Apply to local
npm run supabase:reset
```

### Development Workflow
```bash
# 1. Start local Supabase
npm run supabase:start

# 2. Make schema changes locally
npm run supabase:migration:new my_change

# 3. Edit the migration file
# supabase/migrations/XXXXXX_my_change.sql

# 4. Test locally
npm run supabase:reset
npm run dev

# 5. Push to remote when ready
npm run supabase:sync:to-remote
```

### Team Sync
```bash
# Pull latest schema from remote
npm run supabase:sync:from-remote

# Apply to local
npm run supabase:reset
```

## Customization

You can modify these scripts to:
- Add more tables to sync
- Customize dump options
- Add pre/post sync hooks
- Automate testing

Example: Add a custom table to sync in `sync-from-remote.sh`:
```bash
# Dump your custom table
npx supabase db dump --data-only --table public.my_table > supabase/dumps/my_table.sql
```
