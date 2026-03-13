import { NextRequest, NextResponse } from "next/server"
import { adminLoginSchema } from "@/lib/schema"
import { verifyAdmin, createSession, destroySession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = adminLoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 400 }
      )
    }

    const { username, password } = parsed.data
    const admin = await verifyAdmin(username, password)

    if (!admin) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      )
    }

    await createSession(admin.id)

    return NextResponse.json({
      success: true,
      name: admin.name,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await destroySession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
