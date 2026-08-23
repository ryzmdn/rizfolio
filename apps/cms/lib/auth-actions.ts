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
import { logTransaction } from "./actions/transaction-actions"

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

const GENERIC_AUTH_ERROR = "Email atau password yang Anda masukkan tidak valid."

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

  const ownerEnvEmail = process.env.CMS_OWNER_EMAIL?.toLowerCase().trim()
  const ownerEnvPassword = process.env.CMS_OWNER_PASSWORD

  try {
    const normalizedEmail = email.toLowerCase().trim()

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)

    let userId: string | undefined

    if (existingUser) {
      if (
        existingUser.role !== "OWNER" ||
        existingUser.email.toLowerCase() !== ownerEnvEmail
      ) {
        consumeRateLimit(clientIp)
        console.warn(
          "[CMS Auth] Unauthorized login attempt for non-owner user",
          {
            ip: clientIp,
            timestamp: Date.now(),
          }
        )
        return { error: GENERIC_AUTH_ERROR }
      }

      const isPasswordValid = await verifyPassword(
        password,
        existingUser.passwordHash
      )

      if (!isPasswordValid) {
        consumeRateLimit(clientIp)
        console.warn("[CMS Auth] Failed login attempt: Invalid password", {
          ip: clientIp,
          timestamp: Date.now(),
        })
        return { error: GENERIC_AUTH_ERROR }
      }

      userId = existingUser.id

      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, existingUser.id))
    } else {
      if (normalizedEmail !== ownerEnvEmail) {
        consumeRateLimit(clientIp)
        console.warn("[CMS Auth] Failed login attempt: Unrecognized email", {
          ip: clientIp,
          timestamp: Date.now(),
        })
        return { error: GENERIC_AUTH_ERROR }
      }

      if (!ownerEnvPassword) {
        console.error(
          "[CMS Auth] Configuration error: CMS_OWNER_PASSWORD environment variable is not defined."
        )
        return {
          error: "Layanan autentikasi administrator saat ini tidak tersedia.",
        }
      }

      const envPasswordHash = await hashPassword(ownerEnvPassword)
      const isPasswordValid = await verifyPassword(password, envPasswordHash)

      if (!isPasswordValid) {
        consumeRateLimit(clientIp)
        console.warn(
          "[CMS Auth] Failed initial provisioning: Invalid owner password",
          {
            ip: clientIp,
            timestamp: Date.now(),
          }
        )
        return { error: GENERIC_AUTH_ERROR }
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
      return { error: "Gagal memproses sesi administrator." }
    }

    resetRateLimit(clientIp)

    const token = await createSessionToken({
      userId,
      email: normalizedEmail,
      role: "OWNER",
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)

    logTransaction({
      domain: "AUTH_SECURITY",
      actionType: "ADMIN_LOGIN_SUCCESS",
      status: "COMPLETED",
      actorId: userId,
      actorType: "OWNER",
      entityType: "users",
      entityId: userId,
      clientIp,
      metadata: { email: normalizedEmail },
    })

    return { success: true }
  } catch (error) {
    console.error("[CMS Auth] Server error during login processing:", {
      ip: clientIp,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: Date.now(),
    })
    return {
      error:
        "Terjadi kesalahan server saat memproses login. Silakan coba lagi.",
    }
  }
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const session = await validateOwnerSession(token)

  if (session) {
    logTransaction({
      domain: "AUTH_SECURITY",
      actionType: "ADMIN_LOGOUT",
      status: "COMPLETED",
      actorId: session.userId,
      actorType: "OWNER",
      entityType: "users",
      entityId: session.userId,
    })
  }

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
