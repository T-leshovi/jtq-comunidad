import Link from "next/link"
import { ORGANIZER_NAME, ORGANIZER_ORG, LOCATION } from "@/lib/constants"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero paw-pattern relative flex flex-col items-center justify-center px-4 pt-12 pb-16 text-center">
        <div className="flex items-center gap-3 animate-fade-in-up">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-jtq.svg" alt="JTQ" className="h-14 w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-ctm08.svg" alt="CTM 08" className="h-14 w-auto" />
        </div>

        <div className="mt-6 animate-fade-in-up delay-100">
          <span className="text-6xl block animate-float">🐾</span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-white drop-shadow-md leading-tight animate-fade-in-up delay-200">
          Campaña de Esterilización<br />
          <span className="text-amber-200">100% Gratuita</span>
        </h1>

        <p className="mt-3 text-white/80 text-sm max-w-xs animate-fade-in-up delay-300">
          Ayuda a controlar la sobrepoblación de animales callejeros en {LOCATION}
        </p>

        <Link
          href="/r/esterilizacion"
          className="mt-8 btn-primary rounded-xl px-8 py-4 text-lg font-bold text-white animate-fade-in-up delay-300"
        >
          Registrar mi mascota 🐶
        </Link>

        <p className="mt-3 text-white/60 text-xs animate-fade-in-up delay-300">
          {ORGANIZER_NAME} &middot; {ORGANIZER_ORG}
        </p>
      </section>

      {/* Benefits */}
      <section className="px-4 -mt-6 max-w-lg mx-auto space-y-3">
        <div className="glass-card rounded-xl p-5 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <h3 className="font-bold text-jtq-text">Sin costo</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Esterilización completamente gratuita para perros y gatos
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 animate-fade-in-up delay-100">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🏥</span>
            <div>
              <h3 className="font-bold text-jtq-text">Personal profesional</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Veterinarios certificados realizan cada procedimiento
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 animate-fade-in-up delay-200">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📲</span>
            <div>
              <h3 className="font-bold text-jtq-text">Te contactamos</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Recibe tu fecha por WhatsApp después de registrarte
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-10 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-lg font-bold text-jtq-text mb-6">
          ¿Cómo funciona?
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-teal-500 to-emerald-500 rounded-full" />

          <div className="space-y-6">
            <div className="flex items-start gap-4 animate-fade-in-up">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md z-10">
                1
              </div>
              <div className="pt-1.5">
                <p className="font-semibold text-jtq-text">Registra a tu mascota</p>
                <p className="text-sm text-jtq-muted mt-0.5">Llena el formulario con los datos de tu perro o gato</p>
              </div>
            </div>

            <div className="flex items-start gap-4 animate-fade-in-up delay-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md z-10">
                2
              </div>
              <div className="pt-1.5">
                <p className="font-semibold text-jtq-text">Recibe tu pase digital</p>
                <p className="text-sm text-jtq-muted mt-0.5">Obtienes un QR único con tu folio de registro</p>
              </div>
            </div>

            <div className="flex items-start gap-4 animate-fade-in-up delay-200">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md z-10">
                3
              </div>
              <div className="pt-1.5">
                <p className="font-semibold text-jtq-text">Asiste a tu cita</p>
                <p className="text-sm text-jtq-muted mt-0.5">Presenta tu pase el día que te indiquemos por WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section className="mt-10 px-4 max-w-lg mx-auto text-center">
        <Link
          href="/r/esterilizacion"
          className="inline-block w-full btn-primary rounded-xl px-6 py-4 text-lg font-bold text-white"
        >
          ¡Quiero registrarme! 🐱
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center space-y-2">
        <p className="text-xs text-jtq-muted">
          {ORGANIZER_NAME} &middot; {ORGANIZER_ORG} &middot; {LOCATION}
        </p>
        <Link href="/privacidad" className="text-xs text-jtq-muted underline">
          Aviso de Privacidad
        </Link>
      </footer>
    </main>
  )
}
