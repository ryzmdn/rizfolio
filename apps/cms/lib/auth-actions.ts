"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { db, eq, sql } from "@workspace/db"
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
  } catch (error: unknown) {
    console.warn(
      "[Auth Actions] getClientIp fallback to 127.0.0.1:",
      error instanceof Error ? error.message : String(error)
    )
  }
  return "127.0.0.1"
}

const GENERIC_AUTH_ERROR = "Email atau password yang Anda masukkan tidak valid."

export async function loginAdmin(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState | null> {
  const clientIp = await getClientIp()
  const rateLimitStatus = await checkRateLimit(clientIp)

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

  if (!ownerEnvEmail || !ownerEnvPassword) {
    console.error(
      "[CMS Auth] Configuration error: CMS_OWNER_EMAIL or CMS_OWNER_PASSWORD is not defined."
    )
    return {
      error: "Layanan autentikasi administrator saat ini tidak tersedia.",
    }
  }

  const normalizedEmail = email.toLowerCase().trim()
  if (normalizedEmail !== ownerEnvEmail) {
    await consumeRateLimit(clientIp)
    return { error: GENERIC_AUTH_ERROR }
  }

  try {
    let existingUser: typeof users.$inferSelect | undefined
    let isDbConnected = false

    try {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1)
      existingUser = rows[0]
      isDbConnected = true
    } catch (dbError) {
      console.warn(
        "[CMS Auth] Database unreachable during user lookup:",
        dbError instanceof Error ? dbError.message : String(dbError)
      )
    }

    let isPasswordValid = false
    if (password === ownerEnvPassword) {
      isPasswordValid = true
    } else if (existingUser?.passwordHash) {
      isPasswordValid = await verifyPassword(
        password,
        existingUser.passwordHash
      )
    }

    if (!isPasswordValid) {
      await consumeRateLimit(clientIp)
      return { error: GENERIC_AUTH_ERROR }
    }

    let userId: string = existingUser?.id ?? "owner-admin-root"
    let tokenVersion: number = existingUser?.tokenVersion ?? 1

    if (isDbConnected) {
      try {
        if (existingUser) {
          await db
            .update(users)
            .set({ lastLoginAt: new Date() })
            .where(eq(users.id, existingUser.id))
        } else {
          const envPasswordHash = await hashPassword(ownerEnvPassword)
          const [newUser] = await db
            .insert(users)
            .values({
              email: normalizedEmail,
              passwordHash: envPasswordHash,
              role: "OWNER",
              tokenVersion: 1,
              lastLoginAt: new Date(),
            })
            .returning({ id: users.id, tokenVersion: users.tokenVersion })

          if (newUser?.id) {
            userId = newUser.id
            tokenVersion = newUser.tokenVersion ?? 1
          }
        }
      } catch (dbSyncError) {
        console.warn(
          "[CMS Auth] Database synchronization warning:",
          dbSyncError instanceof Error
            ? dbSyncError.message
            : String(dbSyncError)
        )
      }
    }

    resetRateLimit(clientIp)

    const token = await createSessionToken({
      userId,
      email: normalizedEmail,
      role: "OWNER",
      tokenVersion,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)

    try {
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
    } catch {}

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
    try {
      await db
        .update(users)
        .set({ tokenVersion: sql`${users.tokenVersion} + 1` })
        .where(eq(users.id, session.userId))
    } catch {}

    try {
      logTransaction({
        domain: "AUTH_SECURITY",
        actionType: "ADMIN_LOGOUT",
        status: "COMPLETED",
        actorId: session.userId,
        actorType: "OWNER",
        entityType: "users",
        entityId: session.userId,
      })
    } catch {}
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect("/login")
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    const session = await validateOwnerSession(token)
    if (!session || !session.userId) {
      return null
    }

    try {
      const [user] = await db
        .select({ id: users.id, tokenVersion: users.tokenVersion })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1)

      if (
        user &&
        session.tokenVersion !== undefined &&
        user.tokenVersion !== session.tokenVersion
      ) {
        cookieStore.delete(SESSION_COOKIE_NAME)
        return null
      }
    } catch (dbError) {
      console.warn(
        "[CMS Auth] Database check skipped in getCurrentUser:",
        dbError instanceof Error ? dbError.message : String(dbError)
      )
    }

    return session
  } catch (error: unknown) {
    if (
      (error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE" ||
      (error instanceof Error && error.message.includes("Dynamic server usage"))
    ) {
      throw error
    }
    console.error(
      "[Auth Actions] getCurrentUser validation failed:",
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}
