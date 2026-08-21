"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { db, eq } from "@workspace/db"
import { users } from "@workspace/db/schema"
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  validateOwnerSession,
  checkRateLimit,
  consumeRateLimit,
  resetRateLimit,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@workspace/auth"

export interface AuthState {
  error?: string
  success?: boolean
}

async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    if (forwardedFor) {
      const firstIp = forwardedFor.split(",")[0]?.trim()
      if (firstIp) return firstIp
    }
    const realIp = headersList.get("x-real-ip")
    if (realIp) {
      return realIp.trim()
    }
    const cfIp = headersList.get("cf-connecting-ip")
    if (cfIp) {
      return cfIp.trim()
    }
  } catch {
    // Fallback when headers() is called outside request scope
  }
  return "127.0.0.1"
}

export async function loginAdmin(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const clientIp = await getClientIp()
  const rateLimitStatus = checkRateLimit(clientIp)

  if (!rateLimitStatus.allowed) {
    const minutes = Math.ceil(rateLimitStatus.retryAfterSeconds / 60)
    return {
      error: `Terlalu banyak percobaan login yang gagal. Silakan coba lagi dalam ${minutes} menit.`,
    }
  }

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
        consumeRateLimit(clientIp)
        return { error: "Akses ditolak. Pengguna bukan merupakan Owner." }
      }

      const isPasswordValid = await verifyPassword(
        password,
        existingUser.passwordHash
      )

      if (!isPasswordValid) {
        consumeRateLimit(clientIp)
        return { error: "Password yang Anda masukkan salah." }
      }

      userId = existingUser.id

      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, existingUser.id))
    } else {
      if (normalizedEmail !== ownerEnvEmail) {
        consumeRateLimit(clientIp)
        return { error: "Akses ditolak. Email tidak terdaftar sebagai Owner." }
      }

      if (!ownerEnvPassword) {
        return { error: "Konfigurasi autentikasi Owner belum lengkap." }
      }

      const envPasswordHash = await hashPassword(ownerEnvPassword)
      const isPasswordValid = await verifyPassword(password, envPasswordHash)

      if (!isPasswordValid) {
        consumeRateLimit(clientIp)
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

    resetRateLimit(clientIp)

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
