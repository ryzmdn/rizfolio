"use client"

import { useState } from "react"
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Layers,
  Award,
  Quote,
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  Tag,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { ExperienceEditDialog } from "./experience-edit-dialog"
import { CaseStudyManager } from "./case-study-manager"
import { ServiceManager } from "./service-manager"
import { CertificationManager } from "./certification-manager"
import { TestimonialManager } from "./testimonial-manager"
import {
  upsertProfile,
  createExperience,
  deleteExperience,
  createEducation,
  deleteEducation,
} from "@/lib/actions/portfolio-actions"

interface ProfileItem {
  id: string
  fullName: string
  headline: string
  bio: string
  location: string | null
  resumeUrl: string | null
  status: string
  socialLinks: unknown
  updatedAt: Date
}

interface ExperienceItem {
  id: string
  company: string
  role: string
  location: string | null
  companyLogoUrl: string | null
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string
  techStack: string[] | null
  displayOrder: number
  createdAt: Date
}

interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  startYear: string
  endYear: string | null
  gpa: string | null
  description: string | null
  displayOrder: number
  createdAt: Date
}

interface CaseStudyItem {
  id: string
  slug: string
  title: string
  clientName: string | null
  summary: string
  contentMd: string
  thumbnailUrl: string | null
  liveUrl: string | null
  repoUrl: string | null
  metrics: unknown
  isPublished: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

interface ServiceItem {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  deliverables: string[] | null
  startingPrice: number | null
  isActive: boolean
  displayOrder: number
  createdAt: Date
}

interface CertificationItem {
  id: string
  title: string
  issuer: string
  issueDate: string
  expiryDate: string | null
  credentialUrl: string | null
  credentialId: string | null
  badgeUrl: string | null
  displayOrder: number
  createdAt: Date
}

interface TestimonialItem {
  id: string
  clientName: string
  role: string | null
  company: string | null
  content: string
  rating: number
  avatarUrl: string | null
  isFeatured: boolean
  displayOrder: number
  createdAt: Date
}

interface PortfolioManagerViewProps {
  profileData: ProfileItem | null
  experiences: ExperienceItem[]
  education: EducationItem[]
  caseStudies: CaseStudyItem[]
  services: ServiceItem[]
  certifications: CertificationItem[]
  testimonials: TestimonialItem[]
}

type TabKey =
  | "profil"
  | "pengalaman"
  | "kasus"
  | "layanan"
  | "sertifikasi"
  | "testimoni"

interface SocialLinksMap {
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
}

function ProfileTab({ profileData }: { profileData: ProfileItem | null }) {
  const existingLinks = (profileData?.socialLinks as SocialLinksMap) || {}
  const [fullName, setFullName] = useState(profileData?.fullName || "Rizky Ramadhan")
  const [headline, setHeadline] = useState(
    profileData?.headline || "Senior Software Engineer & AI Architect"
  )
  const [bio, setBio] = useState(
    profileData?.bio ||
      "Spesialis arsitektur sistem berskala besar, ekosistem monorepo Next.js, dan rekayasa kecerdasan artifisial terapan."
  )
  const [location, setLocation] = useState(
    profileData?.location || "Jakarta, Indonesia"
  )
  const [resumeUrl, setResumeUrl] = useState(profileData?.resumeUrl || "")
  const [status, setStatus] = useState(profileData?.status || "available")
  const [githubUrl, setGithubUrl] = useState(existingLinks.github || "")
  const [linkedinUrl, setLinkedinUrl] = useState(existingLinks.linkedin || "")
  const [twitterUrl, setTwitterUrl] = useState(existingLinks.twitter || "")
  const [websiteUrl, setWebsiteUrl] = useState(existingLinks.website || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setSaveSuccess(false)
    try {
      await upsertProfile({
        fullName: fullName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim() || null,
        resumeUrl: resumeUrl.trim() || null,
        status,
        socialLinks: {
          github: githubUrl.trim() || undefined,
          linkedin: linkedinUrl.trim() || undefined,
          twitter: twitterUrl.trim() || undefined,
          website: websiteUrl.trim() || undefined,
        },
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <form
          onSubmit={handleProfileSubmit}
          className="space-y-5 rounded-xl border border-border/80 bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Informasi Biodata & Profil Publik
              </h3>
            </div>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Tersimpan
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Nama Lengkap
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Headline Profesional
              </label>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Bio / Ringkasan Narasi
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Domisili / Lokasi
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                URL Dokumen Resume (PDF)
              </label>
              <input
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Status Ketersediaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="available">Tersedia untuk Kontrak / Proyek</option>
                <option value="busy">Sedang Penuh (Busy)</option>
                <option value="unavailable">Tidak Menerima Tawaran</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
              Tautan Jaringan & Sosial
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  GitHub Profile URL
                </label>
                <input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  LinkedIn Profile URL
                </label>
                <input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  X / Twitter URL
                </label>
                <input
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Situs Pribadi / Domain
                </label>
                <input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan Profil...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Simpan Profil
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Pratinjau Kartu Portofolio
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{fullName}</h3>
                <p className="text-xs text-muted-foreground">{headline}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {bio}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {location}
              </span>
              <span>•</span>
              <Badge
                variant={status === "available" ? "default" : "secondary"}
                className={`text-[10px] font-medium ${
                  status === "available"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {status === "available"
                  ? "Tersedia"
                  : status === "busy"
                    ? "Sedang Penuh"
                    : "Tidak Aktif"}
              </Badge>
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <FileText className="h-3.5 w-3.5" />
                Unduh Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExperienceAndEducationTab({
  experiences,
  education,
}: {
  experiences: ExperienceItem[]
  education: EducationItem[]
}) {
  const [subTab, setSubTab] = useState<"experience" | "education">("experience")
  const [isAddExpOpen, setIsAddExpOpen] = useState(false)
  const [isAddEduOpen, setIsAddEduOpen] = useState(false)

  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null)
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null)

  const [expCompany, setExpCompany] = useState("")
  const [expRole, setExpRole] = useState("")
  const [expLocation, setExpLocation] = useState("")
  const [expStartDate, setExpStartDate] = useState("")
  const [expEndDate, setExpEndDate] = useState("")
  const [expIsCurrent, setExpIsCurrent] = useState(false)
  const [expDescription, setExpDescription] = useState("")
  const [expTechStack, setExpTechStack] = useState("")
  const [expDisplayOrder, setExpDisplayOrder] = useState<number | string>(0)
  const [isSubmittingExp, setIsSubmittingExp] = useState(false)

  const [eduInstitution, setEduInstitution] = useState("")
  const [eduDegree, setEduDegree] = useState("")
  const [eduField, setEduField] = useState("")
  const [eduStartYear, setEduStartYear] = useState("")
  const [eduEndYear, setEduEndYear] = useState("")
  const [eduGpa, setEduGpa] = useState("")
  const [eduDescription, setEduDescription] = useState("")
  const [eduDisplayOrder, setEduDisplayOrder] = useState<number | string>(0)
  const [isSubmittingEdu, setIsSubmittingEdu] = useState(false)

  const [deletingExpId, setDeletingExpId] = useState<string | null>(null)
  const [deletingEduId, setDeletingEduId] = useState<string | null>(null)

  async function handleCreateExp(e: React.FormEvent) {
    e.preventDefault()
    if (!expCompany.trim() || !expRole.trim() || !expStartDate.trim()) return

    const parsedTech = expTechStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    setIsSubmittingExp(true)
    try {
      await createExperience({
        company: expCompany.trim(),
        role: expRole.trim(),
        location: expLocation.trim() || null,
        companyLogoUrl: null,
        startDate: expStartDate.trim(),
        endDate: expIsCurrent ? null : expEndDate.trim() || null,
        isCurrent: expIsCurrent,
        description: expDescription.trim(),
        techStack: parsedTech,
        displayOrder: Number(expDisplayOrder) || 0,
      })
      setExpCompany("")
      setExpRole("")
      setExpLocation("")
      setExpStartDate("")
      setExpEndDate("")
      setExpIsCurrent(false)
      setExpDescription("")
      setExpTechStack("")
      setIsAddExpOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmittingExp(false)
    }
  }

  async function handleCreateEdu(e: React.FormEvent) {
    e.preventDefault()
    if (!eduInstitution.trim() || !eduDegree.trim() || !eduStartYear.trim()) return

    setIsSubmittingEdu(true)
    try {
      await createEducation({
        institution: eduInstitution.trim(),
        degree: eduDegree.trim(),
        field: eduField.trim(),
        startYear: eduStartYear.trim(),
        endYear: eduEndYear.trim() || null,
        gpa: eduGpa.trim() || null,
        description: eduDescription.trim() || null,
        displayOrder: Number(eduDisplayOrder) || 0,
      })
      setEduInstitution("")
      setEduDegree("")
      setEduField("")
      setEduStartYear("")
      setEduEndYear("")
      setEduGpa("")
      setEduDescription("")
      setIsAddEduOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmittingEdu(false)
    }
  }

  async function handleDeleteExp(id: string) {
    setDeletingExpId(id)
    try {
      await deleteExperience(id)
    } catch (error) {
      console.error(error)
    } finally {
      setDeletingExpId(null)
    }
  }

  async function handleDeleteEdu(id: string) {
    setDeletingEduId(id)
    try {
      await deleteEducation(id)
    } catch (error) {
      console.error(error)
    } finally {
      setDeletingEduId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab("experience")}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              subTab === "experience"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Riwayat Pekerjaan ({experiences.length})
          </button>
          <button
            onClick={() => setSubTab("education")}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              subTab === "education"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Riwayat Pendidikan ({education.length})
          </button>
        </div>

        {subTab === "experience" ? (
          <button
            onClick={() => setIsAddExpOpen(!isAddExpOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Pengalaman
          </button>
        ) : (
          <button
            onClick={() => setIsAddEduOpen(!isAddEduOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Pendidikan
          </button>
        )}
      </div>

      {subTab === "experience" && (
        <div className="space-y-6">
          {isAddExpOpen && (
            <form
              onSubmit={handleCreateExp}
              className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h4 className="text-xs font-semibold text-foreground">
                Tambah Riwayat Pengalaman Baru
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Perusahaan / Instansi
                  </label>
                  <input
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    required
                    placeholder="cth: Google Cloud"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Posisi / Jabatan
                  </label>
                  <input
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    required
                    placeholder="cth: Senior Cloud Architect"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Lokasi
                  </label>
                  <input
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    placeholder="cth: Jakarta, ID (Remote)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Tanggal Mulai
                  </label>
                  <input
                    value={expStartDate}
                    onChange={(e) => setExpStartDate(e.target.value)}
                    required
                    placeholder="cth: Jan 2022"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Tanggal Selesai
                  </label>
                  <input
                    value={expEndDate}
                    onChange={(e) => setExpEndDate(e.target.value)}
                    disabled={expIsCurrent}
                    placeholder="cth: Des 2023"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Status Pekerjaan
                  </label>
                  <div className="flex h-9 items-center gap-2">
                    <input
                      type="checkbox"
                      id="new-exp-current"
                      checked={expIsCurrent}
                      onChange={(e) => setExpIsCurrent(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="new-exp-current"
                      className="text-xs font-medium text-foreground cursor-pointer"
                    >
                      Masih Bekerja
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Deskripsi Tanggung Jawab & Pencapaian
                </label>
                <textarea
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Jelaskan peran utama dan pencapaian strategis..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Tech Stack (Pisahkan dengan koma)
                  </label>
                  <input
                    value={expTechStack}
                    onChange={(e) => setExpTechStack(e.target.value)}
                    placeholder="TypeScript, Next.js, Docker, Kubernetes, PostgreSQL"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-medium text-foreground">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    value={expDisplayOrder}
                    onChange={(e) => setExpDisplayOrder(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpOpen(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExp}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmittingExp ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Simpan Pengalaman
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-shadow hover:shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="text-sm font-semibold text-foreground">
                          {exp.role}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          di
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {exp.company}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {exp.startDate} - {exp.isCurrent ? "Sekarang" : exp.endDate}
                        </span>
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {exp.isCurrent && (
                      <Badge
                        variant="default"
                        className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px]"
                      >
                        Posisi Saat Ini
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>

                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-foreground"
                        >
                          <Tag className="h-2.5 w-2.5 text-muted-foreground" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingExp(exp)}
                    className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Pencil className="h-3 w-3" />
                    Ubah
                  </button>
                  <button
                    type="button"
                    disabled={deletingExpId === exp.id}
                    onClick={() => handleDeleteExp(exp.id)}
                    className="inline-flex items-center gap-1 rounded border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
                  >
                    {deletingExpId === exp.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Hapus
                  </button>
                </div>
              </div>
            ))}

            {experiences.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <Briefcase className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Belum ada riwayat pekerjaan
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Catat rekam jejak karir dan tanggung jawab profesional Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === "education" && (
        <div className="space-y-6">
          {isAddEduOpen && (
            <form
              onSubmit={handleCreateEdu}
              className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h4 className="text-xs font-semibold text-foreground">
                Tambah Riwayat Pendidikan Baru
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Institusi / Universitas
                  </label>
                  <input
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    required
                    placeholder="cth: Universitas Indonesia"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Gelar / Jenjang
                  </label>
                  <input
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    required
                    placeholder="cth: Sarjana Ilmu Komputer (S.Kom)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Bidang Studi / Jurusan
                  </label>
                  <input
                    value={eduField}
                    onChange={(e) => setEduField(e.target.value)}
                    required
                    placeholder="cth: Teknik Informatika"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Tahun Masuk
                  </label>
                  <input
                    value={eduStartYear}
                    onChange={(e) => setEduStartYear(e.target.value)}
                    required
                    placeholder="cth: 2018"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Tahun Lulus
                  </label>
                  <input
                    value={eduEndYear}
                    onChange={(e) => setEduEndYear(e.target.value)}
                    placeholder="cth: 2022"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    IPK / GPA
                  </label>
                  <input
                    value={eduGpa}
                    onChange={(e) => setEduGpa(e.target.value)}
                    placeholder="cth: 3.85 / 4.00"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Catatan / Keterangan Akademik
                  </label>
                  <textarea
                    value={eduDescription}
                    onChange={(e) => setEduDescription(e.target.value)}
                    rows={2}
                    placeholder="Aktivitas riset, topik skripsi, atau penghargaan kelulusan..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-medium text-foreground">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    value={eduDisplayOrder}
                    onChange={(e) => setEduDisplayOrder(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEduOpen(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdu}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmittingEdu ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Simpan Pendidikan
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-shadow hover:shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="text-sm font-semibold text-foreground">
                          {edu.degree}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          -
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {edu.field}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {edu.institution}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {edu.startYear} - {edu.endYear || "Sekarang"}
                        </span>
                        {edu.gpa && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="font-mono text-[10px]">
                              IPK {edu.gpa}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {edu.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingEdu(edu)}
                    className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Pencil className="h-3 w-3" />
                    Ubah
                  </button>
                  <button
                    type="button"
                    disabled={deletingEduId === edu.id}
                    onClick={() => handleDeleteEdu(edu.id)}
                    className="inline-flex items-center gap-1 rounded border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
                  >
                    {deletingEduId === edu.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Hapus
                  </button>
                </div>
              </div>
            ))}

            {education.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Belum ada riwayat pendidikan
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Daftarkan riwayat studi akademik dan kualifikasi pendidikan Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <ExperienceEditDialog
        experience={editingExp}
        isOpen={Boolean(editingExp)}
        onClose={() => setEditingExp(null)}
      />

      <ExperienceEditDialog
        education={editingEdu}
        isOpen={Boolean(editingEdu)}
        onClose={() => setEditingEdu(null)}
      />
    </div>
  )
}

export function PortfolioManagerView({
  profileData,
  experiences,
  education,
  caseStudies,
  services,
  certifications,
  testimonials,
}: PortfolioManagerViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("profil")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("profil")}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors shrink-0 ${
            activeTab === "profil"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Profil & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab("pengalaman")}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors shrink-0 ${
            activeTab === "pengalaman"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" />
          <span>Pengalaman & Edukasi</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              activeTab === "pengalaman"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {experiences.length + education.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("kasus")}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors shrink-0 ${
            activeTab === "kasus"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <FolderGit2 className="h-3.5 w-3.5" />
          <span>Studi Kasus</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              activeTab === "kasus"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {caseStudies.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("layanan")}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors shrink-0 ${
            activeTab === "layanan"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Layanan Profesional</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              activeTab === "layanan"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {services.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("sertifikasi")}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors shrink-0 ${
            activeTab === "sertifikasi"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>Sertifikasi</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              activeTab === "sertifikasi"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {certifications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("testimoni")}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors shrink-0 ${
            activeTab === "testimoni"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Quote className="h-3.5 w-3.5" />
          <span>Testimoni</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              activeTab === "testimoni"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {testimonials.length}
          </span>
        </button>
      </div>

      <div>
        {activeTab === "profil" && <ProfileTab profileData={profileData} />}

        {activeTab === "pengalaman" && (
          <ExperienceAndEducationTab
            experiences={experiences}
            education={education}
          />
        )}

        {activeTab === "kasus" && (
          <CaseStudyManager caseStudies={caseStudies} />
        )}

        {activeTab === "layanan" && (
          <ServiceManager services={services} />
        )}

        {activeTab === "sertifikasi" && (
          <CertificationManager certifications={certifications} />
        )}

        {activeTab === "testimoni" && (
          <TestimonialManager testimonials={testimonials} />
        )}
      </div>
    </div>
  )
}
