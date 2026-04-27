# Supabase Backend Migration - Complete Guide

## 🎯 Overview

Your SkillMint frontend has been successfully migrated from the external Render backend to a Supabase backend. This provides:

- ✅ Real-time database capabilities
- ✅ Built-in authentication (ready for future use)
- ✅ Row-level security (RLS) support
- ✅ Simplified backend management
- ✅ Automatic scaling
- ✅ Better data persistence

## 📁 Files Created/Modified

### New Files
- `lib/supabase.ts` - Supabase client configuration
- `lib/supabase-service.ts` - Core data service layer with all CRUD operations
- `Backup/SUPABASE_SCHEMA.sql` - Database schema (run this in Supabase)
- `Backup/SETUP_GUIDE.md` - Detailed setup instructions
- `.env.local.example` - Environment variables template

### Modified Services
- `services/userService.ts` - Uses Supabase userService
- `services/challengeService.ts` - Uses Supabase challengeService
- `services/submissionService.ts` - Uses Supabase submissionService
- `services/badgeService.ts` - Uses Supabase badgeService
- `services/arenaService.ts` - Uses Supabase arenaService
- `services/activityService.ts` - Uses Supabase activityService
- `services/leaderboardService.ts` - Uses Supabase with computed rankings
- `services/dashboardService.ts` - Aggregates data from Supabase

