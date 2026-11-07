"use server"

import { db, eq, desc, asc, isDbConfigured } from "@workspace/db"
import {
  profile,
  experiences,
  education,
  certifications,
  services,
  caseStudies,
  testimonials,
} from "@workspace/db/schema"
import {
  insertProfileSchema,
  insertExperienceSchema,
  insertEducationSchema,
  insertCertificationSchema,
  insertServiceSchema,
  insertCaseStudySchema,
  insertTestimonialSchema,
} from "@workspace/db"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation } from "../revalidate"
import {
  fallbackCmsProfile,
  fallbackCmsExperiences,
  fallbackCmsEducation,
  fallbackCmsCertifications,
  fallbackCmsServices,
  fallbackCmsCaseStudies,
  fallbackCmsTestimonials,
} from "../fallback-data"

function dispatchPortfolioRevalidation() {
  dispatchBackgroundRevalidation([
    { app: "portfolio", path: "/" },
    { app: "linkbio", path: "/" },
  ])
}

export async function getProfile() {
  if (!isDbConfigured) {
    return fallbackCmsProfile
  }
  try {
    const [data] = await db.select().from(profile).limit(1)
    return data || fallbackCmsProfile
  } catch (error) {
    console.warn(
      "[CMS Portfolio] Database profile fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsProfile
  }
}

export async function upsertProfile(values: typeof profile.$inferInsert) {
  const validated = insertProfileSchema.partial().parse(values)
  let saved = null

  if (isDbConfigured) {
    try {
      saved = await db.transaction(async (tx) => {
        const [existing] = await tx.select().from(profile).limit(1)
        if (existing) {
          const [updated] = await tx
            .update(profile)
            .set(validated)
            .where(eq(profile.id, existing.id))
            .returning()
          logTransaction({
            domain: "PORTFOLIO",
            actionType: "PROFILE_UPDATED",
            status: "COMPLETED",
            entityType: "profile",
            entityId: existing.id,
            payloadAfter: validated,
          })
          return updated
        } else {
          const [inserted] = await tx
            .insert(profile)
            .values(validated as typeof profile.$inferInsert)
            .returning()
          if (inserted) {
            logTransaction({
              domain: "PORTFOLIO",
              actionType: "PROFILE_CREATED",
              status: "COMPLETED",
              entityType: "profile",
              entityId: inserted.id,
              payloadAfter: validated,
            })
          }
          return inserted
        }
      })
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Profile upsert warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!saved) {
    saved = {
      id: "prof-1",
      ...validated,
    }
  }

  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
  return saved
}

export async function getExperiences() {
  if (!isDbConfigured) {
    return fallbackCmsExperiences
  }
  try {
    const rows = await db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.displayOrder), desc(experiences.startDate))

    return rows.length > 0 ? rows : fallbackCmsExperiences
  } catch (error) {
    console.warn(
      "[CMS Portfolio] Database experiences fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsExperiences
  }
}

export async function createExperience(
  values: typeof experiences.$inferInsert
) {
  const validated = insertExperienceSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(experiences).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Experience create warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  logTransaction({
    domain: "PORTFOLIO",
    actionType: "EXPERIENCE_CREATED",
    status: "COMPLETED",
    entityType: "experiences",
    entityId: created.id,
    payloadAfter: { company: created.company, role: created.role },
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateExperience(
  id: string,
  values: Partial<typeof experiences.$inferInsert>
) {
  const validated = insertExperienceSchema.partial().parse(values)
  if (isDbConfigured) {
    try {
      await db.update(experiences).set(validated).where(eq(experiences.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Experience update warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  logTransaction({
    domain: "PORTFOLIO",
    actionType: "EXPERIENCE_UPDATED",
    status: "COMPLETED",
    entityType: "experiences",
    entityId: id,
    payloadAfter: validated,
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteExperience(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(experiences).where(eq(experiences.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Experience delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  logTransaction({
    domain: "PORTFOLIO",
    actionType: "EXPERIENCE_DELETED",
    status: "COMPLETED",
    entityType: "experiences",
    entityId: id,
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function getEducation() {
  if (!isDbConfigured) {
    return fallbackCmsEducation
  }
  try {
    const rows = await db
      .select()
      .from(education)
      .orderBy(asc(education.displayOrder), desc(education.startYear))

    return rows.length > 0 ? rows : fallbackCmsEducation
  } catch (error) {
    console.warn(
      "[CMS Portfolio] Database education fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsEducation
  }
}

export async function createEducation(values: typeof education.$inferInsert) {
  const validated = insertEducationSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(education).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Education create warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  logTransaction({
    domain: "PORTFOLIO",
    actionType: "EDUCATION_CREATED",
    status: "COMPLETED",
    entityType: "education",
    entityId: created.id,
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateEducation(
  id: string,
  values: Partial<typeof education.$inferInsert>
) {
  const validated = insertEducationSchema.partial().parse(values)
  if (isDbConfigured) {
    try {
      await db.update(education).set(validated).where(eq(education.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Education update warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteEducation(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(education).where(eq(education.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Education delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function getCertifications() {
  if (!isDbConfigured) {
    return fallbackCmsCertifications
  }
  try {
    const rows = await db
      .select()
      .from(certifications)
      .orderBy(asc(certifications.displayOrder), desc(certifications.issueDate))

    return rows.length > 0 ? rows : fallbackCmsCertifications
  } catch (error) {
    console.warn(
      "[CMS Portfolio] Database certifications fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsCertifications
  }
}

export async function createCertification(
  values: typeof certifications.$inferInsert
) {
  const validated = insertCertificationSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .insert(certifications)
        .values(validated)
        .returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Certification create warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  logTransaction({
    domain: "PORTFOLIO",
    actionType: "CERTIFICATION_CREATED",
    status: "COMPLETED",
    entityType: "certifications",
    entityId: created.id,
    payloadAfter: { title: created.title, issuer: created.issuer },
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateCertification(
  id: string,
  values: Partial<typeof certifications.$inferInsert>
) {
  const validated = insertCertificationSchema.partial().parse(values)
  if (isDbConfigured) {
    try {
      await db
        .update(certifications)
        .set(validated)
        .where(eq(certifications.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Certification update warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteCertification(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(certifications).where(eq(certifications.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Certification delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function getServices() {
  if (!isDbConfigured) {
    return fallbackCmsServices
  }
  try {
    const rows = await db
      .select()
      .from(services)
      .orderBy(asc(services.displayOrder))
    return rows.length > 0 ? rows : fallbackCmsServices
  } catch (error) {
    console.warn(
      "[CMS Portfolio] Database services fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsServices
  }
}

export async function createService(values: typeof services.$inferInsert) {
  const validated = insertServiceSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(services).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Service create warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  logTransaction({
    domain: "PORTFOLIO",
    actionType: "SERVICE_CREATED",
    status: "COMPLETED",
    entityType: "services",
    entityId: created.id,
    amount: created.startingPrice || 0,
    currency: "IDR",
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateService(
  id: string,
  values: Partial<typeof services.$inferInsert>
) {
  const validated = insertServiceSchema.partial().parse(values)
  if (isDbConfigured) {
    try {
      await db.update(services).set(validated).where(eq(services.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Service update warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteService(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(services).where(eq(services.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Service delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function getCaseStudies() {
  if (!isDbConfigured) {
    return fallbackCmsCaseStudies
  }
  try {
    const rows = await db
      .select()
      .from(caseStudies)
      .orderBy(asc(caseStudies.displayOrder))

    return rows.length > 0 ? rows : fallbackCmsCaseStudies
  } catch (error) {
    console.warn(
      "[CMS Portfolio] Database case studies fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsCaseStudies
  }
}

export async function createCaseStudy(values: typeof caseStudies.$inferInsert) {
  const validated = insertCaseStudySchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(caseStudies).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Case study create warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  logTransaction({
    domain: "PORTFOLIO",
    actionType: created.isPublished
      ? "CASE_STUDY_PUBLISHED"
      : "CASE_STUDY_DRAFTED",
    status: "COMPLETED",
    entityType: "case_studies",
    entityId: created.id,
    caseStudyId: created.id,
    payloadAfter: { slug: created.slug, title: created.title },
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateCaseStudy(
  id: string,
  values: Partial<typeof caseStudies.$inferInsert>
) {
  const validated = insertCaseStudySchema.partial().parse(values)
  if (isDbConfigured) {
    try {
      await db.update(caseStudies).set(validated).where(eq(caseStudies.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Case study update warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  logTransaction({
    domain: "PORTFOLIO",
    actionType: "CASE_STUDY_UPDATED",
    status: "COMPLETED",
    entityType: "case_studies",
    entityId: id,
    caseStudyId: id,
    payloadAfter: validated,
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteCaseStudy(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(caseStudies).where(eq(caseStudies.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Case study delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  logTransaction({
    domain: "PORTFOLIO",
    actionType: "CASE_STUDY_DELETED",
    status: "COMPLETED",
    entityType: "case_studies",
    entityId: id,
    caseStudyId: id,
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function getTestimonials() {
  if (!isDbConfigured) {
    return fallbackCmsTestimonials
  }
  try {
    const rows = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.displayOrder))

    return rows.length > 0 ? rows : fallbackCmsTestimonials
  } catch (error) {
    console.warn(
      "[CMS Portfolio] Database testimonials fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsTestimonials
  }
}

export async function createTestimonial(
  values: typeof testimonials.$inferInsert
) {
  const validated = insertTestimonialSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(testimonials).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Testimonial create warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  logTransaction({
    domain: "PORTFOLIO",
    actionType: "TESTIMONIAL_CREATED",
    status: "COMPLETED",
    entityType: "testimonials",
    entityId: created.id,
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateTestimonial(
  id: string,
  values: Partial<typeof testimonials.$inferInsert>
) {
  const validated = insertTestimonialSchema.partial().parse(values)
  if (isDbConfigured) {
    try {
      await db
        .update(testimonials)
        .set(validated)
        .where(eq(testimonials.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Testimonial update warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteTestimonial(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(testimonials).where(eq(testimonials.id, id))
    } catch (err) {
      console.warn(
        "[CMS Portfolio] Testimonial delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}
