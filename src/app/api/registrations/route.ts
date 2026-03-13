import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = request.nextUrl
    const activityId = searchParams.get("activity_id")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")))
    const offset = (page - 1) * limit

    const sql = getDb()

    // Build conditions for parameterized query
    const activityFilter = activityId ? parseInt(activityId) : null
    const searchPattern = search ? `%${search}%` : null

    // Count total
    const countRows = await sql`
      SELECT COUNT(*)::int AS total
      FROM registrations r
      JOIN activities a ON a.id = r.activity_id
      WHERE
        (${activityFilter}::int IS NULL OR r.activity_id = ${activityFilter})
        AND (${status}::text IS NULL OR r.status = ${status})
        AND (
          ${searchPattern}::text IS NULL
          OR r.full_name ILIKE ${searchPattern}
          OR r.whatsapp ILIKE ${searchPattern}
        )
    `
    const total = countRows[0].total as number

    // Fetch registrations
    const rows = await sql`
      SELECT
        r.id,
        r.registration_number,
        r.full_name,
        r.whatsapp,
        r.status,
        r.metadata,
        r.created_at,
        r.scheduled_date,
        r.attended_at,
        a.name AS activity_name
      FROM registrations r
      JOIN activities a ON a.id = r.activity_id
      WHERE
        (${activityFilter}::int IS NULL OR r.activity_id = ${activityFilter})
        AND (${status}::text IS NULL OR r.status = ${status})
        AND (
          ${searchPattern}::text IS NULL
          OR r.full_name ILIKE ${searchPattern}
          OR r.whatsapp ILIKE ${searchPattern}
        )
      ORDER BY r.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const registrations = rows.map((r) => {
      const metadata = (r.metadata ?? {}) as Record<string, unknown>
      return {
        id: r.id,
        registration_number: r.registration_number,
        full_name: r.full_name,
        whatsapp: r.whatsapp,
        status: r.status,
        pet_type: metadata.pet_type ?? null,
        pet_name: metadata.pet_name ?? null,
        is_own_pet: metadata.is_own_pet ?? null,
        activity_name: r.activity_name,
        created_at: r.created_at,
        scheduled_date: r.scheduled_date,
        attended_at: r.attended_at,
      }
    })

    return NextResponse.json({ registrations, total, page, limit })
  } catch (error) {
    console.error("List registrations error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
