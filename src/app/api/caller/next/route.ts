import { NextResponse } from "next/server"
import { requireRole, AuthError } from "@/lib/auth"
import { popNextForCaller, getGlobalStats, PHASE_TARGETS } from "@/lib/queue"

export async function GET() {
  try {
    const user = await requireRole(["admin", "caller"])
    const assignment = await popNextForCaller(user.id)
    const global = await getGlobalStats()

    if (!assignment) {
      return NextResponse.json({
        assignment: null,
        global_confirmed: global.global_confirmed,
        global_target: PHASE_TARGETS.PHASE1,
        is_phase2: global.is_phase2,
        message: "No tienes asignaciones pendientes por ahora",
      })
    }

    const metadata = assignment.metadata
    return NextResponse.json({
      assignment: {
        id: assignment.id,
        registration_id: assignment.registration_id,
        registration_number: assignment.registration_number,
        folio: assignment.folio,
        full_name: assignment.full_name,
        whatsapp: assignment.whatsapp,
        outcome: assignment.outcome,
        attempts: assignment.attempts,
        pet_type: (metadata.pet_type as string | undefined) ?? null,
        pet_name: (metadata.pet_name as string | undefined) ?? null,
        is_own_pet: (metadata.is_own_pet as boolean | undefined) ?? null,
        recall_after: assignment.recall_after,
        other_registrations: assignment.other_registrations,
      },
      global_confirmed: global.global_confirmed,
      global_target: PHASE_TARGETS.PHASE1,
      is_phase2: global.is_phase2,
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Caller next error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
