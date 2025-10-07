# Troubleshooting Guide

Common issues and solutions when working with local Supabase development.

## Table of Contents
- [Docker Issues](#docker-issues)
- [Port Conflicts](#port-conflicts)
- [Database Connection](#database-connection)
- [Migration Problems](#migration-problems)
- [Storage Issues](#storage-issues)
- [Environment Variables](#environment-variables)
- [Build/Runtime Errors](#buildruntime-errors)

---

## Docker Issues

### ❌ "Cannot connect to Docker daemon"

**Symptoms:**
```
Cannot connect to the Docker daemon. Is the docker daemon running?
```

**Solution:**
1. Ensure Docker Desktop is running
2. Check Docker status:
   ```bash
   docker ps
   ```
3. If not running, start Docker Desktop
4. Try again:
   ```bash
   npm run supabase:start
   ```

### ❌ "Docker daemon is not accessible"

**Solution:**
```bash
# macOS/Linux - ensure user has Docker permissions
sudo usermod -aG docker $USER
newgrp docker

# Then restart Docker Desktop and try again
```

### ❌ Supabase containers keep restarting

**Solution:**
```bash
# Check container logs
docker logs supabase_db_gpt.social
docker logs supabase_kong_gpt.social

# Clean restart
npm run supabase:stop
docker system prune -f
npm run supabase:start
```

---

## Port Conflicts

### ❌ "Port 54321 already in use"

**Symptoms:**
```
Error: Port 54321 is already allocated
```

**Solution 1 - Stop conflicting service:**
```bash
# Find process using port
lsof -ti:54321
# or
netstat -tuln | grep 54321

# Kill the process
kill -9 <PID>
```

**Solution 2 - Change Supabase ports:**

Edit `supabase/config.toml`:
```toml
[api]
port = 54421  # Changed from 54321

[db]
port = 54422  # Changed from 54322

[studio]
port = 54423  # Changed from 54323

[inbucket]
port = 54424  # Changed from 54324
```

Then update `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54421
```

---

## Database Connection

### ❌ "Could not connect to database"

**Symptoms:**
```
Error: Connection refused
FATAL: password authentication failed
```

**Solution:**
```bash
# 1. Check if Supabase is running
npm run supabase:status

# 2. If not running, start it
npm run supabase:start

# 3. Verify connection string
# Default: postgresql://postgres:postgres@127.0.0.1:54322/postgres

# 4. Test connection
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

### ❌ "Database does not exist"

**Solution:**
```bash
# Reset database
npm run supabase:reset

# If that fails, full restart
npm run supabase:stop
npx supabase db reset --force
npm run supabase:start
```

---

## Migration Problems

### ❌ "Migration failed to apply"

**Symptoms:**
```
Error applying migration: relation already exists
Error: duplicate key value violates unique constraint
```

**Solution 1 - Make migration idempotent:**
```sql
-- Bad
CREATE TABLE posts (...);

-- Good
CREATE TABLE IF NOT EXISTS posts (...);

-- Bad
INSERT INTO storage.buckets (id, name) VALUES ('videos', 'videos');

-- Good
INSERT INTO storage.buckets (id, name)
VALUES ('videos', 'videos')
ON CONFLICT (id) DO NOTHING;
```

**Solution 2 - Reset and reapply:**
```bash
# Reset will drop and recreate database
npm run supabase:reset
```

### ❌ "Migration order is wrong"

**Symptoms:**
```
Error: relation does not exist
Error: column "xyz" does not exist
```

**Solution:**
Migration files are applied in alphabetical order. Ensure proper naming:
```
20250101000000_initial_setup.sql       # Applied first
20250102000000_add_posts_table.sql     # Applied second
20250103000000_add_posts_column.sql    # Applied third
```

To fix:
```bash
# Rename migration file
mv supabase/migrations/bad_name.sql supabase/migrations/20250104000000_correct_name.sql

# Reset to reapply in correct order
npm run supabase:reset
```

### ❌ "Schema drift detected"

**Symptoms:**
```
Error: Your local schema differs from the remote
```

**Solution:**
```bash
# Option 1: Pull remote schema
npm run supabase:pull

# Option 2: Push local schema (careful!)
npm run supabase:push

# Option 3: Check differences
npx supabase db diff
```

---

## Storage Issues

### ❌ "Storage bucket not found"

**Symptoms:**
```
Error: Bucket 'videos' does not exist
```

**Solution:**
```bash
# Run initial migration
npm run supabase:reset

# Or create bucket manually in Supabase Studio
# http://127.0.0.1:54323 → Storage → Create bucket
```

### ❌ "Permission denied when uploading"

**Symptoms:**
```
Error: new row violates row-level security policy
```

**Solution:**
Check RLS policies are applied:

```sql
-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- If missing, run migration again
```

Or check in Studio:
1. Go to http://127.0.0.1:54323
2. Storage → videos → Policies
3. Ensure upload/download policies exist

### ❌ "File upload fails silently"

**Solution:**
```bash
# Check Storage logs
npx supabase logs storage

# Check API logs
npx supabase logs api

# Common issue: CORS
# Storage bucket should be public for local dev
```

---

## Environment Variables

### ❌ "Supabase URL and Anon Key must be configured"

**Symptoms:**
```
Error: Supabase URL and Anon Key must be configured
```

**Solution:**
```bash
# Ensure .env.local exists
cd frontend
ls -la .env.local

# If missing, copy from example
cp .env.example .env.local

# Verify contents
cat .env.local

# Should have:
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ❌ "Environment variables not loading"

**Solution:**
```bash
# Restart dev server
# Ctrl+C to stop
npm run dev

# For Next.js, env changes require restart
```

### ❌ "Using wrong Supabase instance"

**Check which instance you're connected to:**
```bash
# Local Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321

# Remote Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
```

**Switch instances:**
```bash
# Edit .env.local
nano frontend/.env.local

# Update URL and Key
# Restart dev server
npm run dev
```

---

## Build/Runtime Errors

### ❌ "Module not found: Can't resolve '@supabase/ssr'"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or specifically install Supabase
npm install @supabase/ssr @supabase/supabase-js
```

### ❌ "fetch failed" during authentication

**Solution:**
```bash
# Check Supabase is running
npm run supabase:status

# Check network
curl http://127.0.0.1:54321/rest/v1/

# Should return Supabase info
```

### ❌ Next.js build fails

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

---

## Common Task Solutions

### How to completely reset everything

```bash
# Stop Supabase
npm run supabase:stop

# Remove all Docker volumes (WARNING: deletes all data)
docker volume ls | grep supabase | awk '{print $2}' | xargs docker volume rm

# Start fresh
npm run supabase:start

# Reinitialize
npm run supabase:reset
```

### How to view logs

```bash
# All logs
npx supabase logs

# Specific service
npx supabase logs db
npx supabase logs api
npx supabase logs storage
npx supabase logs auth
```

### How to access local database

```bash
# Using psql
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Using Supabase Studio
open http://127.0.0.1:54323

# Using command line
npx supabase db shell
```

### How to dump/restore data

```bash
# Dump data
npx supabase db dump --data-only > backup.sql

# Restore data
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f backup.sql
```

---

## Getting Help

If none of these solutions work:

1. **Check Supabase logs:**
   ```bash
   npx supabase logs
   ```

2. **Check Docker logs:**
   ```bash
   docker logs supabase_db_gpt.social
   ```

3. **Create issue:**
   - Include error message
   - Include steps to reproduce
   - Include logs output
   - Include OS and versions

4. **Community support:**
   - [Supabase Discord](https://discord.supabase.com)
   - [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

## Quick Reference

### Essential Commands
```bash
# Start/Stop
npm run supabase:start
npm run supabase:stop
npm run supabase:status

# Reset
npm run supabase:reset

# Logs
npx supabase logs
npx supabase logs <service>

# Database
npx supabase db shell
npx supabase db reset

# Migrations
npm run supabase:migration:new <name>
npm run supabase:pull
npm run supabase:push
```

### Default Ports
- API: 54321
- DB: 54322
- Studio: 54323
- Inbucket: 54324

### Default Credentials
- DB User: `postgres`
- DB Password: `postgres`
- DB Name: `postgres`
- Anon Key: (standard Supabase demo key in .env.example)
