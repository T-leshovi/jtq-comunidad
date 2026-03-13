"use client"

import { useEffect, useState } from "react"

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
  attended: "Asistio",
  cancelled: "Cancelado",
}

const STATUS_COLORS: Record<string, string> = {
  registered: "bg-blue-100 text-blue-700",
  confirmed: "bg-yellow-100 text-yellow-700",
  attended: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-jtq-border p-5">
      <p className="text-sm text-jtq-muted">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent || "text-jtq-text"}`}>
        {value}
      </p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-jtq-border p-5 animate-pulse">
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
        <p className="text-jtq-danger">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-jtq-primary hover:underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-jtq-text mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : stats ? (
          <>
            <div className="col-span-2 lg:col-span-1 bg-white rounded-xl border border-jtq-border p-5">
              <p className="text-sm text-jtq-muted">Total Registros</p>
              <p className="text-4xl font-bold text-jtq-primary mt-1">
                {stats.total_registrations}
              </p>
            </div>
            <StatCard
              label="Registrados"
              value={stats.by_status.registered}
              accent="text-blue-600"
            />
            <StatCard
              label="Confirmados"
              value={stats.by_status.confirmed}
              accent="text-yellow-600"
            />
            <StatCard
              label="Asistieron"
              value={stats.by_status.attended}
              accent="text-green-600"
            />
          </>
        ) : null}
      </div>

      {/* Secondary Stats */}
      {!loading && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Cancelados"
            value={stats.by_status.cancelled}
            accent="text-red-600"
          />
          <StatCard
            label="🐶 Perros"
            value={stats.by_pet_type.perro}
          />
          <StatCard
            label="🐱 Gatos"
            value={stats.by_pet_type.gato}
          />
          <StatCard
            label="Propias / Callejeras"
            value={`${stats.by_ownership.own} / ${stats.by_ownership.stray}`}
          />
        </div>
      )}

      {/* Recent Registrations */}
      <div className="bg-white rounded-xl border border-jtq-border">
        <div className="px-5 py-4 border-b border-jtq-border">
          <h2 className="text-sm font-semibold text-jtq-text">
            Ultimos Registros
          </h2>
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
          <p className="p-5 text-sm text-jtq-muted text-center">
            No hay registros aun
          </p>
        ) : (
          <ul className="divide-y divide-jtq-border">
            {stats?.recent_registrations.map((reg) => (
              <li
                key={reg.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-jtq-muted w-8 shrink-0">
                    #{reg.registration_number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-jtq-text truncate">
                      {reg.full_name}
                    </p>
                    <p className="text-xs text-jtq-muted">
                      {reg.pet_type === "perro" ? "🐶" : "🐱"}{" "}
                      {reg.activity_name}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
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
