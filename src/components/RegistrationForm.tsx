"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { petRegistrationSchema } from "@/lib/schema"
import ConsentCheckbox from "@/components/ConsentCheckbox"
import RiskWaiver from "@/components/RiskWaiver"

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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Nombre completo */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-semibold text-jtq-text mb-1">
          Nombre completo <span className="text-jtq-danger">*</span>
        </label>
        <input
          type="text"
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-jtq-border bg-white px-4 py-3 text-base text-jtq-text placeholder:text-jtq-muted/60 focus:border-jtq-primary focus:ring-2 focus:ring-jtq-primary/20 focus:outline-none"
          placeholder="Tu nombre completo"
          autoComplete="name"
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-jtq-danger">{errors.full_name}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div>
        <label htmlFor="whatsapp" className="block text-sm font-semibold text-jtq-text mb-1">
          WhatsApp <span className="text-jtq-danger">*</span>
        </label>
        <input
          type="tel"
          id="whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full rounded-lg border border-jtq-border bg-white px-4 py-3 text-base text-jtq-text placeholder:text-jtq-muted/60 focus:border-jtq-primary focus:ring-2 focus:ring-jtq-primary/20 focus:outline-none"
          placeholder="5216451234567"
          autoComplete="tel"
          inputMode="tel"
        />
        {errors.whatsapp && (
          <p className="mt-1 text-sm text-jtq-danger">{errors.whatsapp}</p>
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

      {/* Tipo de mascota */}
      <fieldset>
        <legend className="block text-sm font-semibold text-jtq-text mb-2">
          Tipo de mascota <span className="text-jtq-danger">*</span>
        </legend>
        <div className="flex gap-3">
          <label
            className={`flex-1 cursor-pointer rounded-xl border-2 p-4 text-center transition-colors ${
              petType === "perro"
                ? "border-jtq-primary bg-blue-50"
                : "border-jtq-border bg-white"
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
            <span className="text-3xl block">🐶</span>
            <span className="mt-1 block text-sm font-semibold text-jtq-text">
              Perro
            </span>
          </label>
          <label
            className={`flex-1 cursor-pointer rounded-xl border-2 p-4 text-center transition-colors ${
              petType === "gato"
                ? "border-jtq-primary bg-blue-50"
                : "border-jtq-border bg-white"
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
            <span className="text-3xl block">🐱</span>
            <span className="mt-1 block text-sm font-semibold text-jtq-text">
              Gato
            </span>
          </label>
        </div>
        {errors.pet_type && (
          <p className="mt-1 text-sm text-jtq-danger">{errors.pet_type}</p>
        )}
      </fieldset>

      {/* Nombre de la mascota */}
      <div>
        <label htmlFor="pet_name" className="block text-sm font-semibold text-jtq-text mb-1">
          Nombre de la mascota
        </label>
        <input
          type="text"
          id="pet_name"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="w-full rounded-lg border border-jtq-border bg-white px-4 py-3 text-base text-jtq-text placeholder:text-jtq-muted/60 focus:border-jtq-primary focus:ring-2 focus:ring-jtq-primary/20 focus:outline-none"
          placeholder="Déjalo vacío si no tiene nombre"
        />
      </div>

      {/* Propiedad */}
      <fieldset>
        <legend className="block text-sm font-semibold text-jtq-text mb-2">
          Propiedad <span className="text-jtq-danger">*</span>
        </legend>
        <div className="space-y-2">
          <label
            className={`flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-colors ${
              isOwnPet === true
                ? "border-jtq-primary bg-blue-50"
                : "border-jtq-border bg-white"
            }`}
          >
            <input
              type="radio"
              name="is_own_pet"
              checked={isOwnPet === true}
              onChange={() => setIsOwnPet(true)}
              className="h-4 w-4 accent-jtq-primary"
            />
            <span className="text-sm text-jtq-text">Es mi mascota</span>
          </label>
          <label
            className={`flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-colors ${
              isOwnPet === false
                ? "border-jtq-primary bg-blue-50"
                : "border-jtq-border bg-white"
            }`}
          >
            <input
              type="radio"
              name="is_own_pet"
              checked={isOwnPet === false}
              onChange={() => setIsOwnPet(false)}
              className="h-4 w-4 accent-jtq-primary"
            />
            <span className="text-sm text-jtq-text">Es un animal callejero</span>
          </label>
        </div>
      </fieldset>

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

      {/* Submit error */}
      {submitError && (
        <div className="rounded-lg border border-jtq-danger/30 bg-red-50 p-4 text-sm text-jtq-danger">
          {submitError}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full btn-primary rounded-xl px-6 py-4 text-lg font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
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
          "Registrar mi mascota"
        )}
      </button>
    </form>
  )
}
