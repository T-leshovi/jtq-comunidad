import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { petRegistrationSchema } from "@/lib/schema"
import { generateFolio } from "@/lib/folio"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = petRegistrationSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json(
        { error: "Datos inválidos", details: errors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const activitySlug = (body.activity_slug as string) || "esterilizacion"
    const sql = getDb()

    // Look up activity
    const activities = await sql`
      SELECT id, name, status, max_registrations
      FROM activities
      WHERE slug = ${activitySlug}
    `

    if (activities.length === 0) {
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 }
      )
    }

    const activity = activities[0]

    if (activity.status !== "active") {
      return NextResponse.json(
        { error: "Esta actividad no está disponible actualmente" },
        { status: 400 }
      )
    }

    // Check max registrations
    if (activity.max_registrations) {
      const countResult = await sql`
        SELECT COUNT(*)::int AS total
        FROM registrations
        WHERE activity_id = ${activity.id}
          AND status != 'cancelled'
      `
      if (countResult[0].total >= activity.max_registrations) {
        return NextResponse.json(
          { error: "Se ha alcanzado el límite de registros para esta actividad" },
          { status: 409 }
        )
      }
    }

    // Get next registration number
    const seqResult = await sql`
      SELECT COALESCE(MAX(registration_number), 0) + 1 AS next_number
      FROM registrations
      WHERE activity_id = ${activity.id}
    `
    const registrationNumber = seqResult[0].next_number as number

    // Build metadata
    const metadata = JSON.stringify({
      pet_type: data.pet_type,
      pet_name: data.pet_name,
      is_own_pet: data.is_own_pet,
    })

    // Insert registration
    const rows = await sql`
      INSERT INTO registrations (
        activity_id,
        registration_number,
        full_name,
        whatsapp,
        contact_consent,
        risk_consent,
        is_adult,
        metadata,
        status
      ) VALUES (
        ${activity.id},
        ${registrationNumber},
        ${data.full_name},
        ${data.whatsapp},
        ${data.contact_consent},
        ${data.risk_consent},
        ${data.is_adult},
        ${metadata}::jsonb,
        'registered'
      )
      RETURNING id, qr_token
    `

    const qrToken = rows[0].qr_token as string
    const insertedId = rows[0].id as number
    const folio = generateFolio(insertedId)

    return NextResponse.json({
      success: true,
      qr_token: qrToken,
      registration_number: registrationNumber,
      folio,
      activity_name: activity.name,
    })
  } catch (error: unknown) {
    // Handle unique constraint violation (duplicate WhatsApp per activity)
    if (
      error instanceof Error &&
      error.message?.includes("unique")
    ) {
      return NextResponse.json(
        {
          error:
            "Ya existe un registro con este número de WhatsApp para esta actividad",
        },
        { status: 409 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
