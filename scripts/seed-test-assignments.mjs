#!/usr/bin/env node
// Seeds 5 caller_assignments to caller_test for smoke testing.
// Cleanup: DELETE FROM caller_assignments WHERE caller_id = (SELECT id FROM admin_users WHERE username='caller_test');
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
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

const callerRows = await sql`SELECT id FROM admin_users WHERE username='caller_test'`
if (callerRows.length === 0) {
  console.error("caller_test not found. Run seed-test-caller.mjs first.")
  process.exit(1)
}
const callerId = callerRows[0].id

const existing = await sql`SELECT COUNT(*)::int AS c FROM caller_assignments WHERE caller_id = ${callerId}`
if ((existing[0]?.c ?? 0) >= 5) {
  console.log(`ℹ️ caller_test already has ${existing[0].c} assignments. Skipping seed.`)
  process.exit(0)
}

const candidates = await sql`
  SELECT r.id
  FROM registrations r
  WHERE r.activity_id = (SELECT id FROM activities WHERE slug='esterilizacion')
    AND r.status IN ('registered','confirmed')
    AND NOT EXISTS (SELECT 1 FROM caller_assignments ca WHERE ca.registration_id = r.id)
  ORDER BY r.created_at ASC, r.id ASC
  LIMIT 5
`

let pos = 0
const seeded = []
for (const c of candidates) {
  await sql`
    INSERT INTO caller_assignments (caller_id, registration_id, registration_position)
    VALUES (${callerId}, ${c.id}, ${pos})
    ON CONFLICT (registration_id) DO NOTHING
  `
  seeded.push(c.id)
  pos += 1
}

console.log(`✅ Seeded ${seeded.length} assignments for caller_test (registration ids: ${seeded.join(", ")})`)
