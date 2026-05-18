"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"

interface CallerRow {
  id: number
  username: string
  name: string
  role: "admin" | "caller"
  active: boolean
  last_login_at: string | null
  confirmed: number
  no_answer: number
  rejected: number
  pending: number
  recall: number
  total_assigned: number
}

interface GlobalStats {
  global_confirmed: number
  global_target: number
  is_phase2: boolean
  total_assignments: number
  per_caller: Array<{ caller_id: number; caller_name: string; confirmed: number; total: number }>
}

export default function CallersAdminPage() {
  const [users, setUsers] = useState<CallerRow[]>([])
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [distributing, setDistributing] = useState(false)
  const [redistributing, setRedistributing] = useState(false)

  // Create form state
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [newName, setNewName] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const [resUsers, resStats] = await Promise.all([
        fetch("/api/admin/callers", { cache: "no-store" }),
        fetch("/api/admin/callers/stats", { cache: "no-store" }),
      ])
      if (!resUsers.ok) throw new Error("Error al cargar usuarios")
      if (!resStats.ok) throw new Error("Error al cargar stats")
      const usersJson = await resUsers.json()
      const statsJson = await resStats.json()
      setUsers(usersJson.users as CallerRow[])
      setStats(statsJson as GlobalStats)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
    const id = setInterval(reload, 15_000)
    return () => clearInterval(id)
  }, [reload])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError("")
    try {
      const res = await fetch("/api/admin/callers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          name: newName,
          password: newPassword,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Error al crear caller")
        return
      }
      setNewUsername("")
      setNewName("")
      setNewPassword("")
      setCreateOpen(false)
      await reload()
    } finally {
      setCreating(false)
    }
  }

  async function toggleActive(id: number, active: boolean) {
    try {
      const res = await fetch(`/api/admin/callers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error || "Error al actualizar")
        return
      }
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    }
  }

  async function handleDistribute() {
    setDistributing(true)
    setError("")
    try {
      const res = await fetch("/api/admin/callers/distribute", { method: "POST" })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Error al distribuir")
        return
      }
      await reload()
    } finally {
      setDistributing(false)
    }
  }

  async function handleRedistribute() {
    if (!confirm("Reasignar todos los pendientes de callers inactivas a las activas. ¿Continuar?")) return
    setRedistributing(true)
    setError("")
    try {
      const res = await fetch("/api/admin/callers/redistribute", { method: "POST" })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Error al reasignar")
        return
      }
      await reload()
      alert(`Reasignados: ${json.moved} registros entre ${json.active_callers} colaboradoras activas`)
    } finally {
      setRedistributing(false)
    }
  }

  const callers = users.filter((u) => u.role === "caller")
  const admins = users.filter((u) => u.role === "admin")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white heading-font">Llamadas — Equipo</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDistribute}
            disabled={distributing || callers.filter((c) => c.active).length === 0}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {distributing ? "Distribuyendo..." : "Distribuir registros"}
          </button>
          <button
            onClick={handleRedistribute}
            disabled={redistributing || callers.filter((c) => c.active).length === 0}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors"
            title="Reasigna los pendientes de callers inactivas a las activas"
          >
            {redistributing ? "Reasignando..." : "Reasignar de inactivas"}
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl btn-primary text-white text-sm font-semibold"
          >
            + Nueva caller
          </button>
        </div>
      </div>

      {/* Global counter */}
      {stats && (
        <div className="glass-card rounded-xl p-5 mb-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-jtq-muted">Confirmados global</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">
              {stats.global_confirmed}
              <span className="text-base text-white/40">/{stats.global_target}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-jtq-muted">Asignados</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.total_assignments}</p>
          </div>
          <div>
            <p className="text-xs text-jtq-muted">Fase</p>
            <p
              className={`text-3xl font-bold mt-1 ${stats.is_phase2 ? "text-amber-400" : "text-blue-400"}`}
            >
              {stats.is_phase2 ? "Fase 2" : "Fase 1"}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Callers table */}
      <div className="glass-card rounded-xl mb-6">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Callers</h2>
        </div>
        {loading && users.length === 0 ? (
          <div className="p-5 text-sm text-jtq-muted">Cargando...</div>
        ) : callers.length === 0 ? (
          <div className="p-5 text-sm text-jtq-muted text-center">
            Aún no hay callers. Crea la primera con el botón superior.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {callers.map((c) => (
              <li key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <p className="text-xs text-jtq-muted">
                    @{c.username} ·{" "}
                    <span className={c.active ? "text-emerald-400" : "text-red-400"}>
                      {c.active ? "Activa" : "Inactiva"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 font-semibold">{c.confirmed}✅</span>
                  <span className="text-amber-400">{c.no_answer + c.recall}❌</span>
                  <span className="text-red-400">{c.rejected}🚫</span>
                  <span className="text-jtq-muted">
                    {c.total_assigned} asign.
                  </span>
                  <button
                    onClick={() => toggleActive(c.id, !c.active)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                      c.active
                        ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                        : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    {c.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Admins reference */}
      {admins.length > 0 && (
        <div className="glass-card rounded-xl">
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white">Administradores</h2>
          </div>
          <ul className="divide-y divide-white/5">
            {admins.map((a) => (
              <li key={a.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{a.name}</p>
                  <p className="text-xs text-jtq-muted">@{a.username}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-jtq-primary/20 text-blue-300">
                  admin
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md glass-card rounded-2xl p-5 space-y-3">
            <h3 className="text-lg font-bold text-white">Nueva caller</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs text-jtq-muted mb-1.5">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-jtq-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs text-jtq-muted mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase().trim())}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-jtq-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs text-jtq-muted mb-1.5">
                  Contraseña inicial (mínimo 6)
                </label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-jtq-primary/40"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-lg btn-primary text-white text-sm font-semibold disabled:opacity-50"
                >
                  {creating ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
