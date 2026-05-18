import { NextResponse } from "next/server"
import { requireRole, AuthError } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { getGlobalStats } from "@/lib/queue"

export async function GET() {
  try {
    const user = await requireRole(["admin", "caller"])
    const sql = getDb()

    const ownRows = await sql`
      SELECT
        COUNT(*) FILTER (WHERE outcome = 'confirmed')::int AS confirmed,
        COUNT(*) FILTER (WHERE outcome = 'no_answer')::int AS no_answer,
        COUNT(*) FILTER (WHERE outcome = 'rejected')::int AS rejected,
        COUNT(*) FILTER (WHERE outcome = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE outcome = 'recall')::int AS recall,
        COUNT(*) FILTER (WHERE outcome != 'pending')::int AS contacted,
        COUNT(*)::int AS total
      FROM caller_assignments
      WHERE caller_id = ${user.id}
    `
    const own = ownRows[0] ?? {}
    const global = await getGlobalStats()

    return NextResponse.json({
      own: {
        confirmed: (own.confirmed as number) ?? 0,
        no_answer: (own.no_answer as number) ?? 0,
        rejected: (own.rejected as number) ?? 0,
        pending: (own.pending as number) ?? 0,
        recall: (own.recall as number) ?? 0,
        contacted: (own.contacted as number) ?? 0,
        total: (own.total as number) ?? 0,
      },
      global: {
        confirmed: global.global_confirmed,
        target: global.global_target,
        is_phase2: global.is_phase2,
        total_assignments: global.total_assignments,
      },
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Caller stats error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
