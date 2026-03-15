import Link from "next/link"
import { ORGANIZER_NAME, ORGANIZER_TITLE, LOCATION, SITE_DOMAIN, TECH_TAGLINE } from "@/lib/constants"
import { DogIllustration, CatIllustration } from "@/components/PetIllustrations"

function CheckIcon() {
  return (
    <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" className="text-emerald-400" />
      <polyline points="22 4 12 14.01 9 11.01" className="text-emerald-400" />
    </svg>
  )
}

function MedicalIcon() {
  return (
    <svg className="w-7 h-7 flex-shrink-0 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-7 h-7 flex-shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="w-5 h-5 inline-block ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function AiIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5Z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      {/* ===== HERO ===== */}
      <section className="gradient-hero-animated paw-pattern relative flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-16 text-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />

        {/* Tech badge */}
        <div className="tech-badge animate-fade-in-up mb-8">
          <AiIcon />
          <span>{TECH_TAGLINE}</span>
        </div>

        {/* Logos */}
        <div className="flex items-center gap-5 animate-fade-in-up delay-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-jtq.png" alt="JTQ" className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-lg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-ctm08.png" alt="CTM 08" className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-lg" />
        </div>

        {/* Main headline */}
        <h1 className="mt-8 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-md leading-tight animate-fade-in-up delay-200">
          Campaña de Esterilización<br />
          <span className="text-amber-300 text-3xl sm:text-4xl md:text-5xl">100% Gratuita</span>
        </h1>

        <p className="mt-5 text-white/70 text-sm sm:text-base max-w-sm leading-relaxed animate-fade-in-up delay-300">
          Cuidando a nuestra comunidad y sus mascotas en {LOCATION}
        </p>

        {/* Pet Illustrations */}
        <div className="flex items-center gap-6 mt-6 animate-fade-in-up delay-200">
          <DogIllustration className="w-24 h-24 sm:w-28 sm:h-28 animate-float drop-shadow-lg" />
          <CatIllustration className="w-24 h-24 sm:w-28 sm:h-28 animate-float drop-shadow-lg" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* CTA */}
        <Link
          href="/r/esterilizacion"
          className="mt-6 btn-primary rounded-xl px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white inline-flex items-center animate-fade-in-up delay-300 animate-pulse-glow"
        >
          Registrar mi mascota
          <ArrowIcon />
        </Link>

        {/* Social proof */}
        <p className="mt-5 text-white/50 text-xs animate-fade-in-up delay-400">
          Plataforma segura con registro digital y QR verificable
        </p>
      </section>

      {/* ===== IMPACT STATS ===== */}
      <section className="section-dark px-4 sm:px-6 py-8">
        <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="stat-card text-center animate-fade-in-up">
            <p className="text-2xl font-extrabold text-blue-400 heading-font">100%</p>
            <p className="text-xs text-jtq-muted mt-1">Gratuito</p>
          </div>
          <div className="stat-card text-center animate-fade-in-up delay-100" style={{ borderLeftColor: '#059669' }}>
            <p className="text-2xl font-extrabold text-emerald-400 heading-font">QR</p>
            <p className="text-xs text-jtq-muted mt-1">Pase digital</p>
          </div>
          <div className="stat-card text-center animate-fade-in-up delay-200" style={{ borderLeftColor: '#f59e0b' }}>
            <p className="text-2xl font-extrabold text-amber-400 heading-font">IA</p>
            <p className="text-xs text-jtq-muted mt-1">Tecnología</p>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="section-darker px-4 sm:px-6 py-10 max-w-lg mx-auto space-y-3">
        <h2 className="text-center text-lg font-bold text-jtq-text mb-6 heading-font">
          Todo lo que necesitas saber
        </h2>

        <div className="glass-card rounded-xl p-5 animate-fade-in-up border-l-4 border-l-emerald-500">
          <div className="flex items-start gap-3">
            <CheckIcon />
            <div>
              <h3 className="font-bold text-jtq-text">Sin costo alguno</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Esterilización completamente gratuita para perros y gatos de la comunidad
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 animate-fade-in-up delay-100 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <MedicalIcon />
            <div>
              <h3 className="font-bold text-jtq-text">Atención profesional</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Atención veterinaria profesional con los más altos estándares de cuidado
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 animate-fade-in-up delay-200 border-l-4 border-l-amber-500">
          <div className="flex items-start gap-3">
            <PhoneIcon />
            <div>
              <h3 className="font-bold text-jtq-text">Te contactamos por WhatsApp</h3>
              <p className="mt-1 text-sm text-jtq-muted">
                Recibe tu fecha y hora por WhatsApp después de registrarte
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-dark py-10 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-bold text-jtq-text mb-8 heading-font">
            ¿Cómo funciona?
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-teal-500 to-emerald-500 rounded-full" />

            <div className="space-y-7">
              <div className="flex items-start gap-4 animate-fade-in-up">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/30 z-10">
                  1
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-jtq-text">Registra a tu mascota</p>
                  <p className="text-sm text-jtq-muted mt-0.5">Llena el formulario con los datos de tu perro o gato en menos de 2 minutos</p>
                </div>
              </div>

              <div className="flex items-start gap-4 animate-fade-in-up delay-100">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-teal-500/30 z-10">
                  2
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-jtq-text">Recibe tu pase digital</p>
                  <p className="text-sm text-jtq-muted mt-0.5">Obtienes un QR único con tu folio de registro al instante</p>
                </div>
              </div>

              <div className="flex items-start gap-4 animate-fade-in-up delay-200">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/30 z-10">
                  3
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-jtq-text">Asiste a tu cita</p>
                  <p className="text-sm text-jtq-muted mt-0.5">Presenta tu pase el día que te indiquemos por WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TECH + COMMUNITY SECTION ===== */}
      <section className="section-darker px-4 sm:px-6 py-10 max-w-lg mx-auto">
        <h2 className="text-center text-lg font-bold text-jtq-text mb-6 heading-font">
          Tecnología al Servicio de la Comunidad
        </h2>

        <div className="rounded-2xl overflow-hidden shadow-lg animate-fade-in-up border border-white/10">
          <div className="gradient-hero p-6 text-center">
            <div className="tech-badge mx-auto mb-4">
              <AiIcon />
              <span>Desarrollado con IA Avanzada</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Esta plataforma fue desarrollada con <span className="font-semibold text-white">Inteligencia Artificial de última generación</span> para servir a nuestra comunidad de manera eficiente, segura y transparente.
            </p>
          </div>
          <div className="bg-[#1e293b] p-5 text-center border-t border-white/10">
            <p className="font-bold text-jtq-text text-base">{ORGANIZER_NAME}</p>
            <p className="text-xs text-jtq-muted mt-1">{ORGANIZER_TITLE}</p>
            <p className="text-xs text-jtq-muted">{LOCATION}</p>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-4 sm:px-6 py-8 max-w-lg mx-auto">
        <div className="gradient-hero rounded-2xl p-8 text-center shadow-lg animate-fade-in-up border border-white/10">
          <h2 className="text-xl font-extrabold text-white heading-font">
            ¡Registra a tu mascota ahora!
          </h2>
          <p className="text-white/70 text-sm mt-2 mb-6">
            Cupos limitados — no esperes más
          </p>
          <Link
            href="/r/esterilizacion"
            className="inline-flex items-center rounded-xl bg-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-jtq-primary shadow-lg hover:shadow-xl transition-all"
          >
            Comenzar registro
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="pb-8 pt-6 text-center space-y-3 border-t border-white/10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="text-xs font-bold text-white/80">CTM Sección 08</span>
          <span className="text-white/30">×</span>
          <span className="text-xs font-bold text-white/80">JEQUIMA</span>
        </div>
        <p className="text-sm font-semibold text-white/90">
          {ORGANIZER_NAME}
        </p>
        <p className="text-xs text-white/50">
          {LOCATION} &middot; {SITE_DOMAIN}
        </p>
        <Link href="/privacidad" className="text-xs text-white/50 underline hover:text-white/70">
          Aviso de Privacidad
        </Link>
      </footer>
    </main>
  )
}
