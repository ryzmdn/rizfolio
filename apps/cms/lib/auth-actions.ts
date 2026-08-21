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

  const ownerEmail = process.env.CMS_OWNER_EMAIL
  const ownerEnvPassword = process.env.CMS_OWNER_PASSWORD

  if (email.toLowerCase() !== ownerEmail?.toLowerCase()) {
    return { error: "Akses ditolak. Email tidak terdaftar sebagai Owner." }
  }

  if (ownerEnvPassword && password !== ownerEnvPassword) {
    return { error: "Password Owner tidak valid." }
  }

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    let userId = existingUser?.id

    if (!existingUser) {
      const passwordHash = await hashPassword(password)
      const [newUser] = await db
        .insert(users)
        .values({
          email: email.toLowerCase(),
          passwordHash,
          role: "OWNER",
        })
        .returning({ id: users.id })

      if (newUser) {
        userId = newUser.id
      }
    } else {
      if (!ownerEnvPassword) {
        const isValid = await verifyPassword(
          password,
          existingUser.passwordHash
        )
        if (!isValid) {
          return { error: "Password yang Anda masukkan salah." }
        }
      }

      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, existingUser.id))
    }

    const token = await createSessionToken({
      userId: userId!,
      email: email.toLowerCase(),
      role: "OWNER",
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Terjadi kesalahan server saat memproses login." }
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
