import { NextRequest, NextResponse } from "next/server"
import { requireRole, AuthError } from "@/lib/auth"
import { distributeAssignments, logAudit } from "@/lib/queue"

function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return request.headers.get("x-real-ip")
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireRole("admin")
    const result = await distributeAssignments()

    await logAudit({
      userId: admin.id,
      action: "callers.distribute",
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
      metadata: { assigned: result.assigned, callers: result.callers },
    })

    return NextResponse.json({
      success: true,
      assigned: result.assigned,
      active_callers: result.callers,
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Distribute error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
