#!/bin/bash

# Sync local changes to remote Supabase

set -e

echo "🚀 Pushing local changes to Remote Supabase..."
echo ""

# Check if linked
if [ ! -f .supabase/config.toml ]; then
    echo "❌ Not linked to remote Supabase project."
    echo "Run: npm run supabase:link"
    exit 1
fi

# Show what will be pushed
echo "📋 Checking for migrations to push..."
npx supabase db diff

echo ""
read -p "⚠️  This will modify your remote database. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 0
fi

# Push migrations
echo "📤 Pushing migrations to remote..."
npx supabase db push

echo ""
echo "✅ Push complete!"
echo ""
echo "🔍 Verify changes:"
echo "  - Check your Supabase dashboard"
echo "  - Test your remote app"
