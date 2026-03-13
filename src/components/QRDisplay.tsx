"use client"

import { QRCodeSVG } from "qrcode.react"

interface QRDisplayProps {
  token: string
  folio: string
  baseUrl: string
}

export default function QRDisplay({
  token,
  folio,
  baseUrl,
}: QRDisplayProps) {
  const qrValue = `${baseUrl}/verificar/${token}`

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl bg-white p-3">
        <QRCodeSVG
          value={qrValue}
          size={180}
          level="M"
          includeMargin={false}
        />
      </div>
      <p className="text-sm font-mono font-bold text-jtq-primary tracking-wider">
        {folio}
      </p>
    </div>
  )
}
