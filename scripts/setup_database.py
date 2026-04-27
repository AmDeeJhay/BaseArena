#!/usr/bin/env python3
"""
Database Setup Script for Supabase
Executes SQL schema to create all required tables
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env.local
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Missing Supabase credentials in .env.local")
    print("   Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
    sys.exit(1)

# Read SQL file
sql_path = Path(__file__).parent.parent / "Backup" / "SUPABASE_SCHEMA.sql"
if not sql_path.exists():
    print(f"❌ Error: SQL schema file not found at {sql_path}")
    sys.exit(1)

with open(sql_path, "r") as f:
    sql_content = f.read()

print("\n" + "="*70)
print("🗄️  SUPABASE DATABASE SETUP")
print("="*70)
print(f"\n📍 Project: {SUPABASE_URL}")
print(f"📋 Schema file: {sql_path.name}\n")

# Parse SQL statements
statements = [
    s.strip() + ";"
    for s in sql_content.split(";")
    if s.strip() and not s.strip().startswith("--")
]

print(f"📊 Found {len(statements)} SQL statements\n")
print("="*70)
print("\n✅ SETUP INSTRUCTIONS:\n")
print("Option 1: Automated Setup (if via API available)")
print("---")

try:
    import requests
    
    headers = {
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    
    # Try to check if rpc function exists
    print("⏳ Checking Supabase connection...")
    
    # Try direct SQL execution via REST
    success_count = 0
    failed_count = 0
    
    for i, statement in enumerate(statements, 1):
        stmt_short = statement[:60] + "..." if len(statement) > 60 else statement
        print(f"[{i:2d}/{len(statements)}] {stmt_short:<70}", end=" ")
        
        try:
            # Try using Supabase REST API for SQL execution
            # Note: This requires specific setup and may not work with anon key
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
                json={"sql": statement},
                headers=headers,
                timeout=10,
            )
            
            if response.status_code in [200, 201]:
                print("✅")
                success_count += 1
            else:
                print(f"⚠️  ({response.status_code})")
                failed_count += 1
        except Exception as e:
            print("❌")
            failed_count += 1
    
    print(f"\n📊 Results: {success_count} succeeded, {failed_count} failed\n")
    
    if failed_count == 0:
        print("🎉 Database setup completed successfully!")
        sys.exit(0)
    
except ImportError:
    print("⚠️  requests library not installed\n")
except Exception as e:
    print(f"⚠️  Automated setup failed: {e}\n")

# Fallback: Manual setup instructions
print("\n" + "="*70)
print("Option 2: Manual Setup (via Supabase Dashboard)")
print("="*70)
print("\n📝 Steps:\n")
print("1. Go to: https://app.supabase.com")
print("2. Select your project")
print("3. Go to SQL Editor → New Query")
print("4. Copy and paste the entire SQL schema below:")
print("\n" + "-"*70)
print(sql_content)
print("-"*70)
print("\n5. Click 'Run' to execute")
print("\n✅ Tables will be created automatically\n")

# Save to file for easy copying
output_path = Path(__file__).parent.parent / "DATABASE_SCHEMA.sql"
with open(output_path, "w") as f:
    f.write(sql_content)

print(f"💾 SQL schema saved to: DATABASE_SCHEMA.sql")
print(f"   You can open this file and copy its contents into Supabase\n")
print("="*70 + "\n")
