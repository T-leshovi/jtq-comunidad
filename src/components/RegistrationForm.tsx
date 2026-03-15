"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { petRegistrationSchema } from "@/lib/schema"
import ConsentCheckbox from "@/components/ConsentCheckbox"
import RiskWaiver from "@/components/RiskWaiver"
import { DogIllustration, CatIllustration } from "@/components/PetIllustrations"

interface RegistrationFormProps {
  activitySlug: string
}

interface FormErrors {
  [key: string]: string | undefined
}

export default function RegistrationForm({ activitySlug }: RegistrationFormProps) {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [contactConsent, setContactConsent] = useState(false)
  const [petType, setPetType] = useState<"perro" | "gato" | "">("")
  const [petName, setPetName] = useState("")
  const [isOwnPet, setIsOwnPet] = useState<boolean | null>(null)
  const [isAdult, setIsAdult] = useState(false)
  const [riskConsent, setRiskConsent] = useState(false)

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setSubmitError("")

    const formData = {
      full_name: fullName.trim(),
      whatsapp: whatsapp.trim(),
      contact_consent: contactConsent,
      pet_type: petType || undefined,
      pet_name: petName.trim() || "",
      is_own_pet: isOwnPet ?? false,
      is_adult: isAdult,
      risk_consent: riskConsent,
    }

    const result = petRegistrationSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          activity_slug: activitySlug,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setSubmitError(
            "Este número de WhatsApp ya fue registrado en esta campaña. Si necesitas ayuda, contáctanos."
          )
        } else {
          setSubmitError(data.error || "Ocurrió un error. Intenta de nuevo.")
        }
        return
      }

      router.push(`/confirmacion/${data.qr_token}`)
    } catch {
      setSubmitError("Error de conexión. Verifica tu internet e intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* === SECCIÓN: Datos personales === */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Tus datos
        </h3>

        {/* Nombre completo */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-1">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
            placeholder="Tu nombre completo"
            autoComplete="name"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-slate-700 mb-1">
            WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
            placeholder="5216451234567"
            autoComplete="tel"
            inputMode="tel"
          />
          {errors.whatsapp && (
            <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
          )}
        </div>

        {/* Contact consent */}
        <ConsentCheckbox
          id="contact-consent"
          label="Autorizo que me contacten por WhatsApp para coordinar la cita de esterilización."
          checked={contactConsent}
          onChange={setContactConsent}
          error={errors.contact_consent}
          showPrivacyLink
        />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* === SECCIÓN: Tu mascota === */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="17" rx="4" ry="5"/><ellipse cx="6" cy="9" rx="2.5" ry="3"/><ellipse cx="18" cy="9" rx="2.5" ry="3"/><ellipse cx="8" cy="14" rx="2" ry="2.5"/><ellipse cx="16" cy="14" rx="2" ry="2.5"/></svg>
          Tu mascota
        </h3>

        {/* Tipo de mascota */}
        <fieldset>
          <legend className="block text-sm font-semibold text-slate-700 mb-2">
            Tipo de mascota <span className="text-red-500">*</span>
          </legend>
          <div className="flex gap-3">
            <label
              className={`flex-1 cursor-pointer rounded-xl border-2 p-5 text-center transition-all hover:scale-[1.02] relative ${
                petType === "perro"
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="pet_type"
                value="perro"
                checked={petType === "perro"}
                onChange={() => setPetType("perro")}
                className="sr-only"
              />
              {petType === "perro" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
              <DogIllustration className="w-20 h-20 mx-auto" />
              <span className="mt-2 block text-sm font-bold text-slate-800">
                Perro
              </span>
            </label>
            <label
              className={`flex-1 cursor-pointer rounded-xl border-2 p-5 text-center transition-all hover:scale-[1.02] relative ${
                petType === "gato"
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="pet_type"
                value="gato"
                checked={petType === "gato"}
                onChange={() => setPetType("gato")}
                className="sr-only"
              />
              {petType === "gato" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
              <CatIllustration className="w-20 h-20 mx-auto" />
              <span className="mt-2 block text-sm font-bold text-slate-800">
                Gato
              </span>
            </label>
          </div>
          {errors.pet_type && (
            <p className="mt-1 text-sm text-red-600">{errors.pet_type}</p>
          )}
        </fieldset>

        {/* Nombre de la mascota */}
        <div>
          <label htmlFor="pet_name" className="block text-sm font-semibold text-slate-700 mb-1">
            Nombre de la mascota
          </label>
          <input
            type="text"
            id="pet_name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
            placeholder="Déjalo vacío si no tiene nombre"
          />
        </div>

        {/* Propiedad */}
        <fieldset>
          <legend className="block text-sm font-semibold text-slate-700 mb-2">
            Propiedad <span className="text-red-500">*</span>
          </legend>
          <div className="space-y-2">
            <label
              className={`flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-all ${
                isOwnPet === true
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="is_own_pet"
                checked={isOwnPet === true}
                onChange={() => setIsOwnPet(true)}
                className="h-4 w-4 accent-blue-600"
              />
              <span className="text-sm text-slate-700">Es mi mascota</span>
            </label>
            <label
              className={`flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-all ${
                isOwnPet === false
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="is_own_pet"
                checked={isOwnPet === false}
                onChange={() => setIsOwnPet(false)}
                className="h-4 w-4 accent-blue-600"
              />
              <span className="text-sm text-slate-700">Es un animal callejero</span>
            </label>
          </div>
        </fieldset>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* === SECCIÓN: Consentimientos === */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Consentimientos
        </h3>

        {/* Mayor de edad */}
        <ConsentCheckbox
          id="is-adult"
          label="Confirmo que soy mayor de 18 años o estoy acompañado por un adulto responsable"
          checked={isAdult}
          onChange={setIsAdult}
          error={errors.is_adult}
        />

        {/* Risk waiver */}
        <RiskWaiver
          checked={riskConsent}
          onChange={setRiskConsent}
          error={errors.risk_consent}
        />
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full btn-primary rounded-xl px-6 py-4 text-lg font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Registrando...
          </span>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="17" rx="4" ry="5"/><ellipse cx="6" cy="9" rx="2.5" ry="3"/><ellipse cx="18" cy="9" rx="2.5" ry="3"/><ellipse cx="8" cy="14" rx="2" ry="2.5"/><ellipse cx="16" cy="14" rx="2" ry="2.5"/></svg>
            Registrar mi mascota
          </>
        )}
      </button>
    </form>
  )
}
