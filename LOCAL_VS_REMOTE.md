# Local vs Remote Supabase: Which to Use?

A guide to help you choose between local and remote Supabase development.

## Quick Decision Matrix

| Scenario | Recommendation |
|----------|---------------|
| Starting a new feature | 🏠 **Local** |
| Daily development | 🏠 **Local** |
| Testing destructive changes | 🏠 **Local** |
| Team collaboration | 🏠 **Local** (with remote sync) |
| Pre-production testing | ☁️ **Remote** (staging) |
| Production deployment | ☁️ **Remote** |
| No Docker available | ☁️ **Remote** |
| Learning Supabase | 🏠 **Local** |

## Local Supabase

### ✅ Advantages

**1. Speed & Performance**
- No network latency
- Instant database operations
- Fast file uploads
- Quick iterations

**2. Cost**
- Completely free
- No bandwidth costs
- No storage costs
- Unlimited requests

**3. Development Experience**
- Work offline
- No rate limits
- Safe to experiment
- Easy reset (`npm run supabase:reset`)
- Fast debugging with local logs

**4. Data Privacy**
- All data stays on your machine
- No sensitive data in cloud during dev
- GDPR/compliance friendly

**5. Consistency**
- Same environment for all developers
- Version-controlled schema (migrations)
- Reproducible setup

### ❌ Disadvantages

**1. System Requirements**
- Requires Docker Desktop (~2-3GB)
- Uses system resources (CPU, RAM)
- Requires disk space for databases

**2. Limitations**
- No Edge Functions (use remote for this)
- No Realtime broadcasts across machines
- No production-like CDN behavior
- Local-only storage (not accessible remotely)

**3. Setup**
- Initial Docker download (~3-5 min)
- Learning curve for migrations
- Requires understanding of Docker basics

### 💡 Best For
- Feature development
- Bug fixing
- Database schema changes
- Learning Supabase
- Testing before deployment

---

## Remote Supabase

### ✅ Advantages

**1. Production-Like**
- Real CDN behavior
- Edge Functions available
- Real email delivery
- Multi-region support

**2. Collaboration**
- Shared database for team
- Real-time collaboration
- Accessible from anywhere
- No local setup needed

**3. Features**
- Full Edge Functions
- Real email delivery
- Production monitoring
- Automatic backups

**4. Hosting**
- Managed infrastructure
- Automatic scaling
- High availability
- Professional monitoring

### ❌ Disadvantages

**1. Cost**
- Free tier has limits
- Bandwidth costs
- Storage costs
- Potential upgrade needed

**2. Speed**
- Network latency
- Slower iterations
- Upload/download time

**3. Safety**
- Risk of breaking shared environment
- No easy reset
- Careful with migrations
- Impact other developers

**4. Rate Limits**
- Free tier limits
- Potential throttling
- Request quotas

### 💡 Best For
- Staging environment
- Pre-production testing
- Demo deployments
- Production hosting
- Team without Docker

---

## Recommended Workflows

### Workflow 1: Local First (Recommended)

```bash
# Daily development - 100% local
┌─────────────────────┐
│   Local Supabase    │
│  (Docker + Next.js) │
└─────────────────────┘
          │
          ↓
    Develop & Test
          │
          ↓
┌─────────────────────┐
│  Push to Remote     │
│  (When ready)       │
└─────────────────────┘
```

**Steps:**
1. Develop locally: `npm run supabase:start`
2. Create migrations: `npm run supabase:migration:new feature`
3. Test locally: `npm run supabase:reset`
4. Deploy to remote: `npm run supabase:push`

**Pros:** Fast, safe, cheap  
**Cons:** Requires Docker

### Workflow 2: Remote First

```bash
# Direct remote development
┌─────────────────────┐
│   Remote Supabase   │
│  + Local Next.js    │
└─────────────────────┘
          │
          ↓
    Develop & Test
          │
          ↓
┌─────────────────────┐
│      Deploy         │
└─────────────────────┘
```

**Steps:**
1. Update `.env.local` with remote credentials
2. Develop against remote
3. Deploy when ready

**Pros:** Simple, no Docker  
**Cons:** Slower, costs, can break shared environment

### Workflow 3: Hybrid (Team Recommended)

```bash
# Local dev + Remote staging
┌─────────────────────┐
│   Local Supabase    │
│   (Development)     │
└─────────────────────┘
          │
          ↓
    Create Migration
          │
          ↓
┌─────────────────────┐
│   Remote Supabase   │
│     (Staging)       │
└─────────────────────┘
          │
          ↓
    Test & Review
          │
          ↓
┌─────────────────────┐
│   Remote Supabase   │
│    (Production)     │
└─────────────────────┘
```

**Steps:**
1. Develop locally: `npm run supabase:start`
2. Create & test migrations locally
3. Push to staging: `npm run supabase:push`
4. Test on staging environment
5. Deploy to production

