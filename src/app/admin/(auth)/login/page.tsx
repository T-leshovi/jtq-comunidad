"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesion")
        return
      }

      router.push("/admin")
    } catch {
      setError("Error de conexion. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-jtq-border p-8">
          {/* Branding */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-xl bg-jtq-primary flex items-center justify-center text-white font-bold text-xl mb-3">
              JTQ
            </div>
            <h1 className="text-xl font-bold text-jtq-text">JTQ Admin</h1>
            <p className="text-sm text-jtq-muted mt-1">Panel de administracion</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-jtq-danger">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-jtq-text mb-1.5">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-3.5 py-2.5 rounded-lg border border-jtq-border text-sm focus:outline-none focus:ring-2 focus:ring-jtq-primary/30 focus:border-jtq-primary"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-jtq-text mb-1.5">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-jtq-border text-sm focus:outline-none focus:ring-2 focus:ring-jtq-primary/30 focus:border-jtq-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-jtq-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Iniciar Sesion"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-jtq-muted mt-6">
          JTQ Comunidad &middot; Panel Administrativo
        </p>
      </div>
    </div>
  )
}
