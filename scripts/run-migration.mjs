#!/usr/bin/env node
// Usage: node scripts/run-migration.mjs <path/to/migration.sql>
// Reads DATABASE_URL from .env.local and runs the SQL file in a single connection.
// Uses @neondatabase/serverless Pool (WebSocket) for multi-statement transaction support.

import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

neonConfig.webSocketConstructor = ws

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, "..")

function loadEnvLocal() {
  const path = resolve(projectRoot, ".env.local")
  const raw = readFileSync(path, "utf8")
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

async function main() {
  const sqlPath = process.argv[2]
  if (!sqlPath) {
    console.error("Usage: node scripts/run-migration.mjs <path/to/migration.sql>")
    process.exit(1)
  }
  const absoluteSqlPath = resolve(projectRoot, sqlPath)
  const sql = readFileSync(absoluteSqlPath, "utf8")
  const env = loadEnvLocal()
  const url = env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL not found in .env.local")
    process.exit(1)
  }

  const pool = new Pool({ connectionString: url })
  const client = await pool.connect()
  try {
    const t0 = Date.now()
    await client.query(sql)
    const ms = Date.now() - t0
    console.log(`✅ Migration applied: ${sqlPath} (${ms} ms)`)
  } catch (err) {
    console.error("❌ Migration failed:", err.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
