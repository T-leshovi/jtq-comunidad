import Link from "next/link"
import { getDb } from "@/lib/db"
import { generateFolio } from "@/lib/folio"
import { ORGANIZER_NAME, ORGANIZER_ORG, LOCATION } from "@/lib/constants"
import QRDisplay from "@/components/QRDisplay"
import ShareButton from "@/components/ShareButton"

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function ConfirmacionPage({ params }: PageProps) {
  const { token } = await params
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://jtq-comunidad.vercel.app"

  let registration: {
    id: number; qr_token: string; registration_number: number
    full_name: string; metadata: Record<string, unknown>; activity_name: string
  } | null = null

  try {
    const sql = getDb()
    const rows = await sql`
      SELECT r.id, r.qr_token, r.registration_number, r.full_name, r.metadata,
             a.name AS activity_name
      FROM registrations r
      JOIN activities a ON a.id = r.activity_id
      WHERE r.qr_token = ${token}
      LIMIT 1
    `
    if (rows.length > 0) {
      const row = rows[0]
      registration = {
        id: row.id as number,
        qr_token: row.qr_token as string,
        registration_number: row.registration_number as number,
        full_name: row.full_name as string,
        metadata: (row.metadata ?? {}) as Record<string, unknown>,
        activity_name: row.activity_name as string,
      }
    }
  } catch {
    // DB might not be available yet
  }

  if (!registration) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <span className="text-5xl block">😕</span>
          <p className="mt-4 text-lg font-semibold text-jtq-danger">Registro no encontrado</p>
          <p className="mt-2 text-sm text-jtq-muted">El enlace es inválido o el registro ya no existe.</p>
          <Link href="/" className="mt-6 inline-block btn-primary rounded-xl px-6 py-3 text-sm font-semibold text-white">
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  const folio = generateFolio(registration.id)
  const petType = registration.metadata.pet_type as string
  const petName = registration.metadata.pet_name as string

  return (
    <main className="min-h-screen gradient-hero paw-pattern flex flex-col items-center justify-center px-4 py-8">
      {/* Success Banner */}
      <div className="text-center mb-6 animate-fade-in-up">
        <span className="text-5xl block animate-float">🎉</span>
        <h1 className="mt-3 text-2xl font-bold text-white drop-shadow-md">¡Registro exitoso!</h1>
      </div>

      {/* Digital Pass Card */}
      <div className="w-full max-w-sm animate-fade-in-up delay-200 rounded-2xl overflow-hidden shadow-2xl">
        {/* Pass Header */}
        <div className="bg-white/95 backdrop-blur-sm px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-jtq.png" alt="JTQ" className="h-8 w-auto" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-ctm08.png" alt="CTM 08" className="h-8 w-auto" />
            </div>
            <span className="text-xs font-bold text-jtq-primary uppercase tracking-wider">
              Pase de Registro
            </span>
          </div>

          <div className="mb-3">
            <p className="text-xs text-jtq-muted uppercase tracking-wide">Nombre</p>
            <p className="text-lg font-bold text-jtq-text">{registration.full_name}</p>
          </div>

          <div className="flex gap-6">
            <div>
              <p className="text-xs text-jtq-muted uppercase tracking-wide">Folio</p>
              <p className="text-lg font-bold text-jtq-primary font-mono">{folio}</p>
            </div>
            <div>
              <p className="text-xs text-jtq-muted uppercase tracking-wide">Mascota</p>
              <p className="text-lg font-bold text-jtq-text">
                {petType === "perro" ? "🐶" : "🐱"} {petName || (petType === "perro" ? "Perro" : "Gato")}
              </p>
            </div>
          </div>
        </div>

        {/* Perforation */}
        <div className="relative bg-white/95">
          <div className="border-t-2 border-dashed border-gray-200 relative">
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#059669]" />
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#059669]" />
          </div>
        </div>

        {/* QR Section */}
        <div className="bg-white/95 backdrop-blur-sm px-6 pt-4 pb-6 text-center">
          <QRDisplay token={registration.qr_token} folio={folio} baseUrl={baseUrl} />
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-jtq-text">{registration.activity_name}</p>
            <p className="text-xs text-jtq-muted mt-1">
              {ORGANIZER_NAME} &middot; {ORGANIZER_ORG} &middot; {LOCATION}
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="w-full max-w-sm mt-6 space-y-3 animate-fade-in-up delay-300">
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-jtq-text">
            <span className="font-semibold">📸 Guarda esta pantalla</span> — Toma captura y presenta este pase el día de tu cita.
          </p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-jtq-text">
            <span className="font-semibold">📲 Te contactaremos</span> — Por WhatsApp para confirmar tu fecha.
          </p>
        </div>
        <ShareButton folio={folio} activityName={registration.activity_name} />
      </div>

      <Link href="/" className="mt-6 text-sm text-white/80 underline">Volver al inicio</Link>
    </main>
  )
}
