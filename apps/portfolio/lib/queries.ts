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

export type ExperienceItem = (typeof experienceList)[number]
export type EducationItem = (typeof educationList)[number]
export type CertificationItem = (typeof fallbackCertifications)[number]
export type ServiceItem = (typeof fallbackServices)[number]
export type CaseStudyItem = (typeof fallbackCaseStudies)[number]
export type TestimonialItem = (typeof fallbackTestimonials)[number]

type ProfileSelect = typeof profile.$inferSelect
type ExperienceSelect = typeof experiences.$inferSelect
type EducationSelect = typeof education.$inferSelect
type CertificationSelect = typeof certifications.$inferSelect
type ServiceSelect = typeof services.$inferSelect
type CaseStudySelect = typeof caseStudies.$inferSelect
type TestimonialSelect = typeof testimonials.$inferSelect

export async function getProfileData(): Promise<ProfileData> {
  try {
    const rows: ProfileSelect[] = await db.select().from(profile).limit(1)
    const data: ProfileSelect | undefined = rows[0]
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
    const rows: ExperienceSelect[] = await db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.displayOrder), desc(experiences.createdAt))

    if (rows.length > 0) {
      return rows.map(
        (exp: ExperienceSelect): ExperienceItem => ({
          logo: "",
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
        })
      )
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
    const rows: EducationSelect[] = await db
      .select()
      .from(education)
      .orderBy(asc(education.displayOrder), desc(education.createdAt))

    if (rows.length > 0) {
      return rows.map(
        (edu: EducationSelect): EducationItem => ({
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          period: `${edu.startYear} – ${edu.endYear || "Present"}`,
        })
      )
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
    const rows: CertificationSelect[] = await db
      .select()
      .from(certifications)
      .orderBy(asc(certifications.displayOrder), desc(certifications.createdAt))

    if (rows.length > 0) {
      return rows.map(
        (cert: CertificationSelect, idx: number): CertificationItem => ({
          id: idx + 1,
          title: cert.title,
          thumbnail:
            cert.badgeUrl ||
            "https://templated-assets.s3.us-east-1.amazonaws.com/public/thumbnail/97d2bca7-9815-4947-bb9d-d7f7b7f3b082.webp",
        })
      )
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
    const rows: ServiceSelect[] = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.displayOrder), desc(services.createdAt))

    if (rows.length > 0) {
      return rows.map(
        (s: ServiceSelect): ServiceItem => ({
          title: s.title,
          description: s.summary || s.description,
          features: s.deliverables || [],
        })
      )
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch services, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return fallbackServices
}

export async function getCaseStudies(): Promise<CaseStudyItem[]> {
  try {
    const rows: CaseStudySelect[] = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.isPublished, true))
      .orderBy(asc(caseStudies.displayOrder), desc(caseStudies.createdAt))

    if (rows.length > 0) {
      return rows.map(
        (cs: CaseStudySelect, idx: number): CaseStudyItem => ({
          id: idx + 1,
          category: cs.clientName || "Case Study",
          title: cs.title,
          image:
            cs.thumbnailUrl ||
            "https://res.cloudinary.com/dhaonb1vn/image/upload/v1782231915/pexels-photo-35239459_igdi3o.jpg",
        })
      )
    }
  } catch (error: unknown) {
    console.warn(
      "[Portfolio Data Layer] Failed to fetch case studies, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }
  return fallbackCaseStudies
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const rows: TestimonialSelect[] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isFeatured, true))
      .orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt))

    if (rows.length > 0) {
      return rows.map(
        (t: TestimonialSelect): TestimonialItem => ({
          name: t.clientName,
          handle: `${t.role || ""} at ${t.company || ""}`.replace(
            /^ at | at $/,
            ""
          ),
          avatar:
            t.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          content: t.content,
        })
      )
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
