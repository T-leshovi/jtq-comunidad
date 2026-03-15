import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://jtqcomunidad.org"),
  title: "JTQ Comunidad — Registro de Campañas",
  description:
    "Plataforma de registro para campañas sociales y humanitarias. Jesús T-Leshovi Quiñones · Cananea, Sonora. Impulsado por Inteligencia Artificial.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "JTQ Comunidad — Campaña de Esterilización Gratuita",
    description: "Registra a tu mascota para la campaña de esterilización 100% gratuita en Cananea, Sonora.",
    url: "https://jtqcomunidad.org",
    siteName: "JTQ Comunidad",
    locale: "es_MX",
    type: "website",
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
      <body className={`${inter.variable} ${jakarta.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
