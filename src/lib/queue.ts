import { getDb } from "./db"
import { generateFolio } from "./folio"

export type Outcome = "pending" | "confirmed" | "no_answer" | "rejected" | "recall"

const PHASE1_TARGET = 90
const RECALL_DELAY_HOURS = 4
const MAX_ATTEMPTS = 3
const ESTERILIZACION_SLUG = "esterilizacion"

export interface CallerAssignmentRow {
  id: number
  caller_id: number
  registration_id: number
  registration_position: number
  outcome: Outcome
  attempts: number
  recall_after: string | null
  contacted_at: string | null
  notes: string | null
  slot_day: number | null
  slot_time: string | null
  registration_number: number
  full_name: string
  whatsapp: string
  metadata: Record<string, unknown>
  folio: string
  other_registrations: Array<{
    registration_id: number
    registration_number: number
    folio: string
    pet_type: string | null
    pet_name: string | null
  }>
}

export const PHASE_TARGETS = {
  PHASE1: PHASE1_TARGET,
  RECALL_DELAY_HOURS,
  MAX_ATTEMPTS,
}

/**
 * Pops the next caller-assigned registration FIFO-style.
 * Uses FOR UPDATE SKIP LOCKED to guarantee race-safe concurrent calls.
 * Returns null if the caller has nothing left.
 */
