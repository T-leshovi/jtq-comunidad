"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import dynamic from "next/dynamic"

const QRScannerView = dynamic(() => import("@/components/QRScannerView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
      <p className="text-sm text-jtq-muted">Cargando escaner...</p>
    </div>
  ),
})

interface ScanResult {
  type: "success" | "already_attended" | "error"
  registration?: {
    registration_number: number
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
  const processedRef = useRef<string | null>(null)

  const handleScan = useCallback(async (decodedText: string) => {
    // Extract qr_token from URL or raw UUID
    let token = ""
    try {
      const url = new URL(decodedText)
      // Try to get token from URL params or path
      token = url.searchParams.get("token") || url.searchParams.get("qr_token") || ""
      if (!token) {
        // Check if last path segment is a UUID
        const segments = url.pathname.split("/").filter(Boolean)
        const lastSegment = segments[segments.length - 1]
        if (lastSegment && /^[0-9a-f-]{36}$/i.test(lastSegment)) {
          token = lastSegment
        }
      }
    } catch {
      // Not a URL, check if it's a raw UUID
      if (/^[0-9a-f-]{36}$/i.test(decodedText.trim())) {
        token = decodedText.trim()
      }
    }

    if (!token) {
      setResult({ type: "error", message: "Codigo QR no valido" })
      setScanning(false)
      return
    }

    // Prevent duplicate processing
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
        setResult({
          type: "already_attended",
          registration: data.registration,
        })
        playSound("warn")
      } else if (data.success) {
        setResult({
          type: "success",
          registration: data.registration,
        })
        playSound("ok")
      }
    } catch {
      setResult({ type: "error", message: "Error de conexion" })
    } finally {
      setValidating(false)
    }
  }, [])

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
      } else {
        osc.frequency.value = 400
        osc.type = "triangle"
      }

      osc.start()
      osc.stop(ctx.currentTime + 0.15)
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

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-jtq-text mb-6">Escanear QR</h1>

      {/* Scanner Area */}
      {scanning && !validating && (
        <div className="rounded-xl overflow-hidden border border-jtq-border bg-black">
          <QRScannerView onScan={handleScan} />
        </div>
      )}

      {/* Validating */}
      {validating && (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-jtq-border">
          <div className="w-8 h-8 border-3 border-jtq-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-jtq-muted">Validando registro...</p>
        </div>
      )}

      {/* Results */}
      {result && !validating && (
        <div className="mt-4">
          {result.type === "success" && result.registration && (
            <div className="rounded-xl border-2 border-green-300 bg-green-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h2 className="text-lg font-bold text-green-800">
                  Asistencia Registrada
                </h2>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-green-700 font-medium">Nombre:</span>{" "}
                  <span className="text-green-900 font-semibold">
                    {result.registration.full_name}
                  </span>
                </p>
                <p>
                  <span className="text-green-700 font-medium">Registro:</span>{" "}
                  #{result.registration.registration_number}
                </p>
                <p>
                  <span className="text-green-700 font-medium">Mascota:</span>{" "}
                  {result.registration.pet_type === "perro" ? "🐶" : "🐱"}{" "}
                  {result.registration.pet_name || result.registration.pet_type}
                </p>
              </div>
            </div>
          )}

          {result.type === "already_attended" && result.registration && (
            <div className="rounded-xl border-2 border-yellow-300 bg-yellow-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚠️</span>
                <h2 className="text-lg font-bold text-yellow-800">
                  Ya se registro la asistencia anteriormente
                </h2>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-yellow-700 font-medium">Nombre:</span>{" "}
                  <span className="text-yellow-900 font-semibold">
                    {result.registration.full_name}
                  </span>
                </p>
                <p>
                  <span className="text-yellow-700 font-medium">Registro:</span>{" "}
                  #{result.registration.registration_number}
                </p>
                {result.registration.attended_at && (
                  <p>
                    <span className="text-yellow-700 font-medium">Asistio:</span>{" "}
                    {new Date(result.registration.attended_at).toLocaleString("es-MX")}
                  </p>
                )}
              </div>
            </div>
          )}

          {result.type === "error" && (
            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">❌</span>
                <h2 className="text-lg font-bold text-red-800">Error</h2>
              </div>
              <p className="text-sm text-red-700">
                {result.message || "Ocurrio un error al validar el QR"}
              </p>
            </div>
          )}

          <button
            onClick={resetScanner}
            className="w-full mt-4 py-3 rounded-lg bg-jtq-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Escanear otro
          </button>
        </div>
      )}
    </div>
  )
}
