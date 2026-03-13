import Link from "next/link"
import { getDb } from "@/lib/db"
import JTQHeader from "@/components/JTQHeader"
import QRDisplay from "@/components/QRDisplay"

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function ConfirmacionPage({ params }: PageProps) {
  const { token } = await params

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://jtq-comunidad.vercel.app"

  let registration: { qr_token: string; registration_number: number; full_name: string } | null =
    null

  try {
    const sql = getDb()
    const rows = await sql`
      SELECT qr_token, registration_number, full_name
      FROM registrations
      WHERE qr_token = ${token}
      LIMIT 1
    `
    if (rows.length > 0) {
      const row = rows[0]
      registration = {
        qr_token: row.qr_token as string,
        registration_number: row.registration_number as number,
        full_name: row.full_name as string,
      }
    }
  } catch {
    // DB might not be available yet
  }

  if (!registration) {
    return (
      <main className="mx-auto max-w-lg px-4 pb-12">
        <JTQHeader />
        <div className="mt-8 text-center">
          <span className="text-5xl block" role="img" aria-label="No encontrado">
            😕
          </span>
          <p className="mt-4 text-lg font-semibold text-jtq-danger">
            Registro no encontrado
          </p>
          <p className="mt-2 text-sm text-jtq-muted">
            El enlace es inválido o el registro ya no existe.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-jtq-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-lg px-4 pb-12">
      <JTQHeader />

      <div className="mt-6 text-center">
        <span className="text-5xl block" role="img" aria-label="Confirmado">
          🎉
        </span>
        <h2 className="mt-3 text-xl font-bold text-jtq-success">
          ¡Registro exitoso!
        </h2>
        <p className="mt-1 text-sm text-jtq-muted">
          {registration.full_name}
        </p>
      </div>

      <div className="mt-8">
        <QRDisplay
          token={registration.qr_token}
          registrationNumber={registration.registration_number}
          baseUrl={baseUrl}
        />
      </div>

      <div className="mt-8 space-y-4 rounded-xl border border-jtq-border bg-jtq-card p-5">
        <p className="text-sm text-jtq-text leading-relaxed">
          <span className="font-semibold">📸 Guarda esta pantalla</span> o toma
          una captura de pantalla. Presenta este código QR el día de tu cita.
        </p>
        <p className="text-sm text-jtq-text leading-relaxed">
          <span className="font-semibold">📲 Te contactaremos por WhatsApp</span>{" "}
          al número que proporcionaste para confirmar tu fecha.
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-jtq-muted underline"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