export async function popNextForCaller(callerId: number): Promise<CallerAssignmentRow | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT
      ca.id,
      ca.caller_id,
      ca.registration_id,
      ca.registration_position,
      ca.outcome,
      ca.attempts,
      ca.recall_after,
      ca.contacted_at,
      ca.notes,
      ca.slot_day,
      ca.slot_time,
      r.registration_number,
      r.full_name,
      r.whatsapp,
      r.metadata
    FROM caller_assignments ca
    JOIN registrations r ON r.id = ca.registration_id
    WHERE ca.caller_id = ${callerId}
      AND (
        ca.outcome = 'pending'
        OR (ca.outcome = 'recall' AND ca.recall_after IS NOT NULL AND ca.recall_after <= NOW())
      )
    ORDER BY ca.registration_position ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  `

  if (rows.length === 0) return null
  const row = rows[0]
  const registrationId = row.registration_id as number
  const whatsapp = row.whatsapp as string

  // Fetch other registrations for the same whatsapp (Phase 2/3 mascotas).
  const others = await sql`
    SELECT id, registration_number, metadata
    FROM registrations
    WHERE whatsapp = ${whatsapp}
      AND id <> ${registrationId}
      AND status NOT IN ('cancelled','no_show')
    ORDER BY created_at ASC, id ASC
  `

  return {
    id: row.id as number,
    caller_id: row.caller_id as number,
    registration_id: registrationId,
    registration_position: row.registration_position as number,
    outcome: row.outcome as Outcome,
    attempts: row.attempts as number,
    recall_after: (row.recall_after as string | null) ?? null,
    contacted_at: (row.contacted_at as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    slot_day: (row.slot_day as number | null) ?? null,
    slot_time: (row.slot_time as string | null) ?? null,
    registration_number: row.registration_number as number,
    full_name: row.full_name as string,
    whatsapp,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    folio: generateFolio(registrationId),
    other_registrations: others.map((o) => {
      const meta = (o.metadata as Record<string, unknown>) ?? {}
      return {
        registration_id: o.id as number,
        registration_number: o.registration_number as number,
        folio: generateFolio(o.id as number),
        pet_type: (meta.pet_type as string | undefined) ?? null,
        pet_name: (meta.pet_name as string | undefined) ?? null,
      }
    }),
  }
}

/**
 * Distributes unassigned `registered` records round-robin across active callers.
 * Idempotent: skips registrations that already have an assignment.
 * Returns the number of new assignments created.
 */
export async function distributeAssignments(activitySlug = ESTERILIZACION_SLUG): Promise<{
  assigned: number
  callers: number
}> {
  const sql = getDb()

  // 1. Active callers ordered by id for deterministic round-robin.
  const callers = await sql`
    SELECT id FROM admin_users
    WHERE role = 'caller' AND active = true
    ORDER BY id ASC
  `

  if (callers.length === 0) {
    return { assigned: 0, callers: 0 }
  }

  // 2. Unassigned registrations ordered by created_at ASC = registration order = FIFO.
  // Rule: one mascota per whatsapp for Phase 1 — pick the earliest registration per phone,
  // and skip any phone that already has another assignment in the queue (sticky across runs).
  const unassigned = await sql`
    WITH eligible AS (
      SELECT DISTINCT ON (r.whatsapp) r.id, r.created_at
      FROM registrations r
      WHERE r.activity_id = (SELECT id FROM activities WHERE slug = ${activitySlug})
        AND r.status IN ('registered','confirmed')
        AND NOT EXISTS (
          SELECT 1 FROM caller_assignments ca WHERE ca.registration_id = r.id
        )
        AND NOT EXISTS (
          SELECT 1 FROM caller_assignments ca2
          JOIN registrations r2 ON r2.id = ca2.registration_id
          WHERE r2.whatsapp = r.whatsapp
        )
      ORDER BY r.whatsapp, r.created_at ASC, r.id ASC
    )
    SELECT id FROM eligible
    ORDER BY created_at ASC, id ASC
  `

  if (unassigned.length === 0) {
    return { assigned: 0, callers: callers.length }
  }

  // 3. Build inserts: position = next available slot per caller, round-robin assignment.
  // Existing max position per caller used so re-runs append (sticky).
  const existingPositions = await sql`
    SELECT caller_id, COALESCE(MAX(registration_position), -1) AS max_pos
    FROM caller_assignments
    GROUP BY caller_id
  `
  const positionByCaller = new Map<number, number>()
  for (const c of callers) {
    positionByCaller.set(c.id as number, -1)
  }
  for (const ep of existingPositions) {
    positionByCaller.set(ep.caller_id as number, ep.max_pos as number)
  }

  let assigned = 0
  for (let i = 0; i < unassigned.length; i++) {
    const callerId = callers[i % callers.length].id as number
    const nextPos = (positionByCaller.get(callerId) ?? -1) + 1
    positionByCaller.set(callerId, nextPos)

    try {
      await sql`
        INSERT INTO caller_assignments (caller_id, registration_id, registration_position)
        VALUES (${callerId}, ${unassigned[i].id as number}, ${nextPos})
        ON CONFLICT (registration_id) DO NOTHING
      `
      assigned += 1
    } catch (err) {
      console.error("distributeAssignments insert failed", { callerId, registrationId: unassigned[i].id, err })
    }
  }

  return { assigned, callers: callers.length }
}

/**
 * Applies an outcome update with the recall + attempts state machine.
 * - confirmed: terminal, updates registrations.status='confirmed'.
 * - no_answer: increments attempts; if < MAX_ATTEMPTS, becomes recall with recall_after = NOW()+4h.
 *              If >= MAX_ATTEMPTS, terminal at no_answer.
 * - rejected: terminal.
 * - recall: manual recall, increments attempts, schedules recall_after = NOW()+4h.
 */
export async function applyOutcome(params: {
  assignmentId: number
  callerId: number
  outcome: "confirmed" | "no_answer" | "rejected" | "recall"
  slotDay?: number | null
  slotTime?: string | null
  notes?: string | null
}): Promise<{ updated: boolean; finalOutcome: Outcome; attempts: number; recallAfter: string | null }> {
  const sql = getDb()

  // Lock assignment to ensure caller owns it.
  const current = await sql`
    SELECT id, registration_id, attempts, outcome
    FROM caller_assignments
    WHERE id = ${params.assignmentId} AND caller_id = ${params.callerId}
    FOR UPDATE
  `
  if (current.length === 0) {
    return { updated: false, finalOutcome: "pending", attempts: 0, recallAfter: null }
  }
  const row = current[0]
  const newAttempts = (row.attempts as number) + 1

  let finalOutcome: Outcome
  let recallAfter: Date | null = null

  if (params.outcome === "confirmed") {
    finalOutcome = "confirmed"
  } else if (params.outcome === "rejected") {
    finalOutcome = "rejected"
  } else if (params.outcome === "recall") {
    finalOutcome = "recall"
    recallAfter = new Date(Date.now() + RECALL_DELAY_HOURS * 60 * 60 * 1000)
  } else {
    // no_answer
    if (newAttempts < MAX_ATTEMPTS) {
      finalOutcome = "recall"
      recallAfter = new Date(Date.now() + RECALL_DELAY_HOURS * 60 * 60 * 1000)
    } else {
      finalOutcome = "no_answer"
    }
  }

  await sql`
    UPDATE caller_assignments
    SET outcome = ${finalOutcome},
        attempts = ${newAttempts},
        recall_after = ${recallAfter ? recallAfter.toISOString() : null},
        contacted_at = NOW(),
        slot_day = ${params.slotDay ?? null},
        slot_time = ${params.slotTime ?? null},
        notes = ${params.notes ?? null}
    WHERE id = ${params.assignmentId}
  `

  // Mirror confirmed state on registration row so existing dashboards see it.
  if (finalOutcome === "confirmed") {
    await sql`
      UPDATE registrations
      SET status = 'confirmed'
      WHERE id = ${row.registration_id as number}
        AND status IN ('registered','confirmed')
    `
  }

  return {
    updated: true,
    finalOutcome,
    attempts: newAttempts,
    recallAfter: recallAfter ? recallAfter.toISOString() : null,
  }
}

/**
 * Returns global confirmed count + per-caller counts.
 */
export async function getGlobalStats(): Promise<{
  global_confirmed: number
  global_target: number
  is_phase2: boolean
  per_caller: Array<{ caller_id: number; caller_name: string; confirmed: number; no_answer: number; rejected: number; pending: number; recall: number; total: number }>
  total_assignments: number
}> {
  const sql = getDb()

  const globalRows = await sql`
    SELECT COUNT(*) FILTER (WHERE outcome = 'confirmed')::int AS confirmed,
           COUNT(*)::int AS total
    FROM caller_assignments
  `
  const globalConfirmed = (globalRows[0]?.confirmed as number) ?? 0
  const totalAssignments = (globalRows[0]?.total as number) ?? 0

  const perCallerRows = await sql`
    SELECT
      u.id AS caller_id,
      u.name AS caller_name,
      COUNT(*) FILTER (WHERE ca.outcome = 'confirmed')::int AS confirmed,
      COUNT(*) FILTER (WHERE ca.outcome = 'no_answer')::int AS no_answer,
      COUNT(*) FILTER (WHERE ca.outcome = 'rejected')::int AS rejected,
      COUNT(*) FILTER (WHERE ca.outcome = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE ca.outcome = 'recall')::int AS recall,
      COUNT(*)::int AS total
    FROM admin_users u
    LEFT JOIN caller_assignments ca ON ca.caller_id = u.id
    WHERE u.role = 'caller'
    GROUP BY u.id, u.name
    ORDER BY u.id ASC
  `

  return {
    global_confirmed: globalConfirmed,
    global_target: PHASE1_TARGET,
    is_phase2: globalConfirmed >= PHASE1_TARGET,
    per_caller: perCallerRows.map((r) => ({
      caller_id: r.caller_id as number,
      caller_name: r.caller_name as string,
      confirmed: (r.confirmed as number) ?? 0,
      no_answer: (r.no_answer as number) ?? 0,
      rejected: (r.rejected as number) ?? 0,
      pending: (r.pending as number) ?? 0,
      recall: (r.recall as number) ?? 0,
      total: (r.total as number) ?? 0,
    })),
    total_assignments: totalAssignments,
  }
}

/**
 * Caller voluntarily reassigns the current assignment to another active caller.
 * Picks the active caller (excluding current) with the fewest pending+recall items.
 * Returns the new caller name, or null if there is no other active caller to take it.
 */
export async function skipAssignment(params: {
  assignmentId: number
  currentCallerId: number
}): Promise<{ updated: boolean; newCallerId: number | null; newCallerName: string | null }> {
  const sql = getDb()

  // Verify ownership + assignment still pending/recall.
  const ownership = await sql`
    SELECT id FROM caller_assignments
    WHERE id = ${params.assignmentId}
      AND caller_id = ${params.currentCallerId}
      AND outcome IN ('pending','recall')
  `
  if (ownership.length === 0) {
    return { updated: false, newCallerId: null, newCallerName: null }
  }

  // Find the active caller (excluding current) with fewest open items.
  const candidate = await sql`
    SELECT u.id, u.name,
           COUNT(ca.id) FILTER (WHERE ca.outcome IN ('pending','recall')) AS open_count
    FROM admin_users u
    LEFT JOIN caller_assignments ca ON ca.caller_id = u.id
    WHERE u.role = 'caller'
      AND u.active = true
      AND u.id <> ${params.currentCallerId}
    GROUP BY u.id, u.name
    ORDER BY open_count ASC, u.id ASC
    LIMIT 1
  `
  if (candidate.length === 0) {
    return { updated: false, newCallerId: null, newCallerName: null }
  }
  const newCallerId = candidate[0].id as number
  const newCallerName = candidate[0].name as string

  await sql`
    UPDATE caller_assignments
    SET caller_id = ${newCallerId},
        notes = CASE
          WHEN notes IS NULL OR notes = '' THEN ${"[skip from " + params.currentCallerId + "]"}
          ELSE notes || ${" [skip from " + params.currentCallerId + "]"}
        END
    WHERE id = ${params.assignmentId}
  `

  return { updated: true, newCallerId, newCallerName }
}

/**
 * Admin action: redistribute pending+recall assignments from inactive callers
 * to active callers, picking the active caller with fewest open items each time.
 * Returns number of assignments moved.
 */
export async function redistributeFromInactive(): Promise<{ moved: number; activeCount: number }> {
  const sql = getDb()

  const orphaned = await sql`
    SELECT ca.id, ca.registration_position
    FROM caller_assignments ca
    JOIN admin_users u ON u.id = ca.caller_id
    WHERE u.active = false
      AND u.role = 'caller'
      AND ca.outcome IN ('pending','recall')
    ORDER BY ca.registration_position ASC, ca.id ASC
  `
  if (orphaned.length === 0) {
    const active = await sql`SELECT COUNT(*)::int AS c FROM admin_users WHERE role='caller' AND active=true`
    return { moved: 0, activeCount: (active[0]?.c as number) ?? 0 }
  }

  const activeCallers = await sql`
    SELECT u.id,
           COUNT(ca.id) FILTER (WHERE ca.outcome IN ('pending','recall'))::int AS open_count
    FROM admin_users u
    LEFT JOIN caller_assignments ca ON ca.caller_id = u.id
    WHERE u.role = 'caller' AND u.active = true
    GROUP BY u.id
    ORDER BY u.id ASC
  `
  if (activeCallers.length === 0) {
    return { moved: 0, activeCount: 0 }
  }

  // In-memory load tracker (one DB round-trip per move; OK for MVP scale).
  const load = new Map<number, number>()
  for (const c of activeCallers) {
    load.set(c.id as number, (c.open_count as number) ?? 0)
  }

  let moved = 0
  for (const o of orphaned) {
    let bestId = activeCallers[0].id as number
    let bestLoad = load.get(bestId) ?? 0
    for (const c of activeCallers) {
      const cid = c.id as number
      const l = load.get(cid) ?? 0
      if (l < bestLoad) {
        bestId = cid
        bestLoad = l
      }
    }
    await sql`
      UPDATE caller_assignments
      SET caller_id = ${bestId}
      WHERE id = ${o.id as number}
    `
    load.set(bestId, bestLoad + 1)
    moved += 1
  }

  return { moved, activeCount: activeCallers.length }
}

export async function logAudit(params: {
  userId: number | null
  action: string
  entityType?: string
  entityId?: number
  ip?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown>
}): Promise<void> {
  const sql = getDb()
  try {
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, ip, user_agent, metadata)
      VALUES (
        ${params.userId},
        ${params.action},
        ${params.entityType ?? null},
        ${params.entityId ?? null},
        ${params.ip ?? null}::inet,
        ${params.userAgent ?? null},
        ${params.metadata ? JSON.stringify(params.metadata) : null}::jsonb
      )
    `
  } catch (err) {
    // Audit failures must not break the request.
    console.error("audit_log insert failed", { action: params.action, err })
  }
}
