"use server"

import { db, eq } from "@workspace/db"
import { siteSettings, users, profile } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { verifyPassword, hashPassword } from "@workspace/auth"
import { getCurrentUser } from "../auth-actions"
import { logTransaction } from "./transaction-actions"
import {
  dispatchBackgroundRevalidation,
  type RevalidatableApp,
} from "../revalidate"

const ALL_APPS: RevalidatableApp[] = [
  "portfolio",
  "blog",
  "shop",
  "docs",
  "changelog",
  "linkbio",
]

export interface CmsUserProfile {
  userId: string
  email: string
  role: string
  name: string
  avatarUrl?: string
}

export async function getCmsUserProfile(): Promise<CmsUserProfile | null> {
  try {
    const session = await getCurrentUser()
    if (!session) return null

    let avatarUrl: string | undefined
    let fullName = "Rizky Ramadhan"

    const [userRecord] = await db
      .select({ avatarUrl: users.avatarUrl })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (userRecord?.avatarUrl) {
      avatarUrl = userRecord.avatarUrl
    }

    const [profileRecord] = await db
      .select({ fullName: profile.fullName })
      .from(profile)
      .limit(1)

    if (profileRecord?.fullName) {
      fullName = profileRecord.fullName
    }

    return {
      userId: session.userId,
      email: session.email,
      role: session.role,
      name: fullName,
      avatarUrl,
    }
  } catch (error) {
    console.error(
      "[CMS Settings] Failed to get user profile:",
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export async function getSiteSettings(key = "general") {
  try {
    const [settings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1)
    return settings || null
  } catch (error) {
    console.error(
      "[CMS Settings] Failed to fetch settings:",
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export async function updateSiteSettings(
  key: string,
  valueJson: unknown,
  description?: string
) {
  const existing = await getSiteSettings(key)
  if (existing) {
    await db
      .update(siteSettings)
      .set({ valueJson, description, updatedAt: new Date() })
      .where(eq(siteSettings.key, key))
  } else {
    await db.insert(siteSettings).values({ key, valueJson, description })
  }

  logTransaction({
    domain: "SYSTEM",
    actionType: "SETTINGS_UPDATED",
    status: "COMPLETED",
    entityType: "site_settings",
    entityId: key,
    payloadAfter:
      typeof valueJson === "object"
        ? (valueJson as Record<string, unknown>)
        : { value: valueJson },
  })

  dispatchBackgroundRevalidation(ALL_APPS.map((app) => ({ app, path: "/" })))

  revalidatePath("/settings")
  revalidatePath("/")
}

export async function getProfileSettings() {
  try {
    const session = await getCurrentUser()
    const [profileData] = await db.select().from(profile).limit(1)
    let avatarUrl = ""

    if (session?.userId) {
      const [userRecord] = await db
        .select({ avatarUrl: users.avatarUrl })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1)
      if (userRecord?.avatarUrl) {
        avatarUrl = userRecord.avatarUrl
      }
    }

    return {
      fullName: profileData?.fullName || "Rizky Ramadhan",
      headline:
        profileData?.headline ||
        "Full-Stack Software Engineer & System Architect",
      bio:
        profileData?.bio ||
        "Passionate full-stack developer with extensive expertise across modern web architectures, distributed systems, and scalable digital platforms.",
      location: profileData?.location || "Jakarta, Indonesia",
      resumeUrl: profileData?.resumeUrl || "",
      status: profileData?.status || "available",
      socialLinks:
        (profileData?.socialLinks as Record<string, string>) || {
          github: "https://github.com/ryzmdn",
          linkedin: "https://linkedin.com/in/ryzmdn",
          twitter: "https://twitter.com/ryzmdn",
          website: "https://rizkyramadhan.dev",
        },
      avatarUrl,
    }
  } catch (error) {
    console.error(
      "[CMS Settings] Failed to fetch profile settings:",
      error instanceof Error ? error.message : error
    )
    return {
      fullName: "Rizky Ramadhan",
      headline: "Full-Stack Software Engineer & System Architect",
      bio: "",
      location: "Jakarta, Indonesia",
      resumeUrl: "",
      status: "available",
      socialLinks: {},
      avatarUrl: "",
    }
  }
}

export interface ProfileUpdateInput {
  fullName: string
  headline: string
  bio: string
  location?: string
  resumeUrl?: string
  avatarUrl?: string
  socialLinks?: Record<string, string>
}

export async function updateProfileSettingsAction(
  input: ProfileUpdateInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return { success: false, error: "Sesi otentikasi tidak valid." }
    }

    if (!input.fullName.trim() || !input.headline.trim() || !input.bio.trim()) {
      return {
        success: false,
        error: "Nama lengkap, headline, dan bio wajib diisi.",
      }
    }

    const [existing] = await db.select().from(profile).limit(1)
    const profileValues = {
      fullName: input.fullName.trim(),
      headline: input.headline.trim(),
      bio: input.bio.trim(),
      location: input.location?.trim() || null,
      resumeUrl: input.resumeUrl?.trim() || null,
      socialLinks: input.socialLinks || {},
      updatedAt: new Date(),
    }

    if (existing) {
      await db
        .update(profile)
        .set(profileValues)
        .where(eq(profile.id, existing.id))
    } else {
      await db.insert(profile).values(profileValues)
    }

    if (input.avatarUrl !== undefined && session.userId) {
      await db
        .update(users)
        .set({ avatarUrl: input.avatarUrl.trim() || null })
        .where(eq(users.id, session.userId))
    }

    logTransaction({
      domain: "PORTFOLIO",
      actionType: "PROFILE_UPDATED",
      status: "COMPLETED",
      actorId: session.userId,
      actorType: "OWNER",
      entityType: "profile",
      entityId: existing?.id || "profile-singleton",
      payloadAfter: profileValues,
    })

    dispatchBackgroundRevalidation([
      { app: "portfolio", path: "/" },
      { app: "linkbio", path: "/" },
      { app: "blog", path: "/" },
    ])

    revalidatePath("/settings")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error(
      "[CMS Settings] Profile update failed:",
      error instanceof Error ? error.message : error
    )
    return {
      success: false,
      error: "Gagal memperbarui profil. Silakan coba beberapa saat lagi.",
    }
  }
}

export async function changeOwnerPasswordAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return { success: false, error: "Sesi otentikasi tidak valid." }
    }

    const currentPassword = formData.get("currentPassword")?.toString()
    const newPassword = formData.get("newPassword")?.toString()
    const confirmPassword = formData.get("confirmPassword")?.toString()

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Semua bidang password wajib diisi." }
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: "Password baru dan konfirmasi password tidak cocok.",
      }
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Password baru harus memiliki minimal 8 karakter.",
      }
    }

    const hasComplexity =
      /[a-zA-Z]/.test(newPassword) &&
      /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)

    if (!hasComplexity) {
      return {
        success: false,
        error:
          "Password baru harus mengandung kombinasi huruf dan angka atau simbol.",
      }
    }

    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (!userRecord) {
      return {
        success: false,
        error: "Data pengguna administrator tidak ditemukan.",
      }
    }

    const isValidCurrent = await verifyPassword(
      currentPassword,
      userRecord.passwordHash
    )

    if (!isValidCurrent) {
      return {
        success: false,
        error: "Password saat ini yang Anda masukkan salah.",
      }
    }

    const newPasswordHash = await hashPassword(newPassword)

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, userRecord.id))

    logTransaction({
      domain: "AUTH_SECURITY",
      actionType: "ADMIN_PASSWORD_CHANGED",
      status: "COMPLETED",
      actorId: userRecord.id,
      actorType: "OWNER",
      entityType: "users",
      entityId: userRecord.id,
      metadata: { email: userRecord.email },
    })

    return { success: true }
  } catch (error) {
    console.error(
      "[CMS Settings] Password change failed:",
      error instanceof Error ? error.message : error
    )
    return {
      success: false,
      error: "Gagal mengganti password. Terjadi kesalahan pada server.",
    }
  }
}
