#!/bin/bash

# SkillMint Supabase Migration Complete Setup Script
# This script automates the installation of @supabase/supabase-js

echo "🚀 Starting SkillMint Supabase Migration Setup..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm is not installed. Installing with npm..."
    npm install -g pnpm
fi

echo "📦 Installing Supabase package..."
pnpm add @supabase/supabase-js

echo ""
echo "✅ Package installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create a .env.local file in the project root"
echo "2. Add your Supabase credentials:"
echo "   NEXT_PUBLIC_SUPABASE_URL=your_project_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
echo ""
echo "3. Go to your Supabase dashboard (https://supabase.com)"
echo "4. Create the database schema by running the SQL from: Backup/SUPABASE_SCHEMA.sql"
echo ""
echo "5. Start your development server:"
echo "   pnpm dev"
echo ""
echo "📚 For detailed setup instructions, see: Backup/SETUP_GUIDE.md"
