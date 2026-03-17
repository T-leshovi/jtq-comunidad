"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface StatsData {
  total_registrations: number
  by_status: {
    registered: number
    confirmed: number
    attended: number
    cancelled: number
    no_show: number
  }
  by_pet_type: {
    perro: number
    gato: number
  }
  by_ownership: {
    own: number
    stray: number
  }
  recent_registrations: {
    id: number
    registration_number: number
    full_name: string
    status: string
    pet_type: string | null
    activity_name: string
    created_at: string
  }[]
  duplicates: {
    phone_groups: number
    phone_registrations: number
    name_groups: number
    name_registrations: number
  }
}

const STATUS_LABELS: Record<string, string> = {
  registered: "Registrado",
  confirmed: "Confirmado",
  attended: "Asistió",
  cancelled: "Cancelado",
  no_show: "No asistió",
}

const STATUS_COLORS: Record<string, string> = {
  registered: "bg-blue-500/20 text-blue-400",
  confirmed: "bg-yellow-500/20 text-yellow-400",
  attended: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
  no_show: "bg-white/10 text-jtq-muted",
}

const DONUT_COLORS: Record<string, string> = {
  registered: "#3b82f6",
  confirmed: "#f59e0b",
  attended: "#22c55e",
  cancelled: "#ef4444",
  no_show: "#64748b",
}

function DonutChart({ data, total }: { data: Record<string, number>; total: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  let offset = 0

  const segments = Object.entries(data).filter(([, v]) => v > 0)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#334155" strokeWidth="12" />
          <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold" fill="#64748b">0</text>
        </svg>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 100 100">
        {segments.map(([key, value]) => {
          const pct = value / total
          const dashLength = pct * circumference
          const dashOffset = -offset * circumference
          offset += pct
          return (
            <circle
              key={key}
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={DONUT_COLORS[key] || "#64748b"}
              strokeWidth="12"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
          )
        })}
        <text x="50" y="46" textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="bold" fill="#f1f5f9">{total}</text>
        <text x="50" y="60" textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#94a3b8">registros</text>
      </svg>
    </div>
  )
}

