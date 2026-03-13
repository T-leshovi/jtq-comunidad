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
    const activityFilter = activityId ? parseInt(activityId) : null

    const sql = getDb()

    // Total registrations
    const totalRows = await sql`
      SELECT COUNT(*)::int AS total
      FROM registrations
      WHERE (${activityFilter}::int IS NULL OR activity_id = ${activityFilter})
    `
    const totalRegistrations = totalRows[0].total as number

    // By status
    const statusRows = await sql`
      SELECT status, COUNT(*)::int AS count
      FROM registrations
      WHERE (${activityFilter}::int IS NULL OR activity_id = ${activityFilter})
      GROUP BY status
    `
    const byStatus: Record<string, number> = {
      registered: 0,
      confirmed: 0,
      attended: 0,
      cancelled: 0,
      no_show: 0,
    }
    for (const row of statusRows) {
      byStatus[row.status as string] = row.count as number
    }

    // By pet type
    const petTypeRows = await sql`
      SELECT metadata->>'pet_type' AS pet_type, COUNT(*)::int AS count
      FROM registrations
      WHERE (${activityFilter}::int IS NULL OR activity_id = ${activityFilter})
        AND metadata->>'pet_type' IS NOT NULL
      GROUP BY metadata->>'pet_type'
    `
    const byPetType: Record<string, number> = { perro: 0, gato: 0 }
    for (const row of petTypeRows) {
      byPetType[row.pet_type as string] = row.count as number
    }

    // By ownership
    const ownershipRows = await sql`
      SELECT
        CASE WHEN (metadata->>'is_own_pet')::boolean THEN 'own' ELSE 'stray' END AS ownership,
        COUNT(*)::int AS count
      FROM registrations
      WHERE (${activityFilter}::int IS NULL OR activity_id = ${activityFilter})
        AND metadata->>'is_own_pet' IS NOT NULL
      GROUP BY (metadata->>'is_own_pet')::boolean
    `
    const byOwnership: Record<string, number> = { own: 0, stray: 0 }
    for (const row of ownershipRows) {
      byOwnership[row.ownership as string] = row.count as number
    }

    // Recent registrations
    const recentRows = await sql`
      SELECT
        r.id,
        r.registration_number,
        r.full_name,
        r.status,
        r.metadata,
        r.created_at,
        a.name AS activity_name
      FROM registrations r
      JOIN activities a ON a.id = r.activity_id
      WHERE (${activityFilter}::int IS NULL OR r.activity_id = ${activityFilter})
      ORDER BY r.created_at DESC
      LIMIT 5
    `
    const recentRegistrations = recentRows.map((r) => {
      const metadata = (r.metadata ?? {}) as Record<string, unknown>
      return {
        id: r.id,
        registration_number: r.registration_number,
        full_name: r.full_name,
        status: r.status,
        pet_type: metadata.pet_type ?? null,
        activity_name: r.activity_name,
        created_at: r.created_at,
      }
    })

    return NextResponse.json({
      total_registrations: totalRegistrations,
      by_status: byStatus,
      by_pet_type: byPetType,
      by_ownership: byOwnership,
      recent_registrations: recentRegistrations,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
