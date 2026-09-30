import { cache } from "react"
import { unstable_cache } from "next/cache"
import {
  db,
  profile,
  experiences,
  education,
  certifications,
  services,
  caseStudies,
  testimonials,
  eq,
  asc,
  desc,
} from "@workspace/db"

import {
  personalInfo,
  experienceList,
  educationList,
  certifications as fallbackCertifications,
  services as fallbackServices,
  caseStudies as fallbackCaseStudies,
  testimonials as fallbackTestimonials,
} from "@/data"

export type ProfileData = typeof personalInfo & {
  status?: string
  location?: string | null
  resumeUrl?: string | null
}

export type ExperienceItem = {
  logo?: string
  role: string
  company: string
  type?: string
  location?: string
  period: string
  workMode?: string
  description: string
  skills?: string[]
}
export type EducationItem = (typeof educationList)[number]
export type CertificationItem = (typeof fallbackCertifications)[number]
export type ServiceItem = (typeof fallbackServices)[number]
export type CaseStudyItem = (typeof fallbackCaseStudies)[number]
export type TestimonialItem = (typeof fallbackTestimonials)[number]

/**
 * SLA-guaranteed execution with fast fallback timeout.
 * Prevents cold-start or remote database latencies from hanging page loads.
 */
async function withTimeout<T>(
  promise: Promise<T>,
  ms = 1200,
  fallback: T
): Promise<T> {
  let timer: NodeJS.Timeout
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms)
  })
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer)
  })
}

