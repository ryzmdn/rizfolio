"use server"

import { db, eq, desc, asc } from "@workspace/db"
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

function dispatchPortfolioRevalidation() {
  dispatchBackgroundRevalidation([
    { app: "portfolio", path: "/" },
    { app: "linkbio", path: "/" },
  ])
}

export async function getProfile() {
  try {
    const [data] = await db.select().from(profile).limit(1)
    return data || null
  } catch (error) {
    console.error(
      "[CMS Portfolio] Failed to fetch profile:",
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export async function upsertProfile(values: typeof profile.$inferInsert) {
  const validated = insertProfileSchema.partial().parse(values)
  await db.transaction(async (tx) => {
    const [existing] = await tx.select().from(profile).limit(1)
    if (existing) {
      await tx.update(profile).set(validated).where(eq(profile.id, existing.id))
      logTransaction({
        domain: "PORTFOLIO",
        actionType: "PROFILE_UPDATED",
        status: "COMPLETED",
        entityType: "profile",
        entityId: existing.id,
        payloadAfter: validated,
      })
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
    }
  })
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
  return saved
}

export async function getExperiences() {
  try {
    return await db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.displayOrder), desc(experiences.startDate))
  } catch (error) {
    console.error(
      "[CMS Portfolio] Failed to fetch experiences:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createExperience(
  values: typeof experiences.$inferInsert
) {
  const validated = insertExperienceSchema.parse(values)
  const [created] = await db.insert(experiences).values(validated).returning()
  if (created) {
    logTransaction({
      domain: "PORTFOLIO",
      actionType: "EXPERIENCE_CREATED",
      status: "COMPLETED",
      entityType: "experiences",
      entityId: created.id,
      payloadAfter: { company: created.company, role: created.role },
    })
    dispatchPortfolioRevalidation()
  }
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateExperience(
  id: string,
  values: Partial<typeof experiences.$inferInsert>
) {
  const validated = insertExperienceSchema.partial().parse(values)
  await db.update(experiences).set(validated).where(eq(experiences.id, id))
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
  await db.delete(experiences).where(eq(experiences.id, id))
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
  try {
    return await db
      .select()
      .from(education)
      .orderBy(asc(education.displayOrder), desc(education.startYear))
  } catch (error) {
    console.error(
      "[CMS Portfolio] Failed to fetch education:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createEducation(values: typeof education.$inferInsert) {
  const validated = insertEducationSchema.parse(values)
  const [created] = await db.insert(education).values(validated).returning()
  if (created) {
    logTransaction({
      domain: "PORTFOLIO",
      actionType: "EDUCATION_CREATED",
      status: "COMPLETED",
      entityType: "education",
      entityId: created.id,
    })
    dispatchPortfolioRevalidation()
  }
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateEducation(
  id: string,
  values: Partial<typeof education.$inferInsert>
) {
  const validated = insertEducationSchema.partial().parse(values)
  await db.update(education).set(validated).where(eq(education.id, id))
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteEducation(id: string) {
  await db.delete(education).where(eq(education.id, id))
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function getCertifications() {
  try {
    return await db
      .select()
      .from(certifications)
      .orderBy(asc(certifications.displayOrder), desc(certifications.issueDate))
  } catch (error) {
    console.error(
      "[CMS Portfolio] Failed to fetch certifications:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createCertification(
  values: typeof certifications.$inferInsert
) {
  const validated = insertCertificationSchema.parse(values)
  const [created] = await db.insert(certifications).values(validated).returning()
  if (created) {
    logTransaction({
      domain: "PORTFOLIO",
      actionType: "CERTIFICATION_CREATED",
      status: "COMPLETED",
      entityType: "certifications",
      entityId: created.id,
      payloadAfter: { title: created.title, issuer: created.issuer },
    })
    dispatchPortfolioRevalidation()
  }
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateCertification(
  id: string,
  values: Partial<typeof certifications.$inferInsert>
) {
  const validated = insertCertificationSchema.partial().parse(values)
  await db.update(certifications).set(validated).where(eq(certifications.id, id))
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteCertification(id: string) {
  await db.delete(certifications).where(eq(certifications.id, id))
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function getServices() {
  try {
    return await db.select().from(services).orderBy(asc(services.displayOrder))
  } catch (error) {
    console.error(
      "[CMS Portfolio] Failed to fetch services:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createService(values: typeof services.$inferInsert) {
  const validated = insertServiceSchema.parse(values)
  const [created] = await db.insert(services).values(validated).returning()
  if (created) {
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
  }
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateService(
  id: string,
  values: Partial<typeof services.$inferInsert>
) {
  const validated = insertServiceSchema.partial().parse(values)
  await db.update(services).set(validated).where(eq(services.id, id))
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteService(id: string) {
  await db.delete(services).where(eq(services.id, id))
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function getCaseStudies() {
  try {
    return await db
      .select()
      .from(caseStudies)
      .orderBy(asc(caseStudies.displayOrder))
  } catch (error) {
    console.error(
      "[CMS Portfolio] Failed to fetch case studies:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createCaseStudy(values: typeof caseStudies.$inferInsert) {
  const validated = insertCaseStudySchema.parse(values)
  const [created] = await db.insert(caseStudies).values(validated).returning()
  if (created) {
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
  }
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateCaseStudy(
  id: string,
  values: Partial<typeof caseStudies.$inferInsert>
) {
  const validated = insertCaseStudySchema.partial().parse(values)
  await db.update(caseStudies).set(validated).where(eq(caseStudies.id, id))
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
  await db.delete(caseStudies).where(eq(caseStudies.id, id))
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
  try {
    return await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.displayOrder))
  } catch (error) {
    console.error(
      "[CMS Portfolio] Failed to fetch testimonials:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createTestimonial(
  values: typeof testimonials.$inferInsert
) {
  const validated = insertTestimonialSchema.parse(values)
  const [created] = await db.insert(testimonials).values(validated).returning()
  if (created) {
    logTransaction({
      domain: "PORTFOLIO",
      actionType: "TESTIMONIAL_CREATED",
      status: "COMPLETED",
      entityType: "testimonials",
      entityId: created.id,
    })
    dispatchPortfolioRevalidation()
  }
  revalidatePath("/portfolio")
  revalidatePath("/")
  return created
}

export async function updateTestimonial(
  id: string,
  values: Partial<typeof testimonials.$inferInsert>
) {
  const validated = insertTestimonialSchema.partial().parse(values)
  await db.update(testimonials).set(validated).where(eq(testimonials.id, id))
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deleteTestimonial(id: string) {
  await db.delete(testimonials).where(eq(testimonials.id, id))
  dispatchPortfolioRevalidation()
  revalidatePath("/portfolio")
  revalidatePath("/")
}
