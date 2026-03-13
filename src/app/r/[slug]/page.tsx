import JTQHeader from "@/components/JTQHeader"
import RegistrationForm from "@/components/RegistrationForm"

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
      <main className="mx-auto max-w-lg px-4 pb-12">
        <JTQHeader />
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-jtq-danger">
            Actividad no encontrada
          </p>
          <p className="mt-2 text-sm text-jtq-muted">
            La actividad que buscas no existe o ya no está disponible.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-lg px-4 pb-12">
      <JTQHeader title={activity.name} />

      {/* Info banner */}
      <div className="mt-4 rounded-xl border border-jtq-accent/30 bg-amber-50 p-4">
        <p className="text-sm text-jtq-text leading-relaxed">
          <span className="font-semibold">ℹ️ Importante:</span>{" "}
          {activity.description}
        </p>
      </div>

      {/* Form */}
      <div className="mt-6">
        <RegistrationForm activitySlug={slug} />
      </div>
    </main>
  )
}
