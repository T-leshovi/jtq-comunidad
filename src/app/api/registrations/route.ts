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
    const duplicates = searchParams.get("duplicates") // "phone", "name", "any"
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")))
    const offset = (page - 1) * limit

    const sql = getDb()

    // Build conditions for parameterized query
    const activityFilter = activityId ? parseInt(activityId) : null
    const searchPattern = search ? `%${search}%` : null

    // Count total (with duplicate filter support)
    const countRows = await sql`
      WITH dup_phones AS (
        SELECT whatsapp FROM registrations WHERE status != 'cancelled' GROUP BY whatsapp HAVING COUNT(*) > 1
      ),
      dup_names AS (
        SELECT LOWER(TRIM(full_name)) AS norm_name FROM registrations WHERE status != 'cancelled' GROUP BY LOWER(TRIM(full_name)) HAVING COUNT(*) > 1
      )
      SELECT COUNT(*)::int AS total
      FROM registrations r
      JOIN activities a ON a.id = r.activity_id
      LEFT JOIN dup_phones dp ON dp.whatsapp = r.whatsapp
      LEFT JOIN dup_names dn ON dn.norm_name = LOWER(TRIM(r.full_name))
      WHERE
        (${activityFilter}::int IS NULL OR r.activity_id = ${activityFilter})
        AND (${status}::text IS NULL OR r.status = ${status})
        AND (
          ${searchPattern}::text IS NULL
          OR r.full_name ILIKE ${searchPattern}
          OR r.whatsapp ILIKE ${searchPattern}
        )
        AND (
          ${duplicates}::text IS NULL
          OR (${duplicates} = 'phone' AND dp.whatsapp IS NOT NULL)
          OR (${duplicates} = 'name' AND dn.norm_name IS NOT NULL)
          OR (${duplicates} = 'any' AND (dp.whatsapp IS NOT NULL OR dn.norm_name IS NOT NULL))
        )
    `
    const total = countRows[0].total as number

    // Fetch registrations with duplicate detection
    const rows = await sql`
      WITH dup_phones AS (
        SELECT whatsapp, COUNT(*)::int AS cnt
        FROM registrations
        WHERE status != 'cancelled'
        GROUP BY whatsapp
        HAVING COUNT(*) > 1
      ),
      dup_names AS (
        SELECT LOWER(TRIM(full_name)) AS norm_name, COUNT(*)::int AS cnt
        FROM registrations
        WHERE status != 'cancelled'
        GROUP BY LOWER(TRIM(full_name))
        HAVING COUNT(*) > 1
      )
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
        a.name AS activity_name,
        CASE WHEN dp.cnt IS NOT NULL THEN true ELSE false END AS dup_phone,
        CASE WHEN dn.cnt IS NOT NULL THEN true ELSE false END AS dup_name
      FROM registrations r
      JOIN activities a ON a.id = r.activity_id
      LEFT JOIN dup_phones dp ON dp.whatsapp = r.whatsapp
      LEFT JOIN dup_names dn ON dn.norm_name = LOWER(TRIM(r.full_name))
      WHERE
        (${activityFilter}::int IS NULL OR r.activity_id = ${activityFilter})
        AND (${status}::text IS NULL OR r.status = ${status})
        AND (
          ${searchPattern}::text IS NULL
          OR r.full_name ILIKE ${searchPattern}
          OR r.whatsapp ILIKE ${searchPattern}
        )
        AND (
          ${duplicates}::text IS NULL
          OR (${duplicates} = 'phone' AND dp.whatsapp IS NOT NULL)
          OR (${duplicates} = 'name' AND dn.norm_name IS NOT NULL)
          OR (${duplicates} = 'any' AND (dp.whatsapp IS NOT NULL OR dn.norm_name IS NOT NULL))
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
        dup_phone: r.dup_phone ?? false,
        dup_name: r.dup_name ?? false,
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
