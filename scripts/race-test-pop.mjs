#!/usr/bin/env node
// Race test: 3 parallel transactions hitting popNextForCaller against the same caller queue.
// Each transaction holds the FOR UPDATE SKIP LOCKED row, so concurrent peers skip to the next.
// If working: 3 distinct rows returned. If broken: same row returned 3 times.
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
const pool = new Pool({ connectionString: env.DATABASE_URL })

// Get caller_test id
const idRow = await pool.query(`SELECT id FROM admin_users WHERE username='caller_test'`)
const callerId = idRow.rows[0].id

async function popInTxn(label, holdMs) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const r = await client.query(
      `SELECT ca.id, ca.registration_id, ca.registration_position, r.full_name
       FROM caller_assignments ca
       JOIN registrations r ON r.id = ca.registration_id
       WHERE ca.caller_id = $1
         AND (ca.outcome = 'pending' OR (ca.outcome = 'recall' AND ca.recall_after <= NOW()))
       ORDER BY ca.registration_position ASC
       LIMIT 1
       FOR UPDATE SKIP LOCKED`,
      [callerId]
    )
    const row = r.rows[0] ?? null
    console.log(`[${label}] popped: ${row ? `id=${row.id} pos=${row.registration_position} name=${row.full_name}` : "none"}`)
    // Hold the lock to simulate the request not yet finishing.
    await new Promise((res) => setTimeout(res, holdMs))
    await client.query("ROLLBACK") // do not consume the row
    return row
  } finally {
    client.release()
  }
}

const t0 = Date.now()
const results = await Promise.all([
  popInTxn("A", 1500),
  popInTxn("B", 1500),
  popInTxn("C", 1500),
])
console.log(`elapsed: ${Date.now() - t0} ms`)

const ids = results.map((r) => r?.id).filter((x) => x !== undefined)
const unique = new Set(ids)
if (unique.size === ids.length && ids.length > 1) {
  console.log(`✅ Race test PASS: ${ids.length} parallel transactions got ${unique.size} distinct rows`)
} else if (ids.length <= 1) {
  console.log(`ℹ️ Inconclusive: only ${ids.length} rows available to pop`)
} else {
  console.log(`❌ Race test FAIL: ${ids.length} transactions but only ${unique.size} distinct rows`)
}

await pool.end()