**Pros:** Safe, professional, best practices  
**Cons:** Requires multiple Supabase projects

---

## Feature Comparison

| Feature | Local | Remote |
|---------|-------|--------|
| **Database** | ✅ PostgreSQL | ✅ PostgreSQL |
| **Storage** | ✅ S3-compatible | ✅ S3 + CDN |
| **Auth** | ✅ Full | ✅ Full |
| **Realtime** | ✅ Local only | ✅ Global |
| **Edge Functions** | ❌ Not available | ✅ Available |
| **Email** | ✅ Inbucket (test) | ✅ Real emails |
| **Studio** | ✅ Local UI | ✅ Cloud UI |
| **Migrations** | ✅ File-based | ✅ File-based |
| **RLS** | ✅ Full support | ✅ Full support |
| **Cost** | 💰 Free | 💰 Free tier + paid |
| **Speed** | ⚡ Instant | 🌐 Network latency |
| **Setup** | 🛠️ Docker required | 🌐 Account required |

---

## Switching Between Local and Remote

### From Local to Remote

1. Create remote Supabase project
2. Link: `npm run supabase:link`
3. Push schema: `npm run supabase:push`
4. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Restart dev server: `npm run dev`

### From Remote to Local

1. Link to remote: `npm run supabase:link`
2. Pull schema: `npm run supabase:pull`
3. Start local: `npm run supabase:start`
4. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Reset: `npm run supabase:reset`
6. Restart dev server: `npm run dev`

---

## Cost Analysis

### Local Development

**Costs:**
- 💰 $0/month (completely free)
- Disk space: ~2-3GB for Docker images
- RAM: ~500MB-1GB when running

**Savings:**
- No bandwidth costs
- No database costs
- No storage costs
- Unlimited API requests

### Remote Development (Free Tier)

**Included:**
- 500MB database
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth/month

**Costs when exceeded:**
- Database: $0.0048/GB/hour
- Storage: $0.021/GB/month
- Bandwidth: $0.09/GB

**Example monthly cost (small team):**
- Database (2GB): ~$7/month
- Storage (5GB): ~$0.10/month
- Bandwidth (10GB): ~$0.90/month
- **Total: ~$8/month**

### Hybrid Approach

**Development:** Local (free)  
**Staging:** Remote free tier (free)  
**Production:** Remote paid (~$25/month)  
**Total:** ~$25/month

---

## Security Considerations

### Local Supabase
- ✅ No data leaves your machine during development
- ✅ Safe to use production data copies
- ✅ No accidental public exposure
- ⚠️ Shared local network access possible
- ⚠️ Docker security best practices apply

### Remote Supabase
- ✅ Professional security measures
- ✅ Automatic backups
- ✅ DDoS protection
- ⚠️ Credentials management critical
- ⚠️ RLS policies must be correct

---

## Recommendations by Project Phase

### Phase 1: Initial Development
**Use:** Local Supabase  
**Why:** Fast iterations, free, safe to experiment

### Phase 2: Team Collaboration
**Use:** Local + Remote Staging  
**Why:** Each dev has local, shared staging for integration

### Phase 3: Beta Testing
**Use:** Remote Staging  
**Why:** Real users need accessible environment

### Phase 4: Production
**Use:** Remote Production  
**Why:** Managed, scalable, reliable

---

## When to Use What

### Use Local When:
- ✅ Developing new features
- ✅ Fixing bugs
- ✅ Learning Supabase
- ✅ Creating migrations
- ✅ Testing schema changes
- ✅ Running integration tests
- ✅ Working offline
- ✅ Cost is a concern

### Use Remote When:
- ✅ Deploying to production
- ✅ Sharing with stakeholders
- ✅ Testing Edge Functions
- ✅ Testing email flows
- ✅ Multi-region testing
- ✅ Load testing
- ✅ Docker not available
- ✅ Team demo/collaboration

---

## Summary

**For Development:** 🏠 Use Local Supabase
- Faster, cheaper, safer
- Perfect for daily work
- Requires Docker

**For Production:** ☁️ Use Remote Supabase
- Managed infrastructure
- Global availability
- Professional monitoring

**Best Practice:** 🔄 Hybrid Approach
- Develop locally
- Test on remote staging
- Deploy to remote production

---

## Quick Start Commands

### Local Setup
```bash
npm run supabase:start
npm run dev
```

### Remote Setup
```bash
# Update .env.local with remote credentials
npm run dev
```

### Sync Local ↔ Remote
```bash
# Pull remote schema to local
npm run supabase:sync:from-remote

# Push local schema to remote
npm run supabase:sync:to-remote
```

---

**Recommendation:** Start with local development. It's faster, free, and safer. Move to remote when you need production features or team collaboration. 🚀