function PetBar({ perro, gato }: { perro: number; gato: number }) {
  const total = perro + gato
  if (total === 0) return null
  const perroPct = (perro / total) * 100
  const gatoPct = (gato / total) * 100

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-jtq-muted mb-1.5">
        <span className="flex items-center gap-1">
          🐶 Perros: {perro}
        </span>
        <span className="flex items-center gap-1">
          Gatos: {gato} 🐱
        </span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-white/10">
        <div className="bg-amber-600 transition-all" style={{ width: `${perroPct}%` }} />
        <div className="bg-orange-400 transition-all" style={{ width: `${gatoPct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-jtq-muted mt-0.5">
        <span>{perroPct.toFixed(0)}%</span>
        <span>{gatoPct.toFixed(0)}%</span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-24 mb-3" />
      <div className="h-8 bg-white/10 rounded w-16" />
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats")
        if (!res.ok) throw new Error("Error al cargar estadisticas")
        const data = await res.json()
        setStats(data)
      } catch {
        setError("No se pudieron cargar las estadisticas")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-blue-400 hover:underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white heading-font">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/escanear"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <rect x="7" y="7" width="10" height="10" rx="1"/>
            </svg>
            Escanear QR
          </Link>
          <Link
            href="/admin/registros"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-jtq-muted text-sm font-semibold hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Ver registros
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</>
        ) : stats ? (
          <>
            <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg shadow-blue-600/20">
              <p className="text-sm text-blue-200">Total Registros</p>
              <p className="text-4xl font-bold mt-1">{stats.total_registrations}</p>
            </div>
            <div className="glass-card rounded-xl border-l-4 border-l-blue-500 p-5">
              <p className="text-xs text-jtq-muted">Registrados</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{stats.by_status.registered}</p>
            </div>
            <div className="glass-card rounded-xl border-l-4 border-l-yellow-500 p-5">
              <p className="text-xs text-jtq-muted">Confirmados</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.by_status.confirmed}</p>
            </div>
            <div className="glass-card rounded-xl border-l-4 border-l-green-500 p-5">
              <p className="text-xs text-jtq-muted">Asistieron</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{stats.by_status.attended}</p>
            </div>
          </>
        ) : null}
      </div>

      {/* Charts Row */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Donut Chart */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Distribución por Estado</h3>
            <DonutChart data={stats.by_status} total={stats.total_registrations} />
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 justify-center">
              {Object.entries(stats.by_status).filter(([,v]) => v > 0).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1 text-[11px] text-jtq-muted">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[key] }} />
                  {STATUS_LABELS[key] || key}: {value}
                </div>
              ))}
            </div>
          </div>

          {/* Pet Type + Ownership */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Mascotas</h3>
            <PetBar perro={stats.by_pet_type.perro} gato={stats.by_pet_type.gato} />
            <div className="mt-5 pt-4 border-t border-white/10">
              <h4 className="text-xs text-jtq-muted mb-2">Propiedad</h4>
              <div className="flex gap-3">
                <div className="flex-1 text-center bg-blue-500/15 rounded-lg py-2">
                  <p className="text-lg font-bold text-blue-400">{stats.by_ownership.own}</p>
                  <p className="text-[10px] text-blue-400/70">Propias</p>
                </div>
                <div className="flex-1 text-center bg-amber-500/15 rounded-lg py-2">
                  <p className="text-lg font-bold text-amber-400">{stats.by_ownership.stray}</p>
                  <p className="text-[10px] text-amber-400/70">Callejeras</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats + Duplicates */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Otros</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                <span className="text-xs text-red-400">Cancelados</span>
                <span className="text-lg font-bold text-red-400">{stats.by_status.cancelled}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-xs text-jtq-muted">No asistieron</span>
                <span className="text-lg font-bold text-jtq-muted">{stats.by_status.no_show}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                <span className="text-xs text-emerald-400">Tasa de asistencia</span>
                <span className="text-lg font-bold text-emerald-400">
                  {stats.total_registrations > 0
                    ? `${((stats.by_status.attended / stats.total_registrations) * 100).toFixed(0)}%`
                    : "—"}
                </span>
              </div>
            </div>

            {/* Duplicates */}
            {stats.duplicates && (stats.duplicates.phone_groups > 0 || stats.duplicates.name_groups > 0) && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">⚠️ Duplicados</h4>
                  <Link href="/admin/registros?dup=any" className="text-[10px] text-blue-400 hover:underline">Ver todos</Link>
                </div>
                <div className="space-y-2">
                  {stats.duplicates.phone_groups > 0 && (
                    <Link href="/admin/registros?dup=phone" className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg hover:bg-red-500/15 transition-colors">
                      <span className="text-xs text-red-400 flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 font-medium">DUP</span>
                        Mismo telefono
                      </span>
                      <span className="text-sm font-bold text-red-400">{stats.duplicates.phone_registrations}</span>
                    </Link>
                  )}
                  {stats.duplicates.name_groups > 0 && (
                    <Link href="/admin/registros?dup=name" className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg hover:bg-amber-500/15 transition-colors">
                      <span className="text-xs text-amber-400 flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 font-medium">NOMBRE</span>
                        Mismo nombre
                      </span>
                      <span className="text-sm font-bold text-amber-400">{stats.duplicates.name_registrations}</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Registrations */}
      <div className="glass-card rounded-xl">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Últimos Registros</h2>
          <Link href="/admin/registros" className="text-xs text-blue-400 hover:underline">Ver todos</Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="h-4 bg-white/10 rounded w-8" />
                <div className="h-4 bg-white/10 rounded flex-1" />
                <div className="h-5 bg-white/10 rounded w-20" />
              </div>
            ))}
          </div>
        ) : stats?.recent_registrations.length === 0 ? (
          <p className="p-5 text-sm text-jtq-muted text-center">
            No hay registros aún
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {stats?.recent_registrations.map((reg) => (
              <li
                key={reg.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-jtq-muted w-8 shrink-0">
                    #{reg.registration_number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {reg.full_name}
                    </p>
                    <p className="text-xs text-jtq-muted">
                      {reg.pet_type === "perro" ? "🐶" : "🐱"}{" "}
                      {reg.activity_name}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    STATUS_COLORS[reg.status] || "bg-white/10 text-jtq-muted"
                  }`}
                >
                  {STATUS_LABELS[reg.status] || reg.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
