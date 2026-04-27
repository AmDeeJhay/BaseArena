# Supabase Migration Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project:
   - Project name: `skillmint`
   - Database password: (create secure password)
   - Region: Select closest to your location
   - Pricing: Free tier is fine for development

## Step 2: Get Your Credentials

1. In Supabase dashboard, go to Project Settings → API
2. Copy these values:
   - **Project URL** (your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 3: Create Database Schema

1. In Supabase, go to SQL Editor
2. Create a new query
3. Copy all SQL from `Backup/SUPABASE_SCHEMA.sql`
4. Run the query
5. Wait for completion

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Install Supabase Package

The frontend needs the Supabase client library. Add it to package.json:

```bash
npm install @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

## Step 6: Seed Sample Data (Optional)

Run this SQL in Supabase to add sample data:

```sql
-- Insert sample user
INSERT INTO users (wallet_address, username, email, profile_image, bio, skill_categories, total_earnings, reputation)
VALUES 
('0x742d35Cc6634C0532925a3b844Bc973e7DFb5E26', 'skillminter', 'user@skillmint.com', '/placeholder.svg', 'Blockchain developer', '{"Frontend", "Blockchain"}', 2450.75, 95);

-- Insert sample challenges
INSERT INTO challenges (title, description, category, difficulty, reward, creator_id, status)
SELECT 
  'Build a Smart Contract',
  'Create a basic ERC20 token contract',
  'blockchain',
  'beginner',
  0.1,
  id,
  'active'
FROM users WHERE username = 'skillminter'
LIMIT 1;

-- Insert sample badges
INSERT INTO badges (name, description, image_url)
VALUES 
('Blockchain Pioneer', 'Complete your first blockchain challenge', '/placeholder.svg'),
('Smart Contract Master', 'Deploy 5 successful smart contracts', '/placeholder.svg'),
('Web3 Expert', 'Complete advanced Web3 challenges', '/placeholder.svg');
```

## Step 7: Test the Connection

1. Start your dev server: `npm run dev`
2. Navigate to `/dashboard`
3. Connect your wallet
4. You should see data loading from Supabase

## Troubleshooting

**"Missing Supabase environment variables"**
- Check that `.env.local` is created with correct values
- Restart dev server after adding env vars

**"Network error" when fetching data**
- Verify Supabase project is active
- Check credentials in `.env.local`
- Make sure database schema is created

**"CORS errors"**
- Go to Supabase Project Settings → API
- Under "CORS", add your frontend URL (e.g., `http://localhost:3000`)

## API Endpoints Overview

The frontend now uses these services directly from Supabase:

- **Users**: `lib/supabase-service.ts` → `userService`
- **Challenges**: `lib/supabase-service.ts` → `challengeService`
- **Submissions**: `lib/supabase-service.ts` → `submissionService`
- **Badges**: `lib/supabase-service.ts` → `badgeService`
- **Arena Posts**: `lib/supabase-service.ts` → `arenaService`
- **Activities**: `lib/supabase-service.ts` → `activityService`

Each service is integrated into the corresponding service layer in `services/` folder.

## Next Steps

1. Customize tables based on your specific requirements
2. Set up Row Level Security (RLS) policies if needed
3. Configure webhooks for real-time updates
4. Set up authentication with Supabase Auth (if needed)
