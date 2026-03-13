"use client"

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

interface RegistrationTableProps {
  registrations: Registration[]
  onStatusChange?: (id: number, newStatus: string) => void
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatWhatsApp(number: string) {
  const clean = number.replace(/\D/g, "")
  return clean
}

export default function RegistrationTable({
  registrations,
}: RegistrationTableProps) {
  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 text-jtq-muted text-sm">
        No se encontraron registros
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-jtq-border text-left">
              <th className="px-4 py-3 text-xs font-semibold text-jtq-muted uppercase tracking-wider">
                Folio
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-jtq-muted uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-jtq-muted uppercase tracking-wider">
                WhatsApp
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-jtq-muted uppercase tracking-wider">
                Mascota
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-jtq-muted uppercase tracking-wider">
                Propiedad
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-jtq-muted uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-jtq-muted uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-jtq-border">
            {registrations.map((reg) => (
              <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-jtq-primary text-xs font-bold">
                  {generateFolio(reg.id)}
                </td>
                <td className="px-4 py-3 font-medium text-jtq-text">
                  {reg.full_name}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`https://wa.me/${formatWhatsApp(reg.whatsapp)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-jtq-primary hover:underline"
                  >
                    {reg.whatsapp}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="mr-1">
                    {reg.pet_type === "perro" ? "🐶" : "🐱"}
                  </span>
                  {reg.pet_name || (reg.pet_type === "perro" ? "Perro" : "Gato")}
                </td>
                <td className="px-4 py-3 text-jtq-muted">
                  {reg.is_own_pet === true
                    ? "Propia"
                    : reg.is_own_pet === false
                    ? "Callejera"
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUS_COLORS[reg.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_LABELS[reg.status] || reg.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-jtq-muted whitespace-nowrap">
                  {formatDate(reg.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-3">
        {registrations.map((reg) => (
          <div
            key={reg.id}
            className="bg-white rounded-xl border border-jtq-border p-4 space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm text-jtq-text">
                  {reg.full_name}
                </p>
                <p className="text-xs text-jtq-primary font-mono font-bold mt-0.5">
                  {generateFolio(reg.id)} &middot; <span className="text-jtq-muted font-normal font-sans">{formatDate(reg.created_at)}</span>
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                  STATUS_COLORS[reg.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {STATUS_LABELS[reg.status] || reg.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-jtq-muted">
              <span>
                {reg.pet_type === "perro" ? "🐶" : "🐱"}{" "}
                {reg.pet_name || (reg.pet_type === "perro" ? "Perro" : "Gato")}
              </span>
              <span>
                {reg.is_own_pet === true ? "Propia" : reg.is_own_pet === false ? "Callejera" : ""}
              </span>
            </div>

            <a
              href={`https://wa.me/${formatWhatsApp(reg.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-jtq-primary hover:underline"
            >
              <span>💬</span> {reg.whatsapp}
            </a>
          </div>
        ))}
      </div>
    </>
  )
}
