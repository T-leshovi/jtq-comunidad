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
}

const STATUS_LABELS: Record<string, string> = {
  registered: "Registrado",
  confirmed: "Confirmado",
  attended: "Asistió",
  cancelled: "Cancelado",
  no_show: "No asistió",
}

const STATUS_COLORS: Record<string, string> = {
  registered: "bg-blue-100 text-blue-700",
  confirmed: "bg-yellow-100 text-yellow-700",
  attended: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-700",
}

const DONUT_COLORS: Record<string, string> = {
  registered: "#3b82f6",
  confirmed: "#f59e0b",
  attended: "#22c55e",
  cancelled: "#ef4444",
  no_show: "#9ca3af",
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
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold" fill="#9ca3af">0</text>
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
              stroke={DONUT_COLORS[key] || "#9ca3af"}
              strokeWidth="12"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
          )
        })}
        <text x="50" y="46" textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="bold" fill="#1e293b">{total}</text>
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
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#8B5E3C" opacity="0.2"/><text x="100" y="115" textAnchor="middle" fontSize="80">🐶</text></svg>
          Perros: {perro}
        </span>
        <span className="flex items-center gap-1">
          Gatos: {gato}
          <svg className="w-4 h-4" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#F59E0B" opacity="0.2"/><text x="100" y="115" textAnchor="middle" fontSize="80">🐱</text></svg>
        </span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
        <div className="bg-amber-600 transition-all" style={{ width: `${perroPct}%` }} />
        <div className="bg-orange-400 transition-all" style={{ width: `${gatoPct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>{perroPct.toFixed(0)}%</span>
        <span>{gatoPct.toFixed(0)}%</span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-16" />
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
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/escanear"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <rect x="7" y="7" width="10" height="10" rx="1"/>
            </svg>
            Escanear QR
          </Link>
          <Link
            href="/admin/registros"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
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
              <p className="text-sm text-blue-100">Total Registros</p>
              <p className="text-4xl font-bold mt-1">{stats.total_registrations}</p>
            </div>
            <div className="bg-white rounded-xl border-l-4 border-l-blue-500 border border-gray-200 p-5">
              <p className="text-xs text-gray-500">Registrados</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.by_status.registered}</p>
            </div>
            <div className="bg-white rounded-xl border-l-4 border-l-yellow-500 border border-gray-200 p-5">
              <p className="text-xs text-gray-500">Confirmados</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.by_status.confirmed}</p>
            </div>
            <div className="bg-white rounded-xl border-l-4 border-l-green-500 border border-gray-200 p-5">
              <p className="text-xs text-gray-500">Asistieron</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.by_status.attended}</p>
            </div>
          </>
        ) : null}
      </div>

      {/* Charts Row */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Donut Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Distribución por Estado</h3>
            <DonutChart data={stats.by_status} total={stats.total_registrations} />
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 justify-center">
              {Object.entries(stats.by_status).filter(([,v]) => v > 0).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1 text-[11px] text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[key] }} />
                  {STATUS_LABELS[key] || key}: {value}
                </div>
              ))}
            </div>
          </div>

          {/* Pet Type + Ownership */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Mascotas</h3>
            <PetBar perro={stats.by_pet_type.perro} gato={stats.by_pet_type.gato} />
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h4 className="text-xs text-gray-500 mb-2">Propiedad</h4>
              <div className="flex gap-3">
                <div className="flex-1 text-center bg-blue-50 rounded-lg py-2">
                  <p className="text-lg font-bold text-blue-700">{stats.by_ownership.own}</p>
                  <p className="text-[10px] text-blue-500">Propias</p>
                </div>
                <div className="flex-1 text-center bg-amber-50 rounded-lg py-2">
                  <p className="text-lg font-bold text-amber-700">{stats.by_ownership.stray}</p>
                  <p className="text-[10px] text-amber-500">Callejeras</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Otros</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-xs text-red-600">Cancelados</span>
                <span className="text-lg font-bold text-red-700">{stats.by_status.cancelled}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-600">No asistieron</span>
                <span className="text-lg font-bold text-gray-700">{stats.by_status.no_show}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <span className="text-xs text-emerald-600">Tasa de asistencia</span>
                <span className="text-lg font-bold text-emerald-700">
                  {stats.total_registrations > 0
                    ? `${((stats.by_status.attended / stats.total_registrations) * 100).toFixed(0)}%`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Registrations */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Últimos Registros</h2>
          <Link href="/admin/registros" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="h-4 bg-gray-200 rounded w-8" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-5 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : stats?.recent_registrations.length === 0 ? (
          <p className="p-5 text-sm text-gray-400 text-center">
            No hay registros aún
          </p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {stats?.recent_registrations.map((reg) => (
              <li
                key={reg.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-gray-400 w-8 shrink-0">
                    #{reg.registration_number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {reg.full_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {reg.pet_type === "perro" ? "🐶" : "🐱"}{" "}
                      {reg.activity_name}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    STATUS_COLORS[reg.status] || "bg-gray-100 text-gray-700"
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
