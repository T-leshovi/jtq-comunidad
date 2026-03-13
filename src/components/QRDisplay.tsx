"use client"

import { QRCodeSVG } from "qrcode.react"

interface QRDisplayProps {
  token: string
  registrationNumber: number
  baseUrl: string
}

export default function QRDisplay({
  token,
  registrationNumber,
  baseUrl,
}: QRDisplayProps) {
  const qrValue = `${baseUrl}/verificar/${token}`

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl border border-jtq-border bg-white p-4 shadow-sm">
        <QRCodeSVG
          value={qrValue}
          size={200}
          level="M"
          includeMargin
        />
      </div>
      <p className="text-3xl font-bold text-jtq-primary">
        #{String(registrationNumber).padStart(4, "0")}
      </p>
      <p className="text-sm text-jtq-muted text-center">
        Presenta este código QR el día de tu cita
      </p>
    </div>
  )
}
