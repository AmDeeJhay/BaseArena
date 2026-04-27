# 🗄️ Database Setup Guide for Supabase

Follow these steps to create all required tables in your Supabase database.

## Step 1: Access Supabase SQL Editor

Navigate to your Supabase project's SQL editor:
- URL: `https://app.supabase.com/project/[PROJECT-ID]/sql/new`
- Your Project: https://itnqfiukvokqqpixovbe.supabase.co/project/sql/new

## Step 2: Copy the SQL Schema

Below is the complete SQL schema for SkillMint. Copy all of it:

```sql
-- Supabase Schema for SkillMint
-- Run these SQL commands in your Supabase SQL editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  profile_image VARCHAR(255),
  bio TEXT,
  skill_categories TEXT[] DEFAULT '{}',
  total_earnings DECIMAL(18, 8) DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  reward DECIMAL(18, 8) NOT NULL,
  deadline TIMESTAMP,
  requirements JSONB DEFAULT '{}',
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT NOW(),
  score INTEGER,
  feedback TEXT,
  submission_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  nft_token_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Badges (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Arena Posts table
CREATE TABLE IF NOT EXISTS arena_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_address VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  signature TEXT,
  content_hash VARCHAR(255),
  tx_hash VARCHAR(255),
  challenge_title VARCHAR(255),
  earned_amount VARCHAR(50),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Arena Comments table
CREATE TABLE IF NOT EXISTS arena_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES arena_posts(id) ON DELETE CASCADE,
  author_address VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  signature TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Arena Likes table (for tracking who liked what)
CREATE TABLE IF NOT EXISTS arena_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES arena_posts(id) ON DELETE CASCADE,
  user_address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_address)
);

-- Activities table (for tracking user activities)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE SET NULL,
  description TEXT,
  reward VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_challenges_creator ON challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_arena_posts_author ON arena_posts(author_address);
CREATE INDEX IF NOT EXISTS idx_arena_posts_created ON arena_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);

-- Enable RLS (Row Level Security) - optional, for additional security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Arena Posts
CREATE POLICY "Enable all operations for arena_posts" ON arena_posts FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for Arena Comments
CREATE POLICY "Enable all operations for arena_comments" ON arena_comments FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for Arena Likes
CREATE POLICY "Enable all operations for arena_likes" ON arena_likes FOR ALL USING (true) WITH CHECK (true);
```

## Step 3: Paste into Supabase

1. Go to Supabase SQL Editor
2. Click on "New Query" or create a new SQL query
3. Paste all the SQL code above
4. Click the **"Run"** button (or press `Ctrl+Enter`)

## Step 4: Verify Tables Created

After running the SQL:
- ✅ Check the "Tables" section in Supabase dashboard
- ✅ You should see all 9 tables listed
- ✅ Tables: `users`, `challenges`, `submissions`, `badges`, `user_badges`, `arena_posts`, `arena_comments`, `arena_likes`, `activities`

## Step 5: Confirm Backend Integration

The app is already configured to use these tables via:
- `lib/supabase.ts` - Supabase client initialization  
- `lib/supabase-service.ts` - Database operations layer
- `services/*.ts` - Frontend service wrappers

No additional configuration needed!

## Troubleshooting

**If tables already exist:**
- The SQL contains `CREATE TABLE IF NOT EXISTS` - it's safe to run again
- Existing tables won't be overwritten

**If you get permission errors:**
- Make sure you're using the correct Supabase account
- Check that you're connected to the correct project
- Verify in `.env.local` that `NEXT_PUBLIC_SUPABASE_URL` matches your project

**If indexes fail to create:**
- This is usually not critical
- Tables will still work fine
- Indexes are optional (but recommended for performance)

## Next Steps

1. ✅ Database tables are now created
2. 🧪 Start the dev server: `pnpm dev`
3. 🔗 Connect your wallet in the app
4. 📊 Navigate to the dashboard to see data loading

## Testing Data (Optional)

To add sample data for testing, you can manually insert records via the Supabase dashboard:

**Sample User:**
```sql
INSERT INTO users (wallet_address, username, email, bio, reputation)
VALUES (
  '0x1234567890abcdef1234567890abcdef12345678',
  'testuser',
  'test@skillmint.dev',
  'Test user for development',
  100
);
```

**Sample Challenge:**
```sql
INSERT INTO challenges (title, description, category, difficulty, reward, creator_id, status)
SELECT 'Build a Web3 App', 'Create a simple dApp', 'Blockchain', 'Intermediate', 0.5, id, 'active'
FROM users WHERE username = 'testuser' LIMIT 1;
```

## Support

For more information:
- 📖 Supabase Docs: https://supabase.com/docs
- 🔗 Project URL: https://itnqfiukvokqqpixovbe.supabase.co
- 💬 Supabase Community: https://discord.supabase.com
