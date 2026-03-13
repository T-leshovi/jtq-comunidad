import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "JTQ Comunidad — Registro de Campañas",
  description:
    "Plataforma de registro para campañas sociales y humanitarias. Jesús T-leshovi Quiñones · CTM 08 · Cananea, Sonora.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
