#!/usr/bin/env node
// Seeds a test caller (caller_test / test1234) for smoke testing.
// Idempotent: skips if username already exists.
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, "..")

function loadEnvLocal() {
  const raw = readFileSync(resolve(projectRoot, ".env.local"), "utf8")
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    let v = t.slice(eq + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    env[t.slice(0, eq).trim()] = v
  }
  return env
}

const env = loadEnvLocal()
const sql = neon(env.DATABASE_URL)

const USERNAME = "caller_test"
const NAME = "Caller Test (smoke)"
const PASSWORD = "test1234"

const existing = await sql`SELECT id, role, active FROM admin_users WHERE username = ${USERNAME}`
if (existing.length > 0) {
  console.log(`ℹ️ caller_test already exists (id=${existing[0].id}, role=${existing[0].role}, active=${existing[0].active})`)
  // Ensure it is role=caller and active=true for re-runs.
  await sql`UPDATE admin_users SET role='caller', active=true WHERE username=${USERNAME}`
  console.log("✅ ensured role=caller, active=true")
} else {
  const hash = await bcrypt.hash(PASSWORD, 10)
  const rows = await sql`
    INSERT INTO admin_users (username, password_hash, name, role, active)
    VALUES (${USERNAME}, ${hash}, ${NAME}, 'caller', true)
    RETURNING id
  `
  console.log(`✅ created caller_test (id=${rows[0].id}) password=${PASSWORD}`)
}
