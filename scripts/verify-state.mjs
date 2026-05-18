#!/usr/bin/env node
// Smoke check: verify caller MVP schema + report registration counts.
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

const tables = await sql`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('callers','caller_assignments','audit_log','admin_users','registrations','activities')
  ORDER BY table_name
`
console.log("Tables present:", tables.map((r) => r.table_name).join(", "))

const adminCols = await sql`
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'admin_users' AND column_name IN ('role','active','last_login_at')
  ORDER BY column_name
`
console.log("admin_users new cols:", adminCols.map((r) => `${r.column_name}:${r.data_type}`).join(", "))

const counts = await sql`
  SELECT
    (SELECT COUNT(*) FROM registrations
       WHERE activity_id = (SELECT id FROM activities WHERE slug='esterilizacion'))::int AS total_all,
    (SELECT COUNT(*) FROM registrations
       WHERE activity_id = (SELECT id FROM activities WHERE slug='esterilizacion')
         AND status IN ('registered','confirmed'))::int AS active,
    (SELECT COUNT(*) FROM registrations
       WHERE activity_id = (SELECT id FROM activities WHERE slug='esterilizacion')
         AND status = 'confirmed')::int AS already_confirmed,
    (SELECT COUNT(*) FROM registrations
       WHERE activity_id = (SELECT id FROM activities WHERE slug='esterilizacion')
         AND status = 'cancelled')::int AS cancelled,
    (SELECT COUNT(*) FROM admin_users WHERE role='admin')::int AS admins,
    (SELECT COUNT(*) FROM admin_users WHERE role='caller')::int AS callers,
    (SELECT COUNT(*) FROM caller_assignments)::int AS assignments
`
console.log("Counts:", JSON.stringify(counts[0], null, 2))
