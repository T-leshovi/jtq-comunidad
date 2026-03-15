"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import dynamic from "next/dynamic"

const QRScannerView = dynamic(() => import("@/components/QRScannerView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
      <p className="text-sm text-gray-400">Cargando escáner...</p>
    </div>
  ),
})

interface ScanResult {
  type: "success" | "already_attended" | "error"
  registration?: {
    registration_number: number
    folio: string
    full_name: string
    whatsapp: string
    pet_type: string
    pet_name: string
    activity_name: string
    attended_at?: string
  }
  message?: string
}

export default function EscanearPage() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanning, setScanning] = useState(true)
  const [validating, setValidating] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const processedRef = useRef<string | null>(null)

  // Load today's scan count from sessionStorage
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const stored = sessionStorage.getItem(`scan-count-${today}`)
    if (stored) setScanCount(parseInt(stored, 10))
  }, [])

  function incrementScanCount() {
    const today = new Date().toISOString().slice(0, 10)
    const next = scanCount + 1
    setScanCount(next)
    sessionStorage.setItem(`scan-count-${today}`, String(next))
  }

  const handleScan = useCallback(async (decodedText: string) => {
    let token = ""
    try {
      const url = new URL(decodedText)
      token = url.searchParams.get("token") || url.searchParams.get("qr_token") || ""
      if (!token) {
        const segments = url.pathname.split("/").filter(Boolean)
        const lastSegment = segments[segments.length - 1]
        if (lastSegment && /^[0-9a-f-]{36}$/i.test(lastSegment)) {
          token = lastSegment
        }
      }
    } catch {
      if (/^[0-9a-f-]{36}$/i.test(decodedText.trim())) {
        token = decodedText.trim()
      }
    }

    if (!token) {
      setResult({ type: "error", message: "Código QR no válido" })
      setScanning(false)
      return
    }

    if (processedRef.current === token) return
    processedRef.current = token

    setScanning(false)
    setValidating(true)

    try {
      const res = await fetch("/api/validate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_token: token }),
      })

      const data = await res.json()

      if (!res.ok) {
        setResult({ type: "error", message: data.error || "Error desconocido" })
      } else if (data.already_attended) {
        setResult({ type: "already_attended", registration: data.registration })
        playSound("warn")
      } else if (data.success) {
        setResult({ type: "success", registration: data.registration })
        incrementScanCount()
        playSound("ok")
      }
    } catch {
      setResult({ type: "error", message: "Error de conexión" })
    } finally {
      setValidating(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanCount])

  function playSound(type: "ok" | "warn") {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.value = 0.3

      if (type === "ok") {
        osc.frequency.value = 800
        osc.type = "sine"
        osc.start()
        osc.stop(ctx.currentTime + 0.15)
      } else {
        // Double beep for already attended
        osc.frequency.value = 400
        osc.type = "triangle"
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
        setTimeout(() => {
          try {
            const ctx2 = new AudioContext()
            const osc2 = ctx2.createOscillator()
            const gain2 = ctx2.createGain()
            osc2.connect(gain2)
            gain2.connect(ctx2.destination)
            gain2.gain.value = 0.3
            osc2.frequency.value = 400
            osc2.type = "triangle"
            osc2.start()
            osc2.stop(ctx2.currentTime + 0.1)
          } catch { /* */ }
        }, 200)
      }
    } catch {
      // Audio not available
    }
  }

  function resetScanner() {
    setResult(null)
    setScanning(true)
    setValidating(false)
    processedRef.current = null
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Hace un momento"
    if (mins < 60) return `Hace ${mins} min`
    const hrs = Math.floor(mins / 60)
    return `Hace ${hrs}h ${mins % 60}m`
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Event Day Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 mb-5 shadow-lg shadow-emerald-600/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <rect x="7" y="7" width="10" height="10" rx="1"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Modo Escaneo</p>
              <p className="text-xs text-emerald-100">Día del Evento</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{scanCount}</p>
            <p className="text-[10px] text-emerald-100 uppercase tracking-wider">asistencias hoy</p>
          </div>
        </div>
      </div>

      {/* Scanner Area */}
      {scanning && !validating && (
        <div className="rounded-xl overflow-hidden border-2 border-emerald-200 bg-black shadow-lg">
          <QRScannerView onScan={handleScan} />
        </div>
      )}

      {/* Validating */}
      {validating && (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-500">Validando registro...</p>
        </div>
      )}

      {/* Results */}
      {result && !validating && (
        <div className="mt-4">
          {result.type === "success" && result.registration && (
            <div className="rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6 animate-fade-in-up relative overflow-hidden">
              {/* Confetti dots */}
              <div className="confetti-dots absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-confetti"
                    style={{
                      left: `${10 + (i * 7)}%`,
                      top: `-8px`,
                      backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899"][i % 4],
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-green-800">Asistencia Registrada</h2>
                  <p className="text-xs text-green-600">#{result.registration.registration_number}</p>
                </div>
              </div>

              <p className="text-2xl font-bold text-green-900 mb-1 relative z-10">
                {result.registration.full_name}
              </p>
              <span className="inline-block text-sm font-mono font-bold text-white bg-green-600 px-3 py-1 rounded-full mb-3">
                {result.registration.folio}
              </span>

              <div className="space-y-2 text-sm border-t border-green-200 pt-3 relative z-10">
                <p>
                  <span className="text-green-600 font-medium">Mascota:</span>{" "}
                  {result.registration.pet_type === "perro" ? "🐶" : "🐱"}{" "}
                  {result.registration.pet_name || result.registration.pet_type}
                </p>
                <p>
                  <span className="text-green-600 font-medium">WhatsApp:</span>{" "}
                  <a href={`https://wa.me/${result.registration.whatsapp}`} className="text-green-800 underline">
                    {result.registration.whatsapp}
                  </a>
                </p>
                <p className="text-xs text-green-500">{result.registration.activity_name}</p>
              </div>
            </div>
          )}

          {result.type === "already_attended" && result.registration && (
            <div className="rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-yellow-800">Ya asistió</h2>
                  {result.registration.attended_at && (
                    <p className="text-xs font-medium text-yellow-600">{timeAgo(result.registration.attended_at)}</p>
                  )}
                </div>
              </div>

              <p className="text-xl font-bold text-yellow-900 mb-1">
                {result.registration.full_name}
              </p>
              <span className="inline-block text-sm font-mono font-bold text-yellow-800 bg-yellow-200 px-3 py-1 rounded-full mb-3">
                {result.registration.folio}
              </span>

              <div className="space-y-2 text-sm border-t border-yellow-200 pt-3">
                <p>
                  <span className="text-yellow-600 font-medium">Mascota:</span>{" "}
                  {result.registration.pet_type === "perro" ? "🐶" : "🐱"}{" "}
                  {result.registration.pet_name || result.registration.pet_type}
                </p>
                <p>
                  <span className="text-yellow-600 font-medium">WhatsApp:</span>{" "}
                  {result.registration.whatsapp}
                </p>
                {result.registration.attended_at && (
                  <p className="text-xs text-yellow-600">
                    Registrado: {new Date(result.registration.attended_at).toLocaleString("es-MX")}
                  </p>
                )}
              </div>
            </div>
          )}

          {result.type === "error" && (
            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-red-800">Error</h2>
              </div>
              <p className="text-sm text-red-700">
                {result.message || "Ocurrió un error al validar el QR"}
              </p>
            </div>
          )}

          <button
            onClick={resetScanner}
            className="w-full mt-4 py-4 rounded-xl bg-emerald-600 text-white text-base font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <rect x="7" y="7" width="10" height="10" rx="1"/>
            </svg>
            Escanear otro
          </button>
        </div>
      )}
    </div>
  )
}
