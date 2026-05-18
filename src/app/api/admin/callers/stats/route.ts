import { NextResponse } from "next/server"
import { requireRole, AuthError } from "@/lib/auth"
import { getGlobalStats } from "@/lib/queue"

export async function GET() {
  try {
    await requireRole("admin")
    const stats = await getGlobalStats()
    return NextResponse.json(stats)
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error("Caller stats error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
