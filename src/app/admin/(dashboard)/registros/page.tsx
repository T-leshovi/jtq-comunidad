"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import RegistrationTable from "@/components/RegistrationTable"
import { generateFolio } from "@/lib/folio"

interface Registration {
  id: number
  registration_number: number
  full_name: string
  whatsapp: string
  status: string
  pet_type: string | null
  pet_name: string | null
  is_own_pet: boolean | null
  activity_name: string
  created_at: string
  scheduled_date: string | null
  attended_at: string | null
  dup_phone?: boolean
  dup_name?: boolean
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "registered", label: "Registrado" },
  { value: "confirmed", label: "Confirmado" },
  { value: "attended", label: "Asistio" },
  { value: "cancelled", label: "Cancelado" },
]

function RegistrosContent() {
  const searchParams = useSearchParams()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dupFilter, setDupFilter] = useState(searchParams.get("dup") || "")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", String(limit))
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      if (dupFilter) params.set("duplicates", dupFilter)

      const res = await fetch(`/api/registrations?${params}`)
      if (!res.ok) throw new Error("Error al cargar registros")
      const data = await res.json()
      setRegistrations(data.registrations)
      setTotal(data.total)
    } catch {
      setError("No se pudieron cargar los registros")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, statusFilter, dupFilter])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  function exportCSV() {
    const headers = [
      "Folio",
      "Nombre",
      "WhatsApp",
      "Tipo Mascota",
      "Nombre Mascota",
      "Propiedad",
      "Estado",
      "Fecha Registro",
    ]

    const rows = registrations.map((r) => [
      generateFolio(r.id),
      r.full_name,
      r.whatsapp,
      r.pet_type || "",
      r.pet_name || "",
      r.is_own_pet === true ? "Propia" : r.is_own_pet === false ? "Callejera" : "",
      r.status,
      new Date(r.created_at).toISOString().split("T")[0],
    ])

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `registros-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-white heading-font">Registros</h1>
        <button
          onClick={exportCSV}
          disabled={registrations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-jtq-muted hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>📥</span> Exportar CSV
        </button>
      </div>

      {/* Duplicate alert */}
      {!loading && registrations.some(r => r.dup_phone || r.dup_name) && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>
            Se detectaron registros duplicados en esta página.
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">DUP</span> = mismo teléfono,
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">NOMBRE</span> = mismo nombre.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre o WhatsApp..."
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-jtq-primary/40 focus:border-jtq-primary/50 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg btn-primary text-white text-sm font-medium"
          >
            Buscar
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-jtq-primary/40 focus:border-jtq-primary/50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1e293b] text-white">
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={dupFilter}
          onChange={(e) => {
            setDupFilter(e.target.value)
            setPage(1)
          }}
          className={`px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-jtq-primary/40 focus:border-jtq-primary/50 ${
            dupFilter
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-white/10 bg-white/5 text-white"
          }`}
        >
          <option value="" className="bg-[#1e293b] text-white">Duplicados</option>
          <option value="any" className="bg-[#1e293b] text-white">Todos los duplicados</option>
          <option value="phone" className="bg-[#1e293b] text-white">Mismo telefono</option>
          <option value="name" className="bg-[#1e293b] text-white">Mismo nombre</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-4 bg-white/10 rounded w-10" />
                <div className="h-4 bg-white/10 rounded flex-1" />
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="h-4 bg-white/10 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <RegistrationTable registrations={registrations} />
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-jtq-muted">
            {total} registro{total !== 1 ? "s" : ""} en total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-jtq-muted bg-white/5 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-sm text-jtq-muted">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-jtq-muted bg-white/5 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RegistrosPage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse flex gap-4">
            <div className="h-4 bg-white/10 rounded w-10" />
            <div className="h-4 bg-white/10 rounded flex-1" />
            <div className="h-4 bg-white/10 rounded w-24" />
          </div>
        ))}
      </div>
    }>
      <RegistrosContent />
    </Suspense>
  )
}
