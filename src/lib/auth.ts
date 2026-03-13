import { cookies } from "next/headers"
import { getDb } from "./db"
import bcrypt from "bcryptjs"

const SESSION_COOKIE = "jtq_admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function verifyAdmin(
  username: string,
  password: string
): Promise<{ id: number; name: string } | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT id, name, password_hash FROM admin_users WHERE username = ${username}
  `
  if (rows.length === 0) return null

  const user = rows[0]
  const valid = await bcrypt.compare(password, user.password_hash as string)
  if (!valid) return null

  return { id: user.id as number, name: user.name as string }
}

export async function createSession(adminId: number): Promise<void> {
  const token = `${adminId}-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function getSession(): Promise<{ adminId: number } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const adminId = parseInt(token.split("-")[0])
  if (isNaN(adminId)) return null

  return { adminId }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
