import { NextRequest, NextResponse } from "next/server"
import { requireRole, AuthError } from "@/lib/auth"
import { skipAssignment, logAudit } from "@/lib/queue"

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

    const result = await skipAssignment({
      assignmentId,
      currentCallerId: user.id,
    })

    if (!result.updated) {
      const reason = result.newCallerId === null && result.newCallerName === null
        ? "No hay otra colaboradora activa disponible, o la asignación no te pertenece"
        : "No se pudo reasignar"
      return NextResponse.json({ error: reason }, { status: 404 })
    }

    await logAudit({
      userId: user.id,
      action: "caller.skip",
      entityType: "caller_assignments",
      entityId: assignmentId,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
      metadata: { new_caller_id: result.newCallerId },
    })

    return NextResponse.json({
      success: true,
      new_caller_id: result.newCallerId,
      new_caller_name: result.newCallerName,
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Caller skip error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
