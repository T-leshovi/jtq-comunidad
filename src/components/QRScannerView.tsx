"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QRScannerViewProps {
  onScan: (decodedText: string) => void
}

export default function QRScannerView({ onScan }: QRScannerViewProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState("")
  const hasScannedRef = useRef(false)

  useEffect(() => {
    let mounted = true

    async function startScanner() {
      if (!containerRef.current) return

      try {
        const scanner = new Html5Qrcode("qr-reader")
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            if (!hasScannedRef.current && mounted) {
              hasScannedRef.current = true
              scanner.stop().catch(() => {})
              onScan(decodedText)
            }
          },
          () => {
            // QR code not detected - ignore
          }
        )
      } catch (err) {
        if (mounted) {
          if (err instanceof Error && err.message.includes("Permission")) {
            setError(
              "Permiso de camara denegado. Permite el acceso a la camara en la configuracion de tu navegador."
            )
          } else {
            setError(
              "No se pudo acceder a la camara. Verifica que tu dispositivo tenga una camara disponible."
            )
          }
        }
      }
    }

    startScanner()

    return () => {
      mounted = false
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [onScan])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-900 text-center p-6">
        <span className="text-3xl mb-3">📷</span>
        <p className="text-sm text-gray-300">{error}</p>
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      <div id="qr-reader" className="w-full" />
      <p className="text-center text-xs text-gray-400 py-2 bg-gray-900">
        Apunta la camara al codigo QR
      </p>
    </div>
  )
}