### Backup Folder
- `Backup/` - Contains all old API routes (not in use anymore)

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Supabase Project
1. Visit [https://supabase.com](https://supabase.com)
2. Sign up/login
3. Create new project named `skillmint`
4. Save your credentials

### Step 2: Setup Environment Variables
Create `.env.local` in project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_BASESCAN_API_KEY=ED8AX6PF43T94CCE8NFCMA3RACU816J45D
```

### Step 3: Create Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Create new query
3. Copy entire content from `Backup/SUPABASE_SCHEMA.sql`
4. Execute

### Step 4: Install Package
```bash
pnpm add @supabase/supabase-js
# or npm install @supabase/supabase-js
```

### Step 5: Start Development Server
```bash
pnpm dev
```

## 📊 Database Schema

### Tables Created

**users**
- id (UUID, PK)
- wallet_address (VARCHAR, UNIQUE)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- profile_image (VARCHAR)
- bio (TEXT)
- skill_categories (TEXT[])
- total_earnings (DECIMAL)
- reputation (INTEGER)
- created_at, updated_at (TIMESTAMP)

**challenges**
- id (UUID, PK)
- title, description (VARCHAR, TEXT)
- category, difficulty (VARCHAR)
- reward (DECIMAL)
- deadline (TIMESTAMP)
- requirements (JSONB)
- creator_id (FK → users)
- status (VARCHAR)
- created_at, updated_at (TIMESTAMP)

**submissions**
- id (UUID, PK)
- challenge_id (FK → challenges)
- user_id (FK → users)
- status (VARCHAR)
- submitted_at (TIMESTAMP)
- score (INTEGER)
- feedback (TEXT)
- submission_url (VARCHAR)
- created_at, updated_at (TIMESTAMP)

**badges**
- id (UUID, PK)
- name (VARCHAR)
- description (TEXT)
- image_url (VARCHAR)
- nft_token_id (VARCHAR)
- created_at (TIMESTAMP)

**user_badges** (Many-to-Many)
- id (UUID, PK)
- user_id (FK → users)
- badge_id (FK → badges)
- earned_at (TIMESTAMP)

**arena_posts**
- id (UUID, PK)
- author_id (FK → users)
- content (TEXT)
- type (VARCHAR) - 'general', 'achievement', 'earning'
- signature, content_hash, tx_hash (VARCHAR)
- challenge_title, earned_amount (VARCHAR)
- likes_count (INTEGER)
- created_at, updated_at (TIMESTAMP)

**arena_comments**
- id (UUID, PK)
- post_id (FK → arena_posts)
- author_id (FK → users)
- content (TEXT)
- signature (VARCHAR)
- created_at (TIMESTAMP)

**arena_likes**
- id (UUID, PK)
- post_id (FK → arena_posts)
- user_id (FK → users)
- created_at (TIMESTAMP)

**activities**
- id (UUID, PK)
- user_id (FK → users)
- type (VARCHAR)
- challenge_id, badge_id (UUID, FK)
- description (TEXT)
- reward (VARCHAR)
- metadata (JSONB)
- created_at (TIMESTAMP)

## 🔧 Service Layer Architecture

The new architecture uses a two-layer approach:

```
Frontend Components
        ↓
services/(userService, challengeService, etc.)
        ↓
lib/supabase-service.ts (Core Supabase operations)
        ↓
lib/supabase.ts (Supabase client)
        ↓
Supabase Database
```

Each service in `services/` wraps the Supabase operations with error handling and response formatting to maintain compatibility with existing components.

## 📝 Service Methods Reference

### User Service
```typescript
userService.createUser(data)
userService.getUserById(id)
userService.getUserByWallet(walletAddress)
userService.getAllUsers()
userService.updateUser(id, data)
userService.deleteUser(id)
```

### Challenge Service
```typescript
challengeService.getAllChallenges()
challengeService.getChallengeById(id)
challengeService.fetchChallenges()
challengeService.fetchSingleChallenge(id)
challengeService.createChallenge(data)
challengeService.updateChallenge(id, data)
challengeService.deleteChallenge(id)
```

### Submission Service
```typescript
submissionService.createSubmission(data)
submissionService.getSubmissionById(id)
submissionService.getSubmissionsByChallenge(challengeId)
submissionService.getSubmissionsByUser(userId)
submissionService.updateSubmission(id, data)
submissionService.deleteSubmission(id)
```

### Badge Service
```typescript
badgeService.createBadge(data)
badgeService.getAllBadges()
badgeService.getBadgeById(id)
badgeService.getUserBadges(userId)
badgeService.awardBadge(userId, badgeId)
badgeService.deleteBadge(id)
```

### Arena Service
```typescript
arenaService.createPost(payload)
arenaService.fetchPosts(page, limit)
arenaService.addComment(postId, content, authorAddress, signature)
arenaService.likePost(postId, address, signature)
arenaService.deletePost(postId, address, signature)
```

### Activity Service
```typescript
activityService.logActivity(data)
activityService.getUserActivities(userId, limit)
activityService.getRecentActivities(limit)
```

### Leaderboard Service
```typescript
leaderboardService.fetchLeaderboard(filters)
```

## 🔒 Security Considerations

### Currently Enabled
- ✅ RLS (Row Level Security) tables created
- ✅ Indexed queries for performance
- ✅ Transaction support ready

### To Implement (Optional)
1. **RLS Policies** - Restrict data access by user
2. **Supabase Auth** - For JWT-based authentication
3. **Webhook** - For real-time event processing
4. **API Rate Limiting** - In Supabase settings

Example RLS Policy (to add later):
```sql
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

## 🧪 Testing Your Setup

### Test 1: Check Connection
```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase.from('users').select('count()', { count: 'exact' })
console.log('Connected:', !error, 'Users count:', data)
```

### Test 2: Create a User
```typescript
import { userService } from '@/lib/supabase-service'

const user = await userService.createUser({
  wallet_address: '0x123abc',
  username: 'testuser',
  email: 'test@skillmint.com'
})
```

### Test 3: Fetch from Dashboard
Navigate to `/dashboard`, connect wallet, should see data loading

## 📊 Sample Data Seeding

Run this SQL in Supabase to add sample data:

```sql
-- Create sample user
INSERT INTO users (wallet_address, username, email, bio, total_earnings, reputation)
VALUES ('0x742d35Cc6634C0532925a3b844Bc973e7DFb5E26', 'skillminter', 'user@skillmint.com', 'Web3 Developer', 2450.75, 95);

-- Create sample challenges (replace user_id with actual UUID from above)
INSERT INTO challenges (title, description, category, difficulty, reward, creator_id, status)
SELECT 
  'Build a Smart Contract',
  'Create a basic ERC20 token contract',
  'blockchain',
  'beginner',
  0.1,
  id,
  'active'
FROM users WHERE username = 'skillminter' LIMIT 1;

-- Create badges
INSERT INTO badges (name, description)
VALUES 
('Frontend Master', 'Complete 5 frontend challenges'),
('Blockchain Pioneer', 'First blockchain challenge complete'),
('Web3 Expert', 'Complete advanced Web3 challenges');
```

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- [ ] Create `.env.local` file
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Restart dev server

### Error: "Network error"
- [ ] Check internet connection
- [ ] Verify Supabase project is active
- [ ] Check credentials in `.env.local`
- [ ] Ensure schema was created

### Data not loading
- [ ] Run schema SQL in Supabase
- [ ] Check browser console for errors
- [ ] Verify user exists in database
- [ ] Check RLS policies if enabled

### CORS errors
- [ ] Go to Supabase Project Settings → API
- [ ] Add your frontend URL to CORS whitelist
- [ ] For dev: add `http://localhost:3000`

## 🚀 Next Steps

1. **Seed Sample Data** - Run SQL from "Sample Data Seeding" section
2. **Test All Endpoints** - Verify each service works
3. **Enable RLS** - Add security policies
4. **Setup Backups** - Configure Supabase backups
5. **Monitor Performance** - Use Supabase analytics
6. **Deploy** - When ready, deploy to production

## 📚 Documentation Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

## 💡 Pro Tips

1. **Use Supabase Studio** - Great UI for managing data in browser
2. **Enable Realtime** - Instantly sync data across tabs
3. **Use Webhooks** - Trigger functions on database changes
4. **Setup Monitoring** - Track slow queries in Supabase
5. **Version Control** - Keep migrations in git

## ❓ Questions?

If you encounter issues:
1. Check browser console for error messages
2. Review `Backup/SETUP_GUIDE.md` for detailed instructions
3. Check Supabase documentation at supabase.com/docs
4. Review the service implementation in `lib/supabase-service.ts`

---

**Migration Date**: April 26, 2026  
**Status**: ✅ Complete  
**Old Backend**: Moved to `Backup/` folder
