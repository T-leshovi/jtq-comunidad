"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"

interface OtherRegistration {
  registration_id: number
  registration_number: number
  folio: string
  pet_type: string | null
  pet_name: string | null
}

interface Assignment {
  id: number
  registration_id: number
  registration_number: number
  folio: string
  full_name: string
  whatsapp: string
  outcome: string
  attempts: number
  pet_type: string | null
  pet_name: string | null
  is_own_pet: boolean | null
  recall_after: string | null
  other_registrations: OtherRegistration[]
}

interface NextResponse {
  assignment: Assignment | null
  global_confirmed: number
  global_target: number
  is_phase2: boolean
  message?: string
}

interface OwnStats {
  confirmed: number
  no_answer: number
  rejected: number
  pending: number
  recall: number
  contacted: number
  total: number
}

const POLL_MS = 10_000

function whatsappLink(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  return `https://wa.me/${digits.startsWith("52") ? digits : `52${digits}`}`
}

export default function CallerPage() {
  const [data, setData] = useState<NextResponse | null>(null)
  const [own, setOwn] = useState<OwnStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [slotDay, setSlotDay] = useState<1 | 2>(1)
  const [slotTime, setSlotTime] = useState("")
  const [notes, setNotes] = useState("")

  const loadNext = useCallback(async () => {
    try {
      const res = await fetch("/api/caller/next", { cache: "no-store" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Error al cargar siguiente")
      }
      const json = (await res.json()) as NextResponse
      setData(json)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/caller/stats", { cache: "no-store" })
      if (res.ok) {
        const json = await res.json()
        setOwn(json.own as OwnStats)
        // Refresh global from this endpoint too, in case /next is stuck on the same assignment.
        setData((prev) =>
          prev
            ? {
                ...prev,
                global_confirmed: json.global.confirmed as number,
                global_target: json.global.target as number,
                is_phase2: json.global.is_phase2 as boolean,
              }
            : prev
        )
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    loadNext()
    loadStats()
    const id = setInterval(loadStats, POLL_MS)
    return () => clearInterval(id)
  }, [loadNext, loadStats])

  async function handleSkip() {
    if (!data?.assignment) return
    if (!confirm("¿Pasar esta persona a otra colaboradora? El sistema elegirá a la que tenga menos pendientes.")) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch(`/api/caller/skip/${data.assignment.id}`, { method: "POST" })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "No se pudo reasignar")
        return
      }
      await Promise.all([loadNext(), loadStats()])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setSubmitting(false)
    }
  }

  async function submitOutcome(outcome: "confirmed" | "no_answer" | "rejected" | "recall") {
    if (!data?.assignment) return
    setSubmitting(true)
    setError("")
    try {
      const body: Record<string, unknown> = { outcome }
      if (outcome === "confirmed") {
        body.slot_day = slotDay
        body.slot_time = slotTime
        body.notes = notes || null
      } else if (notes) {
        body.notes = notes
      }
      const res = await fetch(`/api/caller/outcome/${data.assignment.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Error al guardar")
        return
      }
      setConfirmOpen(false)
      setSlotTime("")
      setNotes("")
      await Promise.all([loadNext(), loadStats()])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setSubmitting(false)
    }
  }

  function handleConfirmSubmit(e: FormEvent) {
    e.preventDefault()
    if (!slotTime) {
      setError("Ingresa la hora del slot")
      return
    }
    submitOutcome("confirmed")
  }

  const phase2 = data?.is_phase2 ?? false
  const globalConfirmed = data?.global_confirmed ?? 0
  const globalTarget = data?.global_target ?? 90

  return (
    <div className="space-y-5">
      {/* Counter strip */}
      <div className="glass-card rounded-xl p-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-jtq-muted">Tuyas</p>
          <p className="text-xl font-bold text-blue-400">
            {own?.contacted ?? "—"}/<span className="text-white/60">{own?.total ?? "—"}</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-jtq-muted">Tus confirmadas</p>
          <p className="text-xl font-bold text-emerald-400">{own?.confirmed ?? "—"}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-jtq-muted">Global</p>
          <p className="text-xl font-bold text-yellow-400">
            {globalConfirmed}/<span className="text-white/60">{globalTarget}</span>
          </p>
        </div>
      </div>

      {/* Phase banner */}
      <div
        className={`rounded-xl p-4 border ${
          phase2
            ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
            : "bg-jtq-primary/10 border-jtq-primary/30 text-blue-200"
        }`}
      >
        {phase2 ? (
          <div>
            <p className="font-semibold text-amber-300">Fase 2 — Reserva backup</p>
            <p className="text-xs mt-1 text-amber-200/80">
              Ya completamos 90 confirmados. A partir de aquí estás llamando para waitlist:
              dile a la persona que entrará solo si alguien cancela. Tono empático.
            </p>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-blue-300">Fase 1 — Confirma asistencia</p>
            <p className="text-xs mt-1 text-blue-200/80">
              Quedan {Math.max(0, globalTarget - globalConfirmed)} confirmaciones. Pregunta día (1 o 2)
              y hora preferida; recuérdale llegar 30 min antes con su mascota.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card rounded-xl p-6 animate-pulse">
          <div className="h-5 bg-white/10 rounded w-1/2 mb-3" />
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-4 bg-white/10 rounded w-2/3" />
        </div>
      ) : !data?.assignment ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-jtq-muted">{data?.message ?? "Sin asignaciones por ahora."}</p>
          <button
            onClick={() => loadNext()}
            className="mt-4 text-sm text-blue-400 hover:underline"
          >
            Recargar
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-jtq-muted">
              Registro #{data.assignment.registration_number}
              {data.assignment.attempts > 0 && (
                <span className="ml-2 text-amber-400">· intento {data.assignment.attempts + 1}</span>
              )}
            </p>
            <h2 className="text-xl font-bold text-white mt-0.5 break-words">
              {data.assignment.full_name}
            </h2>
            <a
              href={whatsappLink(data.assignment.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-emerald-400 hover:text-emerald-300 text-sm font-mono"
            >
              {data.assignment.whatsapp}
            </a>
          </div>

          {/* Folio destacado para que el caller lo lea a la persona */}
          <div className="rounded-lg border border-jtq-primary/40 bg-jtq-primary/10 px-3 py-3">
            <p className="text-[10px] uppercase tracking-wide text-blue-300/80">
              Folio para esta cita
            </p>
            <p className="text-2xl font-mono font-bold text-blue-200 mt-0.5 tracking-wider">
              {data.assignment.folio}
            </p>
            <p className="text-[11px] text-blue-200/70 mt-1">
              Dile a la persona: <strong>“Tu folio es {data.assignment.folio}. Llévalo el día de la jornada con la mascota de este registro.”</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white/5 rounded-lg p-2.5">
              <p className="text-[10px] uppercase text-jtq-muted">Mascota Fase 1</p>
              <p className="text-white">
                {data.assignment.pet_type === "perro" ? "🐶 Perro" : "🐱 Gato"}
                {data.assignment.pet_name ? ` — ${data.assignment.pet_name}` : ""}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5">
              <p className="text-[10px] uppercase text-jtq-muted">Propiedad</p>
              <p className="text-white">
                {data.assignment.is_own_pet === false ? "Callejera" : "Propia"}
              </p>
            </div>
          </div>

          {/* Mascotas adicionales del mismo teléfono — Fase 2/3 */}
          {data.assignment.other_registrations && data.assignment.other_registrations.length > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-3">
              <p className="text-xs font-semibold text-amber-300">
                ⚠️ Esta persona registró {data.assignment.other_registrations.length + 1} mascotas
              </p>
              <p className="text-[11px] text-amber-200/80 mt-1">
                Solo confirma la de arriba en esta llamada. Las siguientes irán a otra fase — díselo:
                <em> “En esta jornada solo podemos atender una mascota por persona. Las demás te las llamaremos para otra fase.”</em>
              </p>
              <ul className="mt-2 space-y-1">
                {data.assignment.other_registrations.map((o) => (
                  <li
                    key={o.registration_id}
                    className="flex items-center justify-between text-xs bg-amber-500/5 rounded px-2 py-1.5"
                  >
                    <span className="text-amber-100">
                      {o.pet_type === "perro" ? "🐶" : "🐱"}
                      {o.pet_name ? ` ${o.pet_name}` : ""}
                      <span className="text-amber-200/60 ml-1">(#{o.registration_number})</span>
                    </span>
                    <span className="font-mono text-amber-200">{o.folio}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4 outcome buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={submitting}
              className="py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-50 text-base"
            >
              ✅ Confirma
            </button>
            <button
              onClick={() => submitOutcome("no_answer")}
              disabled={submitting}
              className="py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold disabled:opacity-50 text-base"
            >
              ❌ No contesta
            </button>
            <button
              onClick={() => submitOutcome("rejected")}
              disabled={submitting}
              className="py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-50 text-base"
            >
              🚫 Rechaza
            </button>
            <button
              onClick={() => submitOutcome("recall")}
              disabled={submitting}
              className="py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 text-base"
            >
              🔄 Re-llamar
            </button>
          </div>

          <button
            onClick={handleSkip}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 disabled:opacity-50"
            title="Pasa esta persona a la colaboradora con menos pendientes"
          >
            🔁 Pasar a otra colaboradora
          </button>

          {/* Optional notes input (visible always for quick tagging) */}
          <textarea
            placeholder="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-jtq-primary/40"
          />
        </div>
      )}

      {/* Confirm modal */}
      {confirmOpen && data?.assignment && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md glass-card rounded-2xl p-5 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-white">Confirmar asistencia</h3>
              <p className="text-xs text-jtq-muted mt-0.5">
                {data.assignment.full_name} — {data.assignment.whatsapp}
              </p>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-jtq-muted mb-1.5">Día de jornada</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSlotDay(d as 1 | 2)}
                      className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        slotDay === d
                          ? "bg-jtq-primary/20 border-jtq-primary/50 text-blue-300"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      Día {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="slot_time" className="block text-xs text-jtq-muted mb-1.5">
                  Hora preferida (HH:MM)
                </label>
                <input
                  id="slot_time"
                  type="text"
                  pattern="^\d{1,2}:\d{2}$"
                  placeholder="10:30"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-jtq-primary/40"
                />
                <p className="text-[10px] text-jtq-muted mt-1">
                  Día 1: 9:00–14:00 · Día 2: 8:00–14:00. Pídele llegar 30 min antes.
                </p>
              </div>

              <div>
                <label className="block text-xs text-jtq-muted mb-1.5">Notas</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles relevantes (raza, condición de salud, etc.)"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-jtq-primary/40"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