export async function getProfileData(): Promise<ProfileData> {
  try {
    const query = db
      .select({
        fullName: profile.fullName,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        resumeUrl: profile.resumeUrl,
        status: profile.status,
      })
      .from(profile)
      .limit(1)

    const rows = await withTimeout(query, 1200, [])
    const data = rows[0]
    if (data) {
      const bioParagraphs: string[] = data.bio
        ? data.bio.split("\n\n").filter(Boolean)
        : personalInfo.bio

      return {
        ...personalInfo,
        name: data.fullName || personalInfo.name,
        headline: data.headline || personalInfo.headline,
        bio: bioParagraphs.length > 0 ? bioParagraphs : personalInfo.bio,
        location: data.location,
        resumeUrl: data.resumeUrl,
        status: data.status || "available",
      }
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch profile from DB, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return personalInfo
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  try {
    const query = db
      .select({
        companyLogoUrl: experiences.companyLogoUrl,
        role: experiences.role,
        company: experiences.company,
        location: experiences.location,
        startDate: experiences.startDate,
        endDate: experiences.endDate,
        isCurrent: experiences.isCurrent,
        description: experiences.description,
        techStack: experiences.techStack,
      })
      .from(experiences)
      .orderBy(asc(experiences.displayOrder), desc(experiences.createdAt))

    const rows = await withTimeout(query, 1200, [])
    if (rows && rows.length > 0) {
      return rows.map((exp): ExperienceItem => ({
        logo: exp.companyLogoUrl || "",
        role: exp.role,
        company: exp.company,
        type: "Full-Time",
        location: exp.location || "Jakarta / Remote",
        period: `${exp.startDate} – ${exp.isCurrent ? "Present" : exp.endDate || ""}`,
        workMode: exp.location?.toLowerCase().includes("remote")
          ? "Remote"
          : "On-site",
        description: exp.description,
        skills: exp.techStack || [],
      }))
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch experiences, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return experienceList
}

export async function getEducationList(): Promise<EducationItem[]> {
  try {
    const query = db
      .select({
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        startYear: education.startYear,
        endYear: education.endYear,
      })
      .from(education)
      .orderBy(asc(education.displayOrder), desc(education.createdAt))

    const rows = await withTimeout(query, 1200, [])
    if (rows && rows.length > 0) {
      return rows.map((edu): EducationItem => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        period: `${edu.startYear} – ${edu.endYear || "Present"}`,
      }))
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch education, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return educationList
}

export async function getCertifications(): Promise<CertificationItem[]> {
  try {
    const query = db
      .select({
        title: certifications.title,
        badgeUrl: certifications.badgeUrl,
      })
      .from(certifications)
      .orderBy(asc(certifications.displayOrder), desc(certifications.createdAt))

    const rows = await withTimeout(query, 1200, [])
    if (rows && rows.length > 0) {
      return rows.map((cert, idx: number): CertificationItem => ({
        id: idx + 1,
        title: cert.title,
        thumbnail:
          cert.badgeUrl ||
          "https://templated-assets.s3.us-east-1.amazonaws.com/public/thumbnail/97d2bca7-9815-4947-bb9d-d7f7b7f3b082.webp",
      }))
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch certifications, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return fallbackCertifications
}

export async function getServicesList(): Promise<ServiceItem[]> {
  try {
    const query = db
      .select({
        title: services.title,
        summary: services.summary,
        description: services.description,
        deliverables: services.deliverables,
      })
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.displayOrder), desc(services.createdAt))

    const rows = await withTimeout(query, 1200, [])
    if (rows && rows.length > 0) {
      return rows.map((s): ServiceItem => ({
        title: s.title,
        description: s.summary || s.description,
        features: s.deliverables || [],
      }))
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch services, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return fallbackServices
}

async function fetchCaseStudiesInternal(): Promise<CaseStudyItem[]> {
  try {
    const query = db
      .select({
        id: caseStudies.id,
        slug: caseStudies.slug,
        clientName: caseStudies.clientName,
        title: caseStudies.title,
        summary: caseStudies.summary,
        contentMd: caseStudies.contentMd,
        thumbnailUrl: caseStudies.thumbnailUrl,
        liveUrl: caseStudies.liveUrl,
        repoUrl: caseStudies.repoUrl,
        metrics: caseStudies.metrics,
      })
      .from(caseStudies)
      .where(eq(caseStudies.isPublished, true))
      .orderBy(asc(caseStudies.displayOrder), desc(caseStudies.createdAt))

    const rows = await withTimeout(query, 1200, [])

    if (rows && rows.length > 0) {
      return rows.map((cs): CaseStudyItem => {
        const fallback = fallbackCaseStudies.find((f) => f.slug === cs.slug)
        return {
          id: cs.id,
          slug: cs.slug,
          category: cs.clientName || fallback?.category || "Case Study",
          title: cs.title,
          clientName: cs.clientName || fallback?.clientName || "Engineering Client",
          summary: cs.summary || fallback?.summary || "",
          contentMd: cs.contentMd || fallback?.contentMd || "",
          image:
            cs.thumbnailUrl ||
            fallback?.image ||
            "https://res.cloudinary.com/dhaonb1vn/image/upload/v1782231915/pexels-photo-35239459_igdi3o.jpg",
          liveUrl: cs.liveUrl || fallback?.liveUrl,
          repoUrl: cs.repoUrl || fallback?.repoUrl,
          metrics: (cs.metrics as Record<string, string | number>) || fallback?.metrics,
          techStack: fallback?.techStack || ["TypeScript", "Next.js", "PostgreSQL"],
          year: fallback?.year || "2025",
          role: fallback?.role || "Lead Architect",
        }
      })
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch case studies, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return fallbackCaseStudies
}

const cachedGetCaseStudies = unstable_cache(
  fetchCaseStudiesInternal,
  ["portfolio-case-studies-list"],
  {
    revalidate: 3600,
    tags: ["case-studies", "portfolio"],
  }
)

/**
 * Memoized per-request and cached across requests.
 * Instant sub-millisecond retrieval.
 */
export const getCaseStudies = cache(async (): Promise<CaseStudyItem[]> => {
  return cachedGetCaseStudies()
})

async function fetchCaseStudyBySlugInternal(
  slug: string
): Promise<CaseStudyItem | null> {
  const all = await cachedGetCaseStudies()
  const found = all.find((s) => s.slug === slug)
  if (found) return found

  try {
    const query = db
      .select({
        id: caseStudies.id,
        slug: caseStudies.slug,
        clientName: caseStudies.clientName,
        title: caseStudies.title,
        summary: caseStudies.summary,
        contentMd: caseStudies.contentMd,
        thumbnailUrl: caseStudies.thumbnailUrl,
        liveUrl: caseStudies.liveUrl,
        repoUrl: caseStudies.repoUrl,
        metrics: caseStudies.metrics,
      })
      .from(caseStudies)
      .where(eq(caseStudies.slug, slug))
      .limit(1)

    const rows = await withTimeout(query, 1200, [])
    const cs = rows[0]
    if (cs) {
      const fallback = fallbackCaseStudies.find((f) => f.slug === cs.slug)
      return {
        id: cs.id,
        slug: cs.slug,
        category: cs.clientName || fallback?.category || "Case Study",
        title: cs.title,
        clientName: cs.clientName || fallback?.clientName || "Engineering Client",
        summary: cs.summary || fallback?.summary || "",
        contentMd: cs.contentMd || fallback?.contentMd || "",
        image:
          cs.thumbnailUrl ||
          fallback?.image ||
          "https://res.cloudinary.com/dhaonb1vn/image/upload/v1782231915/pexels-photo-35239459_igdi3o.jpg",
        liveUrl: cs.liveUrl || fallback?.liveUrl,
        repoUrl: cs.repoUrl || fallback?.repoUrl,
        metrics: (cs.metrics as Record<string, string | number>) || fallback?.metrics,
        techStack: fallback?.techStack || ["TypeScript", "Next.js", "PostgreSQL"],
        year: fallback?.year || "2025",
        role: fallback?.role || "Lead Architect",
      }
    }
  } catch (error: unknown) {
    console.warn(
      `[Portfolio Data Layer] Failed to fetch case study by slug (${slug}):`,
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  const fallback = fallbackCaseStudies.find((f) => f.slug === slug)
  return fallback || null
}

const cachedGetCaseStudyBySlug = unstable_cache(
  fetchCaseStudyBySlugInternal,
  ["portfolio-case-study-by-slug"],
  {
    revalidate: 3600,
    tags: ["case-studies", "portfolio"],
  }
)

export const getCaseStudyBySlug = cache(
  async (slug: string): Promise<CaseStudyItem | null> => {
    return cachedGetCaseStudyBySlug(slug)
  }
)

export const getAllCaseStudySlugs = cache(async (): Promise<string[]> => {
  const all = await getCaseStudies()
  return Array.from(new Set(all.map((s) => s.slug)))
})

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const query = db
      .select({
        clientName: testimonials.clientName,
        role: testimonials.role,
        company: testimonials.company,
        avatarUrl: testimonials.avatarUrl,
        content: testimonials.content,
      })
      .from(testimonials)
      .where(eq(testimonials.isFeatured, true))
      .orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt))

    const rows = await withTimeout(query, 1200, [])
    if (rows && rows.length > 0) {
      return rows.map((t): TestimonialItem => ({
        name: t.clientName,
        handle: `${t.role || ""} at ${t.company || ""}`.replace(
          /^ at | at $/,
          ""
        ),
        avatar:
          t.avatarUrl ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        content: t.content,
      }))
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch testimonials, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return fallbackTestimonials
}

async function fetchPortfolioPageData() {
  const [
    profileData,
    experiencesData,
    educationData,
    certificationsData,
    servicesData,
    caseStudiesData,
    testimonialsData,
  ] = await Promise.all([
    getProfileData(),
    getExperiences(),
    getEducationList(),
    getCertifications(),
    getServicesList(),
    getCaseStudies(),
    getTestimonials(),
  ])

  return {
    profile: profileData,
    experiences: experiencesData,
    education: educationData,
    certifications: certificationsData,
    services: servicesData,
    caseStudies: caseStudiesData,
    testimonials: testimonialsData,
  }
}

export const getPortfolioPageData = unstable_cache(
  fetchPortfolioPageData,
  ["portfolio-page-data"],
  {
    revalidate: 3600,
    tags: ["portfolio"],
  }
)
