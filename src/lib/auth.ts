import { cookies } from "next/headers"
import { getDb } from "./db"
import bcrypt from "bcryptjs"

const SESSION_COOKIE = "jtq_admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

export type UserRole = "admin" | "caller"

export interface SessionUser {
  id: number
  name: string
  role: UserRole
}

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "AuthError"
  }
}

export async function verifyAdmin(
  username: string,
  password: string
): Promise<{ id: number; name: string; role: UserRole } | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT id, name, password_hash, role, active
    FROM admin_users
    WHERE username = ${username}
  `
  if (rows.length === 0) return null

  const user = rows[0]
  if (user.active === false) return null

  const valid = await bcrypt.compare(password, user.password_hash as string)
  if (!valid) return null

  // Record successful login (fire-and-forget; do not block).
  sql`UPDATE admin_users SET last_login_at = NOW() WHERE id = ${user.id as number}`.catch(() => {})

  const role = ((user.role as string | null) ?? "admin") as UserRole

  return {
    id: user.id as number,
    name: user.name as string,
    role,
  }
}

export async function createSession(userId: number): Promise<void> {
  const token = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`
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

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession()
  if (!session) return null

  const sql = getDb()
  const rows = await sql`
    SELECT id, name, role, active
    FROM admin_users
    WHERE id = ${session.adminId}
  `
  if (rows.length === 0) return null
  const row = rows[0]
  if (row.active === false) return null

  return {
    id: row.id as number,
    name: row.name as string,
    role: ((row.role as string | null) ?? "admin") as UserRole,
  }
}

/**
 * Server-side role enforcement. Throws AuthError on failure.
 * Pass an array to allow multiple roles (e.g. ['admin','caller']).
 */
export async function requireRole(allowed: UserRole | UserRole[]): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new AuthError("No autorizado", 401)
  }
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed]
  if (!allowedRoles.includes(user.role)) {
    throw new AuthError("Sin permisos suficientes", 403)
  }
  return user
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
