import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireRole, AuthError } from "@/lib/auth"
import { applyOutcome, logAudit } from "@/lib/queue"

const outcomeSchema = z.object({
  outcome: z.enum(["confirmed", "no_answer", "rejected", "recall"]),
  slot_day: z.number().int().min(1).max(2).nullable().optional(),
  slot_time: z
    .string()
    .regex(/^\d{1,2}:\d{2}$/, "Formato HH:MM")
    .nullable()
    .optional(),
  notes: z.string().max(1000).nullable().optional(),
})

function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return request.headers.get("x-real-ip")
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(["admin", "caller"])
    const { id } = await context.params
    const assignmentId = parseInt(id, 10)
    if (Number.isNaN(assignmentId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const parsed = outcomeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // When confirming, slot_day + slot_time should be present.
    if (parsed.data.outcome === "confirmed") {
      if (!parsed.data.slot_day || !parsed.data.slot_time) {
        return NextResponse.json(
          { error: "Al confirmar se requieren día y hora" },
          { status: 400 }
        )
      }
    }

    const result = await applyOutcome({
      assignmentId,
      callerId: user.id,
      outcome: parsed.data.outcome,
      slotDay: parsed.data.slot_day ?? null,
      slotTime: parsed.data.slot_time ?? null,
      notes: parsed.data.notes ?? null,
    })

    if (!result.updated) {
      return NextResponse.json(
        { error: "Asignación no encontrada o no te pertenece" },
        { status: 404 }
      )
    }

    await logAudit({
      userId: user.id,
      action: `caller.outcome.${result.finalOutcome}`,
      entityType: "caller_assignments",
      entityId: assignmentId,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
      metadata: {
        outcome: parsed.data.outcome,
        slot_day: parsed.data.slot_day ?? null,
        slot_time: parsed.data.slot_time ?? null,
        attempts: result.attempts,
      },
    })

    return NextResponse.json({
      success: true,
      outcome: result.finalOutcome,
      attempts: result.attempts,
      recall_after: result.recallAfter,
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Caller outcome error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
