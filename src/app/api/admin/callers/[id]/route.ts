import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/db"
import { requireRole, AuthError } from "@/lib/auth"
import { logAudit } from "@/lib/queue"

const patchSchema = z.object({
  active: z.boolean().optional(),
})

function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return request.headers.get("x-real-ip")
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireRole("admin")
    const { id } = await context.params
    const callerId = parseInt(id, 10)
    if (Number.isNaN(callerId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success || parsed.data.active === undefined) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const sql = getDb()
    const rows = await sql`
      UPDATE admin_users
      SET active = ${parsed.data.active}
      WHERE id = ${callerId} AND role = 'caller'
      RETURNING id, username, name, active
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "Caller no encontrado" }, { status: 404 })
    }

    await logAudit({
      userId: admin.id,
      action: parsed.data.active ? "caller.activate" : "caller.deactivate",
      entityType: "admin_users",
      entityId: callerId,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
    })

    return NextResponse.json({ success: true, caller: rows[0] })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Patch caller error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
