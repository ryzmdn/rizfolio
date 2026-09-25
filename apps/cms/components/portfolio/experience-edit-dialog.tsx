"use client"

import { useState } from "react"
import { X, Save, Loader2 } from "lucide-react"
import {
  updateExperience,
  updateEducation,
} from "@/lib/actions/portfolio-actions"

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
}

interface ExperienceEditDialogProps {
  experience?: ExperienceItem | null
  education?: EducationItem | null
  isOpen: boolean
  onClose: () => void
}

function ExperienceForm({
  experience,
  onClose,
}: {
  experience: ExperienceItem
  onClose: () => void
}) {
  const [company, setCompany] = useState(experience.company || "")
  const [role, setRole] = useState(experience.role || "")
  const [location, setLocation] = useState(experience.location || "")
  const [companyLogoUrl, setCompanyLogoUrl] = useState(
    experience.companyLogoUrl || ""
  )
  const [startDate, setStartDate] = useState(experience.startDate || "")
  const [endDate, setEndDate] = useState(experience.endDate || "")
  const [isCurrent, setIsCurrent] = useState(experience.isCurrent ?? false)
  const [description, setDescription] = useState(experience.description || "")
  const [techStackInput, setTechStackInput] = useState(
    experience.techStack?.join(", ") || ""
  )
  const [displayOrder, setDisplayOrder] = useState<number | string>(
    experience.displayOrder || 0
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company.trim() || !role.trim() || !startDate.trim()) return

    const parsedTechStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      await updateExperience(experience.id, {
        company: company.trim(),
        role: role.trim(),
        location: location.trim() || null,
        companyLogoUrl: companyLogoUrl.trim() || null,
        startDate: startDate.trim(),
        endDate: isCurrent ? null : endDate.trim() || null,
        isCurrent,
        description: description.trim(),
        techStack: parsedTechStack.length > 0 ? parsedTechStack : null,
        displayOrder: Number(displayOrder) || 0,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Perusahaan / Organisasi
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Posisi / Peran
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Tanggal Mulai
          </label>
          <input
            type="text"
            placeholder="e.g. Jan 2023"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Tanggal Selesai
          </label>
          <input
            type="text"
            placeholder="e.g. Des 2024"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isCurrent}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none disabled:opacity-50"
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="rounded border-border text-primary"
            />
            <span>Pekerjaan Saat Ini</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Lokasi Kerja
          </label>
          <input
            type="text"
            placeholder="e.g. Jakarta, Indonesia (Remote)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            URL Logo Perusahaan
          </label>
          <input
            type="text"
            placeholder="https://..."
            value={companyLogoUrl}
            onChange={(e) => setCompanyLogoUrl(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Tech Stack (Pisahkan dengan koma)
        </label>
        <input
          type="text"
          placeholder="e.g. TypeScript, React, Next.js, Node.js, PostgreSQL"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Deskripsi Tanggung Jawab & Dampak
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Urutan Tampilan
        </label>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border/80 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border/80 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

function EducationForm({
  education,
  onClose,
}: {
  education: EducationItem
  onClose: () => void
}) {
  const [institution, setInstitution] = useState(education.institution || "")
  const [degree, setDegree] = useState(education.degree || "")
  const [field, setField] = useState(education.field || "")
  const [startYear, setStartYear] = useState(education.startYear || "")
  const [endYear, setEndYear] = useState(education.endYear || "")
  const [gpa, setGpa] = useState(education.gpa || "")
  const [description, setDescription] = useState(education.description || "")
  const [displayOrder, setDisplayOrder] = useState<number | string>(
    education.displayOrder || 0
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!institution.trim() || !degree.trim() || !field.trim()) return

    setIsSubmitting(true)
    try {
      await updateEducation(education.id, {
        institution: institution.trim(),
        degree: degree.trim(),
        field: field.trim(),
        startYear: startYear.trim(),
        endYear: endYear.trim() || null,
        gpa: gpa.trim() || null,
        description: description.trim() || null,
        displayOrder: Number(displayOrder) || 0,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-foreground">
            Institusi / Universitas
          </label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            IPK / GPA (Opsional)
          </label>
          <input
            type="text"
            placeholder="e.g. 3.85 / 4.00"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Jenjang Gelar
          </label>
          <input
            type="text"
            placeholder="e.g. Bachelor of Science"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Bidang Studi / Jurusan
          </label>
          <input
            type="text"
            placeholder="e.g. Computer Science"
            value={field}
            onChange={(e) => setField(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Tahun Mulai
          </label>
          <input
            type="text"
            placeholder="e.g. 2020"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Tahun Selesai
          </label>
          <input
            type="text"
            placeholder="e.g. 2024 atau Present"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Deskripsi Pencapaian Akademik
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Aktivitas riset, publikasi skripsi, atau penghargaan..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Urutan Tampilan
        </label>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border/80 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border/80 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export function ExperienceEditDialog({
  experience,
  education,
  isOpen,
  onClose,
}: ExperienceEditDialogProps) {
  if (!isOpen || (!experience && !education)) return null

  const isEdu = Boolean(education)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEdu ? "Edit Riwayat Pendidikan" : "Edit Pengalaman Kerja"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-50 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {isEdu
                ? `Edit Pendidikan: ${education?.institution}`
                : `Edit Pengalaman: ${experience?.role} @ ${experience?.company}`}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isEdu
                ? "Perbarui institusi, gelar, periode studi, dan catatan akademik."
                : "Perbarui informasi posisi, periode kerja, tanggung jawab, dan tech stack."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {isEdu && education ? (
          <EducationForm key={education.id} education={education} onClose={onClose} />
        ) : experience ? (
          <ExperienceForm key={experience.id} experience={experience} onClose={onClose} />
        ) : null}
      </div>
    </div>
  )
}
