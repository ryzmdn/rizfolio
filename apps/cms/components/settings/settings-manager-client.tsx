"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import {
  User,
  Globe,
  ShieldCheck,
  Activity,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { RevalidationButton } from "@/components/revalidation-button"
import { SystemHealthDiagnostics } from "./system-health-diagnostics"
import {
  updateProfileSettingsAction,
  changeOwnerPasswordAction,
  updateSiteSettings,
  type ProfileUpdateInput,
} from "@/lib/actions/settings-actions"

export interface SettingsManagerClientProps {
  initialProfile: {
    fullName: string
    headline: string
    bio: string
    location?: string
    resumeUrl?: string
    avatarUrl?: string
    socialLinks?: Record<string, string>
  }
  initialGeneral: {
    siteName: string
    siteUrl: string
    contactEmail: string
    defaultMetaDesc: string
    defaultOgImage: string
    twitterHandle: string
    maintenanceMode: boolean
  }
}

type SettingsTab = "profile" | "general" | "security" | "system"

export function SettingsManagerClient({
  initialProfile,
  initialGeneral,
}: SettingsManagerClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
  const [profileForm, setProfileForm] =
    useState<ProfileUpdateInput>(initialProfile)
  const [generalForm, setGeneralForm] = useState(initialGeneral)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  function showNotification(type: "success" | "error", message: string) {
    setFeedback({ type, message })
    setTimeout(() => {
      setFeedback(null)
    }, 4500)
  }

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateProfileSettingsAction(profileForm)
      if (res.success) {
        showNotification(
          "success",
          "Profil pemilik dan tautan sosial berhasil disimpan."
        )
      } else {
        showNotification(
          "error",
          res.error || "Gagal memperbarui profil pemilik."
        )
      }
    })
  }

  function handleGeneralSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await updateSiteSettings(
          "general",
          generalForm,
          "Pengaturan umum, identitas dan SEO ekosistem rizfolio"
        )
        showNotification(
          "success",
          "Konfigurasi situs global dan SEO berhasil diperbarui."
        )
      } catch (err) {
        showNotification(
          "error",
          err instanceof Error
            ? err.message
            : "Gagal menyimpan konfigurasi situs."
        )
      }
    })
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const formData = new FormData()
      formData.set("currentPassword", currentPassword)
      formData.set("newPassword", newPassword)
      formData.set("confirmPassword", confirmPassword)

      const res = await changeOwnerPasswordAction(formData)
      if (res.success) {
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        showNotification(
          "success",
          "Password administrator berhasil diperbarui. Silakan gunakan password baru untuk login berikutnya."
        )
      } else {
        showNotification(
          "error",
          res.error || "Gagal mengganti password administrator."
        )
      }
    })
  }

  const passwordLengthMet = newPassword.length >= 8
  const passwordComplexityMet =
    /[a-zA-Z]/.test(newPassword) &&
    /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)
  const passwordsMatch = newPassword === confirmPassword && newPassword !== ""

  return (
    <div className="space-y-8">
      {feedback && (
        <div
          className={cn(
            "flex items-center justify-between rounded-xl p-4 text-xs font-semibold shadow-sm transition-all animate-in fade-in slide-in-from-top-2",
            feedback.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
              : "border border-destructive/30 bg-destructive/10 text-destructive"
          )}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-hidden",
            activeTab === "profile"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <User className="size-3.5" />
          <span>Profil & Identitas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-hidden",
            activeTab === "general"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Globe className="size-3.5" />
          <span>Situs Global & SEO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-hidden",
            activeTab === "security"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <ShieldCheck className="size-3.5" />
          <span>Keamanan & Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("system")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-hidden",
            activeTab === "system"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Activity className="size-3.5" />
          <span>Diagnostik & ISR Cache</span>
        </button>
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <section className="space-y-6 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                  Informasi Profil & Penulis
                </h2>
                <p className="text-xs text-muted-foreground">
                  Metadata diri yang ditampilkan pada portfolio, artikel blog,
                  dan mission control.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Headline Profesional / Jabatan
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.headline}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, headline: e.target.value })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={profileForm.location || ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, location: e.target.value })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  URL Dokumen Resume / CV
                </label>
                <input
                  type="url"
                  value={profileForm.resumeUrl || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      resumeUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                URL Foto Profil (Avatar)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-muted/30">
                  {profileForm.avatarUrl ? (
                    <Image
                      src={profileForm.avatarUrl}
                      alt="Avatar Preview"
                      width={56}
                      height={56}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    <User className="size-6 text-muted-foreground" />
                  )}
                </div>
                <input
                  type="url"
                  value={profileForm.avatarUrl || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      avatarUrl: e.target.value,
                    })
                  }
                  placeholder="https://images.unsplash.com/... atau https://res.cloudinary.com/..."
                  className="flex-1 rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Biografi Ringkas
              </label>
              <textarea
                rows={4}
                required
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs leading-relaxed text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
              />
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8">
            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
              Tautan Jejaring Sosial & Media
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  GitHub
                </label>
                <input
                  type="url"
                  value={profileForm.socialLinks?.github || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialLinks: {
                        ...profileForm.socialLinks,
                        github: e.target.value,
                      },
                    })
                  }
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={profileForm.socialLinks?.linkedin || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialLinks: {
                        ...profileForm.socialLinks,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Twitter / X
                </label>
                <input
                  type="url"
                  value={profileForm.socialLinks?.twitter || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialLinks: {
                        ...profileForm.socialLinks,
                        twitter: e.target.value,
                      },
                    })
                  }
                  placeholder="https://twitter.com/..."
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Situs Web Portofolio
                </label>
                <input
                  type="url"
                  value={profileForm.socialLinks?.website || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialLinks: {
                        ...profileForm.socialLinks,
                        website: e.target.value,
                      },
                    })
                  }
                  placeholder="https://rizkyramadhan.dev"
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background transition-transform hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                <Save className="size-3.5" />
                <span>
                  {isPending ? "Menyimpan..." : "Simpan Informasi Profil"}
                </span>
              </button>
            </div>
          </section>
        </form>
      )}

      {activeTab === "general" && (
        <form onSubmit={handleGeneralSubmit} className="space-y-6">
          <section className="space-y-6 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                Parameter Situs Global & Identitas Ekosistem
              </h2>
              <p className="text-xs text-muted-foreground">
                Domain utama, kontak administratif, dan status operasional
                publik.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Ekosistem Website
                </label>
                <input
                  type="text"
                  required
                  value={generalForm.siteName}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, siteName: e.target.value })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  URL Domain Produksi
                </label>
                <input
                  type="url"
                  required
                  value={generalForm.siteUrl}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, siteUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Email Kontak Administratif
                </label>
                <input
                  type="email"
                  required
                  value={generalForm.contactEmail}
                  onChange={(e) =>
                    setGeneralForm({
                      ...generalForm,
                      contactEmail: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Status Operasional Sistem
                </label>
                <select
                  value={generalForm.maintenanceMode ? "true" : "false"}
                  onChange={(e) =>
                    setGeneralForm({
                      ...generalForm,
                      maintenanceMode: e.target.value === "true",
                    })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                >
                  <option value="false">Live (Operasional Normal)</option>
                  <option value="true">
                    Maintenance Mode (Perawatan Sistem)
                  </option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                Optimasi Mesin Pencari (SEO) & OpenGraph Meta
              </h2>
              <p className="text-xs text-muted-foreground">
                Pengaturan metadata default ketika tautan situs dibagikan ke
                media sosial dan diindeks mesin pencari.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi Meta Default (SEO)
              </label>
              <textarea
                rows={3}
                value={generalForm.defaultMetaDesc}
                onChange={(e) =>
                  setGeneralForm({
                    ...generalForm,
                    defaultMetaDesc: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs leading-relaxed text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  URL OpenGraph Image Default (1200x630)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/80 bg-muted/30">
                    {generalForm.defaultOgImage ? (
                      <Image
                        src={generalForm.defaultOgImage}
                        alt="OG Preview"
                        width={80}
                        height={48}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : (
                      <Globe className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    type="url"
                    value={generalForm.defaultOgImage}
                    onChange={(e) =>
                      setGeneralForm({
                        ...generalForm,
                        defaultOgImage: e.target.value,
                      })
                    }
                    placeholder="https://.../og.png"
                    className="flex-1 rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Handle Twitter / X Situs
                </label>
                <input
                  type="text"
                  value={generalForm.twitterHandle}
                  onChange={(e) =>
                    setGeneralForm({
                      ...generalForm,
                      twitterHandle: e.target.value,
                    })
                  }
                  placeholder="@ryzmdn"
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background transition-transform hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                <Save className="size-3.5" />
                <span>
                  {isPending ? "Menyimpan..." : "Simpan Pengaturan Situs & SEO"}
                </span>
              </button>
            </div>
          </section>
        </form>
      )}

      {activeTab === "security" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <section className="space-y-6 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-foreground">
                <Lock className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                  Ganti Password Administrator (Owner)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Perbarui kata sandi untuk melindungi akses mission control
                  CMS.
                </p>
              </div>
            </div>

            <div className="max-w-xl space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password lama..."
                    className="w-full rounded-xl border border-border/70 bg-background/80 py-2.5 pr-10 pl-3.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPw ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter kombinasi huruf & angka/simbol..."
                    className="w-full rounded-xl border border-border/70 bg-background/80 py-2.5 pr-10 pl-3.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPw ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      passwordLengthMet
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    )}
                  >
                    <CheckCircle2 className="size-3" />
                    Minimal 8 Karakter
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      passwordComplexityMet
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    )}
                  >
                    <CheckCircle2 className="size-3" />
                    Kombinasi Huruf & Simbol/Angka
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru..."
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden sm:text-sm"
                />
                {confirmPassword && (
                  <p
                    className={cn(
                      "text-[11px] font-medium",
                      passwordsMatch
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {passwordsMatch
                      ? "Konfirmasi password cocok."
                      : "Konfirmasi password belum cocok."}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    isPending ||
                    !passwordLengthMet ||
                    !passwordComplexityMet ||
                    !passwordsMatch
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background transition-transform hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShieldCheck className="size-3.5" />
                  <span>
                    {isPending ? "Memproses..." : "Perbarui Password Sekarang"}
                  </span>
                </button>
              </div>
            </div>
          </section>
        </form>
      )}

      {activeTab === "system" && (
        <div className="space-y-8">
          <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
              <div className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground">
                <RefreshCw className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                  On-Demand ISR Cache Revalidation
                </h2>
                <p className="text-xs text-muted-foreground">
                  Sinkronisasi instan konten statis di seluruh platform monorepo
                  tanpa deploy ulang.
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Perbarui cache halaman statis di aplikasi konsumen (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                portfolio
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                blog
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                shop
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                docs
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                changelog
              </code>
              ) secara otomatis dan instan.
            </p>

            <div className="pt-2">
              <RevalidationButton />
            </div>
          </section>

          <section className="space-y-4">
            <SystemHealthDiagnostics />
          </section>
        </div>
      )}
    </div>
  )
}
