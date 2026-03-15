import Link from "next/link"
import { getDb } from "@/lib/db"
import { generateFolio } from "@/lib/folio"
import { ORGANIZER_NAME, LOCATION, COLLABORATOR_ORG } from "@/lib/constants"
import QRDisplay from "@/components/QRDisplay"
import ShareButton from "@/components/ShareButton"
import { DogIllustration, CatIllustration } from "@/components/PetIllustrations"

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
        <div className="flex items-center justify-center gap-3">
          <DogIllustration className="w-14 h-14 animate-float" />
          <div className="confetti-burst">
            <svg className="w-12 h-12 text-amber-300 animate-scale-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
            </svg>
          </div>
          <CatIllustration className="w-14 h-14 animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white drop-shadow-md">¡Registro exitoso!</h1>
      </div>

      {/* Digital Pass Card */}
      <div className="w-full max-w-sm animate-fade-in-up delay-200 rounded-2xl overflow-hidden shadow-2xl">
        {/* Branding Strip */}
        <div className="gradient-pass px-4 py-2.5 flex items-center justify-center gap-2">
          <span className="text-[11px] font-bold text-white/90 tracking-wider uppercase">{COLLABORATOR_ORG}</span>
          <span className="text-white/40">×</span>
          <span className="text-[11px] font-bold text-white/90 tracking-wider uppercase">JEQUIMA</span>
        </div>

        {/* Pass Header */}
        <div className="bg-white/95 backdrop-blur-sm px-6 pt-5 pb-4 paw-watermark relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-jtq.png" alt="JTQ" className="h-12 sm:h-14 w-auto" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-ctm08.png" alt="CTM 08" className="h-12 sm:h-14 w-auto" />
            </div>
            <span className="text-[10px] font-bold text-jtq-primary uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">
              Pase de Registro
            </span>
          </div>

          <div className="mb-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Nombre</p>
            <p className="text-lg font-bold text-gray-900">{registration.full_name}</p>
          </div>

          <div className="flex items-center gap-5">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Folio</p>
              <span className="inline-block mt-0.5 text-sm font-bold text-white bg-blue-600 px-3 py-1 rounded-full font-mono">{folio}</span>
            </div>
            <div className="flex items-center gap-2">
              {petType === "perro" ? (
                <DogIllustration className="w-10 h-10" />
              ) : (
                <CatIllustration className="w-10 h-10" />
              )}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Mascota</p>
                <p className="text-base font-bold text-gray-900">
                  {petName || (petType === "perro" ? "Perro" : "Gato")}
                </p>
              </div>
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
          <div className="inline-block p-1.5 rounded-xl bg-gradient-to-br from-blue-500 via-teal-500 to-emerald-500">
            <div className="bg-white rounded-lg p-1">
              <QRDisplay token={registration.qr_token} folio={folio} baseUrl={baseUrl} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 font-medium">Presenta este pase el día de tu cita</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-800">{registration.activity_name}</p>
            <p className="text-[11px] text-gray-400 mt-1">
              {ORGANIZER_NAME} &middot; {COLLABORATOR_ORG} &middot; {LOCATION}
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
