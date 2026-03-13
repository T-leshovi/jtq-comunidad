"use client"

import { useEffect, useState, useCallback } from "react"
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
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "registered", label: "Registrado" },
  { value: "confirmed", label: "Confirmado" },
  { value: "attended", label: "Asistio" },
  { value: "cancelled", label: "Cancelado" },
]

export default function RegistrosPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
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
  }, [page, limit, search, statusFilter])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  function exportCSV() {
    // Generate CSV from current data
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
      "\uFEFF" + // BOM for Excel
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
        <h1 className="text-xl font-bold text-jtq-text">Registros</h1>
        <button
          onClick={exportCSV}
          disabled={registrations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-jtq-border bg-white text-sm font-medium text-jtq-text hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>📥</span> Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre o WhatsApp..."
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-jtq-border text-sm focus:outline-none focus:ring-2 focus:ring-jtq-primary/30 focus:border-jtq-primary"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-jtq-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors"
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
          className="px-3.5 py-2.5 rounded-lg border border-jtq-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-jtq-primary/30 focus:border-jtq-primary"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-jtq-danger">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-jtq-border overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-10" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-16" />
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
              className="px-3 py-1.5 rounded-lg border border-jtq-border text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-sm text-jtq-muted">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-jtq-border text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
