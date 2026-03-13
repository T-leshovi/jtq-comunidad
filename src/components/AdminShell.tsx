"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/registros", label: "Registros", icon: "📋" },
  { href: "/admin/escanear", label: "Escanear QR", icon: "📷" },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch("/api/auth", { method: "DELETE" })
    } catch {
      // ignore
    }
    router.push("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-jtq-border bg-white">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-jtq-border">
          <div className="w-9 h-9 rounded-lg bg-jtq-primary flex items-center justify-center text-white font-bold text-sm">
            JTQ
          </div>
          <span className="font-semibold text-jtq-text">JTQ Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-jtq-primary/10 text-jtq-primary"
                    : "text-jtq-muted hover:bg-gray-100 hover:text-jtq-text"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-jtq-border">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-jtq-danger hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <span className="text-base">🚪</span>
            {loggingOut ? "Cerrando..." : "Cerrar Sesion"}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="flex flex-col flex-1">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-jtq-border bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-jtq-primary flex items-center justify-center text-white font-bold text-xs">
              JTQ
            </div>
            <span className="font-semibold text-sm text-jtq-text">Admin</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-jtq-border px-4 py-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active
                      ? "bg-jtq-primary/10 text-jtq-primary"
                      : "text-jtq-muted hover:bg-gray-100"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-jtq-danger hover:bg-red-50 disabled:opacity-50"
            >
              <span>🚪</span>
              {loggingOut ? "Cerrando..." : "Cerrar Sesion"}
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
