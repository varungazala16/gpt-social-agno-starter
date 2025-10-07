#!/bin/bash

# Sync schema and data from remote Supabase to local

set -e

echo "🔄 Syncing from Remote Supabase to Local..."
echo ""

# Check if linked
if [ ! -f .supabase/config.toml ]; then
    echo "❌ Not linked to remote Supabase project."
    echo "Run: npm run supabase:link"
    exit 1
fi

# Pull schema changes
echo "📥 Pulling schema changes..."
npx supabase db pull

# Optional: Dump data from specific tables
read -p "Do you want to dump data from remote? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Dumping data from remote..."
    
    # Create dumps directory
    mkdir -p supabase/dumps
    
    # Dump auth.users metadata (not passwords, those are hashed)
    echo "  - Dumping user metadata..."
    npx supabase db dump --data-only --table auth.users > supabase/dumps/users.sql || true
    
    # You can add more tables here
    # npx supabase db dump --data-only --table public.posts > supabase/dumps/posts.sql || true
    
    echo "✅ Data dumped to supabase/dumps/"
    echo ""
    echo "📝 To apply dumps to local:"
    echo "   1. Reset local db: npm run supabase:reset"
    echo "   2. Apply dumps: psql 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' -f supabase/dumps/users.sql"
fi

echo ""
echo "✅ Schema sync complete!"
echo ""
echo "Next steps:"
echo "  - Review migrations in supabase/migrations/"
echo "  - Apply to local: npm run supabase:reset"
echo "  - Test locally: npm run dev"
echo "  - Push to remote: npm run supabase:push (if needed)"
