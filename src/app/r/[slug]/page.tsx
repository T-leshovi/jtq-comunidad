import Link from "next/link"
import RegistrationForm from "@/components/RegistrationForm"
import { ORGANIZER_NAME, ORGANIZER_ORG, LOCATION } from "@/lib/constants"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Hardcoded activity config while DB may not be ready
const ACTIVITIES: Record<string, { name: string; description: string }> = {
  esterilizacion: {
    name: "Campaña de Esterilización Gratuita",
    description:
      "Te contactaremos por WhatsApp para agendar tu fecha (probablemente sábado). Llega 30 min antes con tu mascota. Una mascota por persona.",
  },
}

export default async function RegistrationPage({ params }: PageProps) {
  const { slug } = await params

  const activity = ACTIVITIES[slug]

  if (!activity) {
    return (
      <main className="min-h-screen gradient-hero paw-pattern flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <span className="text-5xl block">😕</span>
          <p className="mt-4 text-lg font-semibold text-white">Actividad no encontrada</p>
          <p className="mt-2 text-sm text-white/70">
            La actividad que buscas no existe o ya no está disponible.
          </p>
          <Link href="/" className="mt-6 inline-block btn-primary rounded-xl px-6 py-3 text-sm font-semibold text-white">
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen gradient-hero paw-pattern px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-jtq.svg" alt="JTQ" className="h-10 w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-ctm08.svg" alt="CTM 08" className="h-10 w-auto" />
        </div>
        <h1 className="mt-3 text-xl font-bold text-white drop-shadow-md">
          {activity.name}
        </h1>
        <p className="mt-1 text-xs text-white/70">
          {ORGANIZER_NAME} &middot; {ORGANIZER_ORG} &middot; {LOCATION}
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-lg mx-auto animate-fade-in-up delay-200">
        {/* Info banner */}
        <div className="glass-card rounded-t-2xl px-5 pt-5 pb-3 border-b border-amber-200/30">
          <p className="text-sm text-jtq-text leading-relaxed">
            <span className="font-semibold">ℹ️ Importante:</span>{" "}
            {activity.description}
          </p>
        </div>

        {/* Form */}
        <div className="glass-card rounded-b-2xl px-5 pt-4 pb-6">
          <RegistrationForm activitySlug={slug} />
        </div>
      </div>

      {/* Back link */}
      <div className="text-center mt-6">
        <Link href="/" className="text-sm text-white/80 underline">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
