import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/db"
import { requireRole, AuthError } from "@/lib/auth"
import { logAudit } from "@/lib/queue"

const createCallerSchema = z.object({
  username: z.string().min(2).max(100),
  name: z.string().min(2).max(255),
  password: z.string().min(6).max(128),
})

function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return request.headers.get("x-real-ip")
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireRole("admin")
    const body = await request.json()
    const parsed = createCallerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { username, name, password } = parsed.data
    const sql = getDb()
    const passwordHash = await bcrypt.hash(password, 10)

    try {
      const rows = await sql`
        INSERT INTO admin_users (username, password_hash, name, role, active)
        VALUES (${username}, ${passwordHash}, ${name}, 'caller', true)
        RETURNING id, username, name, role, active, created_at
      `
      const created = rows[0]

      await logAudit({
        userId: admin.id,
        action: "caller.create",
        entityType: "admin_users",
        entityId: created.id as number,
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent"),
        metadata: { username, name },
      })

      return NextResponse.json({ success: true, caller: created }, { status: 201 })
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes("unique")) {
        return NextResponse.json(
          { error: "Ya existe un usuario con ese username" },
          { status: 409 }
        )
      }
      throw err
    }
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Create caller error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await requireRole("admin")
    const sql = getDb()
    const rows = await sql`
      SELECT
        u.id,
        u.username,
        u.name,
        u.role,
        u.active,
        u.last_login_at,
        u.created_at,
        COALESCE(SUM(CASE WHEN ca.outcome = 'confirmed' THEN 1 ELSE 0 END), 0)::int AS confirmed,
        COALESCE(SUM(CASE WHEN ca.outcome = 'no_answer' THEN 1 ELSE 0 END), 0)::int AS no_answer,
        COALESCE(SUM(CASE WHEN ca.outcome = 'rejected' THEN 1 ELSE 0 END), 0)::int AS rejected,
        COALESCE(SUM(CASE WHEN ca.outcome = 'pending' THEN 1 ELSE 0 END), 0)::int AS pending,
        COALESCE(SUM(CASE WHEN ca.outcome = 'recall' THEN 1 ELSE 0 END), 0)::int AS recall,
        COUNT(ca.id)::int AS total_assigned
      FROM admin_users u
      LEFT JOIN caller_assignments ca ON ca.caller_id = u.id
      WHERE u.role IN ('admin','caller')
      GROUP BY u.id
      ORDER BY u.role DESC, u.id ASC
    `
    return NextResponse.json({ users: rows })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("List callers error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
