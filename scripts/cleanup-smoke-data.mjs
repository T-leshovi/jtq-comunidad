#!/usr/bin/env node
// Cleans up smoke-test data while preserving audit_log entries.
// Usage:
//   node scripts/cleanup-smoke-data.mjs           # dry-run (prints what would change)
//   node scripts/cleanup-smoke-data.mjs --apply   # actually delete
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

const apply = process.argv.includes("--apply")
const env = loadEnvLocal()
const sql = neon(env.DATABASE_URL)

const callerRows = await sql`SELECT id FROM admin_users WHERE username='caller_test'`
if (callerRows.length === 0) {
  console.log("ℹ️ caller_test not found; nothing to clean.")
  process.exit(0)
}
const callerId = callerRows[0].id

const affectedAssignments = await sql`
  SELECT ca.id, ca.registration_id, ca.outcome, r.status, r.full_name
  FROM caller_assignments ca
  JOIN registrations r ON r.id = ca.registration_id
  WHERE ca.caller_id = ${callerId}
  ORDER BY ca.id ASC
`
console.log(`Would affect ${affectedAssignments.length} caller_assignments rows:`)
for (const a of affectedAssignments) {
  console.log(`  - assignment ${a.id} → registration ${a.registration_id} (${a.full_name}) outcome=${a.outcome} reg.status=${a.status}`)
}

const regsToReset = affectedAssignments
  .filter((a) => a.outcome === "confirmed" && a.status === "confirmed")
  .map((a) => a.registration_id)

if (!apply) {
  console.log("")
  console.log("Dry-run. Re-run with --apply to execute:")
  console.log(`  DELETE FROM caller_assignments WHERE caller_id = ${callerId};`)
  if (regsToReset.length > 0) {
    console.log(`  UPDATE registrations SET status='registered' WHERE id IN (${regsToReset.join(", ")});`)
  }
  console.log(`  UPDATE admin_users SET active=false WHERE id = ${callerId};   -- keeps row, just deactivates`)
  console.log("")
  console.log("audit_log is preserved.")
  process.exit(0)
}

await sql`DELETE FROM caller_assignments WHERE caller_id = ${callerId}`
console.log(`✅ deleted ${affectedAssignments.length} caller_assignments`)

if (regsToReset.length > 0) {
  await sql`UPDATE registrations SET status='registered' WHERE id = ANY(${regsToReset})`
  console.log(`✅ reset ${regsToReset.length} registrations back to status='registered'`)
}

await sql`UPDATE admin_users SET active=false WHERE id = ${callerId}`
console.log(`✅ deactivated caller_test (kept row for future smoke runs)`)
