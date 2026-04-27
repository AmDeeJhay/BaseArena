#!/usr/bin/env node

/**
 * Database Setup Script for Supabase
 * This script executes the SQL schema against Supabase PostgreSQL database
 * 
 * Usage: node scripts/setup-db.js
 * 
 * Note: Requires environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - DATABASE_PASSWORD (for direct connection) or admin API key
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Error: Missing Supabase credentials in .env.local")
    console.error("   Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
    process.exit(1)
}

// Extract project ID from Supabase URL
const projectId = supabaseUrl.split("//")[1].split(".")[0]
console.log(`\n🔧 Setting up database for project: ${projectId}`)
console.log(`📍 Supabase URL: ${supabaseUrl}\n`)

// Read SQL file
const sqlPath = path.join(__dirname, "../Backup/SUPABASE_SCHEMA.sql")
if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Error: SQL schema file not found at ${sqlPath}`)
    process.exit(1)
}

const sqlContent = fs.readFileSync(sqlPath, "utf-8")

console.log(`📋 SQL Schema Loaded\n`)
console.log(`═══════════════════════════════════════════════════════════════`)
console.log(`\n📝 Instructions to create tables in Supabase:\n`)
console.log(`1. Go to: ${supabaseUrl}/project/sql/new`)
console.log(`\n2. Copy and paste the following SQL into the editor:\n`)
console.log(`═══════════════════════════════════════════════════════════════\n`)
console.log(sqlContent)
console.log(`\n═══════════════════════════════════════════════════════════════`)
console.log(`\n3. Click "Run" button to execute\n`)
console.log(`4. If successful, all tables will be created\n`)

// Save SQL to a file for easy copying
const outputPath = path.join(__dirname, "../SETUP_SQL.sql")
fs.writeFileSync(outputPath, sqlContent)
console.log(`💾 SQL saved to: SETUP_SQL.sql\n`)
console.log(`   You can paste this file directly into Supabase SQL editor\n`)

console.log(`═══════════════════════════════════════════════════════════════\n`)
console.log(`⚡ Attempting automated setup via REST API...\n`)

// Try alternative: Use Supabase REST API with direct SQL execution
// This requires a service role key, which we'll try to use via the auth token

async function setupDatabase() {
    try {
        // Try to use Supabase Edge Functions or REST API
        const dbSetupUrl = `${supabaseUrl}/rest/v1/rpc/exec_sql`

        console.log(`⏳ Checking if direct SQL execution is available...`)

        const response = await fetch(dbSetupUrl, {
            method: "OPTIONS",
        })

        if (response.status === 404) {
            console.log(`ℹ️  Direct rpc method not available (this is normal)`)
            console.log(`   Please use the manual method above\n`)
            return false
        }

        console.log(`✅ RPC method is available, attempting to execute SQL...`)

        // Split SQL into individual statements
        const statements = sqlContent
            .split(";")
            .map((stmt) => stmt.trim())
            .filter((stmt) => stmt && !stmt.startsWith("--"))
            .map((stmt) => stmt + ";")

        console.log(`\n📊 Found ${statements.length} SQL statements\n`)

        let successCount = 0
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i]
            const shortStmt = stmt.length > 50 ? stmt.substring(0, 50) + "..." : stmt

            process.stdout.write(`[${i + 1}/${statements.length}] ${shortStmt}... `)

            try {
                const res = await fetch(dbSetupUrl, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${supabaseAnonKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ sql: stmt }),
                })

                if (res.ok) {
                    console.log(`✅`)
                    successCount++
                } else {
                    console.log(`⚠️  (${res.status})`)
                }
            } catch (err) {
                console.log(`❌`)
            }
        }

        console.log(`\n📊 Results: ${successCount}/${statements.length} executed`)
        return successCount === statements.length
    } catch (error) {
        console.log(`\n⚠️  Automated setup not available\n`)
        return false
    }
}

setupDatabase().then((success) => {
    if (!success) {
        console.log(`\n🔗 Alternative: Use Supabase CLI\n`)
        console.log(`   npm install -g supabase`)
        console.log(`   supabase login`)
        console.log(`   supabase db push`)
        console.log(`\n`)
    }
})
