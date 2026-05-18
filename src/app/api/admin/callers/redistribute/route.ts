import { NextRequest, NextResponse } from "next/server"
import { requireRole, AuthError } from "@/lib/auth"
import { redistributeFromInactive, logAudit } from "@/lib/queue"

function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return request.headers.get("x-real-ip")
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireRole("admin")
    const result = await redistributeFromInactive()

    await logAudit({
      userId: admin.id,
      action: "callers.redistribute_inactive",
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
      metadata: { moved: result.moved, active_count: result.activeCount },
    })

    return NextResponse.json({
      success: true,
      moved: result.moved,
      active_callers: result.activeCount,
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Redistribute error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
