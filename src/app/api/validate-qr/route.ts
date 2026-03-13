import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { validateQrSchema } from "@/lib/schema"
import { generateFolio } from "@/lib/folio"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const parsed = validateQrSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Token QR inválido" },
        { status: 400 }
      )
    }

    const { qr_token } = parsed.data
    const sql = getDb()

    // Look up registration by qr_token
    const rows = await sql`
      SELECT
        r.id,
        r.registration_number,
        r.full_name,
        r.whatsapp,
        r.status,
        r.metadata,
        r.scheduled_date,
        r.attended_at,
        r.created_at,
        a.name AS activity_name
      FROM registrations r
      JOIN activities a ON a.id = r.activity_id
      WHERE r.qr_token = ${qr_token}
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      )
    }

    const reg = rows[0]
    const metadata = (reg.metadata ?? {}) as Record<string, unknown>

    const folio = generateFolio(reg.id as number)

    if (reg.status === "attended") {
      return NextResponse.json({
        already_attended: true,
        registration: {
          id: reg.id,
          registration_number: reg.registration_number,
          folio,
          full_name: reg.full_name,
          whatsapp: reg.whatsapp,
          pet_type: metadata.pet_type,
          pet_name: metadata.pet_name,
          activity_name: reg.activity_name,
          attended_at: reg.attended_at,
        },
      })
    }

    if (reg.status === "cancelled") {
      return NextResponse.json(
        { error: "Este registro fue cancelado" },
        { status: 400 }
      )
    }

    // Mark as attended
    await sql`
      UPDATE registrations
      SET status = 'attended', attended_at = NOW()
      WHERE qr_token = ${qr_token}
    `

    return NextResponse.json({
      success: true,
      registration: {
        id: reg.id,
        registration_number: reg.registration_number,
        folio,
        full_name: reg.full_name,
        whatsapp: reg.whatsapp,
        pet_type: metadata.pet_type,
        pet_name: metadata.pet_name,
        activity_name: reg.activity_name,
      },
    })
  } catch (error) {
    console.error("QR validation error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
