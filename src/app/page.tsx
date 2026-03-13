import Link from "next/link"
import JTQHeader from "@/components/JTQHeader"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-lg px-4 pb-12">
      <JTQHeader title="Campaña de Esterilización Gratuita" />

      {/* Hero */}
      <section className="mt-4 text-center">
        <span className="text-5xl" role="img" aria-label="Mascota">
          🐾
        </span>
        <h2 className="mt-3 text-xl font-bold text-jtq-text leading-snug">
          Ayuda a controlar la sobrepoblación de animales callejeros en Cananea
        </h2>
      </section>

      {/* Info cards */}
      <section className="mt-8 space-y-4">
        <div className="rounded-xl border border-jtq-border bg-jtq-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label="Gratuito">
              ✅
            </span>
            <div>
              <h3 className="font-bold text-jtq-text">100% Gratuito</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Esterilización sin costo para tu mascota
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-jtq-border bg-jtq-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label="Mascotas">
              🐶🐱
            </span>
            <div>
              <h3 className="font-bold text-jtq-text">Perros y Gatos</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Registra a tu mascota (una por persona)
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-jtq-border bg-jtq-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label="WhatsApp">
              📲
            </span>
            <div>
              <h3 className="font-bold text-jtq-text">Te avisamos</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Te contactamos por WhatsApp para agendar tu fecha
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-8 text-center">
        <Link
          href="/r/esterilizacion"
          className="inline-block w-full rounded-xl bg-jtq-primary px-6 py-4 text-lg font-bold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Registrar mi mascota
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <Link
          href="/privacidad"
          className="text-sm text-jtq-muted underline"
        >
          Aviso de Privacidad
        </Link>
      </footer>
    </main>
  )
}
