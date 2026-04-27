-- Supabase Schema for SkillMint
-- Run these SQL commands in your Supabase SQL editor
-- URL: https://itnqfiukvokqqpixovbe.supabase.co/project/sql/new

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
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  signature TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Arena Likes table (for tracking who liked what)
CREATE TABLE IF NOT EXISTS arena_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES arena_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
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
CREATE INDEX IF NOT EXISTS idx_arena_posts_author ON arena_posts(author_id);
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
