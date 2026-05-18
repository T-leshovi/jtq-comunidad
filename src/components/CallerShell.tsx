"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  name: string
  children: React.ReactNode
}

export default function CallerShell({ name, children }: Props) {
  const router = useRouter()
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
    <div className="min-h-screen bg-[#0a0f1a] flex flex-col">
      <header className="border-b border-white/10 bg-[#0f172a] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-jtq-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-jtq-primary/20">
            JTQ
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Llamadas Phase 1</p>
            <p className="text-xs text-jtq-muted leading-tight">{name}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 border border-red-500/20"
        >
          {loggingOut ? "Cerrando..." : "Salir"}
        </button>
      </header>

      <main className="flex-1 px-4 py-5 md:max-w-2xl md:mx-auto w-full">{children}</main>
    </div>
  )
}
