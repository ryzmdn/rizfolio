"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db, eq } from "@workspace/db"
import { users } from "@workspace/db/schema"
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  validateOwnerSession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@workspace/auth"

export interface AuthState {
  error?: string
  success?: boolean
}

export async function loginAdmin(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const email = formData.get("email")?.toString().trim()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." }
  }

  const ownerEnvEmail = process.env.CMS_OWNER_EMAIL?.toLowerCase()
  const ownerEnvPassword = process.env.CMS_OWNER_PASSWORD

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    const normalizedEmail = email.toLowerCase().trim()
    let userId: string | undefined

    if (existingUser) {
      if (existingUser.role !== "OWNER" || existingUser.email.toLowerCase() !== ownerEnvEmail) {
        return { error: "Akses ditolak. Pengguna bukan merupakan Owner." }
      }

      const isPasswordValid = await verifyPassword(
        password,
        existingUser.passwordHash
      )

      if (!isPasswordValid) {
        return { error: "Password yang Anda masukkan salah." }
      }

      userId = existingUser.id

      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, existingUser.id))
    } else {
      if (normalizedEmail !== ownerEnvEmail) {
        return { error: "Akses ditolak. Email tidak terdaftar sebagai Owner." }
      }

      if (!ownerEnvPassword) {
        return { error: "Konfigurasi autentikasi Owner belum lengkap." }
      }

      // Auto-provision initial owner user with bcrypt hash
      const envPasswordHash = await hashPassword(ownerEnvPassword)
      const isPasswordValid = await verifyPassword(password, envPasswordHash)

      if (!isPasswordValid) {
        return { error: "Password Owner tidak valid." }
      }

      const [newUser] = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          passwordHash: envPasswordHash,
          role: "OWNER",
          lastLoginAt: new Date(),
        })
        .returning({ id: users.id })

      userId = newUser?.id
    }

    if (!userId) {
      return { error: "Gagal memproses sesi pengguna." }
    }

    const token = await createSessionToken({
      userId,
      email: email.toLowerCase(),
      role: "OWNER",
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)
  } catch (error) {
    console.error("Login error:", error)
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan server saat memproses login."
    return { error: `Gagal memproses login: ${message}` }
  }

  redirect("/")
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect("/login")
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    return await validateOwnerSession(token)
  } catch {
    return null
  }
}
