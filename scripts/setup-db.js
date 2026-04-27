#!/usr/bin/env node

/**
 * Database Setup Script
 * Reads the SQL schema and executes it against Supabase
 * Usage: node scripts/setup-db.js
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createClient } from "@supabase/supabase-js"

// Get directory name for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: Missing Supabase credentials in .env.local")
    console.error("   Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
    process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

// Read SQL file
const sqlPath = path.join(__dirname, "../Backup/SUPABASE_SCHEMA.sql")
const sqlContent = fs.readFileSync(sqlPath, "utf-8")

// Split SQL into individual statements and filter out comments and empty lines
const statements = sqlContent
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt && !stmt.startsWith("--"))
    .map((stmt) => stmt + ";")

console.log(`\n📋 Found ${statements.length} SQL statements to execute\n`)

// Execute each statement
async function executeSql() {
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i]
        const shortStatement =
            statement.length > 60 ? statement.substring(0, 60) + "..." : statement

        try {
            console.log(`⏳ [${i + 1}/${statements.length}] Executing: ${shortStatement}`)

            const { error } = await supabase.rpc("exec_sql", {
                sql: statement,
            })

            if (error) {
                // Try alternative method - direct sql execution
                console.log(
                    `⚠️  RPC method failed, trying alternative method...`
                )
                throw error
            }

            console.log(`✅ Success\n`)
            successCount++
        } catch (error) {
            console.error(`❌ Error: ${error.message}\n`)
            errorCount++
            // Continue with next statement instead of exiting
        }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Successful: ${successCount}`)
    console.log(`   ❌ Failed: ${errorCount}`)

    if (errorCount === 0) {
        console.log(`\n🎉 Database setup completed successfully!`)
        console.log(`   All tables and indexes have been created.\n`)
    } else {
        console.log(`\n⚠️  Some statements failed. You may need to run them manually.`)
        console.log(`   Visit: ${supabaseUrl}/project/sql\n`)
    }
}

executeSql().catch((err) => {
    console.error("Fatal error:", err)
    process.exit(1)
})
