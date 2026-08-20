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
import { revalidatePath } from "next/cache"

export async function getProfile() {
  const [data] = await db.select().from(profile).limit(1)
  return data || null
}

export async function upsertProfile(values: typeof profile.$inferInsert) {
  const existing = await getProfile()
  if (existing) {
    await db.update(profile).set(values).where(eq(profile.id, existing.id))
  } else {
    await db.insert(profile).values(values)
  }
  revalidatePath("/portfolio")
}

export async function getExperiences() {
  return await db.select().from(experiences).orderBy(asc(experiences.displayOrder), desc(experiences.startDate))
}

export async function createExperience(values: typeof experiences.$inferInsert) {
  const [created] = await db.insert(experiences).values(values).returning()
  revalidatePath("/portfolio")
  return created
}

export async function updateExperience(
  id: string,
  values: Partial<typeof experiences.$inferInsert>
) {
  await db.update(experiences).set(values).where(eq(experiences.id, id))
  revalidatePath("/portfolio")
}

export async function deleteExperience(id: string) {
  await db.delete(experiences).where(eq(experiences.id, id))
  revalidatePath("/portfolio")
}

export async function getEducation() {
  return await db.select().from(education).orderBy(asc(education.displayOrder), desc(education.startYear))
}

export async function createEducation(values: typeof education.$inferInsert) {
  const [created] = await db.insert(education).values(values).returning()
  revalidatePath("/portfolio")
  return created
}

export async function updateEducation(
  id: string,
  values: Partial<typeof education.$inferInsert>
) {
  await db.update(education).set(values).where(eq(education.id, id))
  revalidatePath("/portfolio")
}

export async function deleteEducation(id: string) {
  await db.delete(education).where(eq(education.id, id))
  revalidatePath("/portfolio")
}

export async function getCertifications() {
  return await db.select().from(certifications).orderBy(asc(certifications.displayOrder), desc(certifications.issueDate))
}

export async function createCertification(values: typeof certifications.$inferInsert) {
  const [created] = await db.insert(certifications).values(values).returning()
  revalidatePath("/portfolio")
  return created
}

export async function updateCertification(
  id: string,
  values: Partial<typeof certifications.$inferInsert>
) {
  await db.update(certifications).set(values).where(eq(certifications.id, id))
  revalidatePath("/portfolio")
}

export async function deleteCertification(id: string) {
  await db.delete(certifications).where(eq(certifications.id, id))
  revalidatePath("/portfolio")
}

export async function getServices() {
  return await db.select().from(services).orderBy(asc(services.displayOrder))
}

export async function createService(values: typeof services.$inferInsert) {
  const [created] = await db.insert(services).values(values).returning()
  revalidatePath("/portfolio")
  return created
}

export async function updateService(
  id: string,
  values: Partial<typeof services.$inferInsert>
) {
  await db.update(services).set(values).where(eq(services.id, id))
  revalidatePath("/portfolio")
}

export async function deleteService(id: string) {
  await db.delete(services).where(eq(services.id, id))
  revalidatePath("/portfolio")
}

export async function getCaseStudies() {
  return await db.select().from(caseStudies).orderBy(asc(caseStudies.displayOrder))
}

export async function createCaseStudy(values: typeof caseStudies.$inferInsert) {
  const [created] = await db.insert(caseStudies).values(values).returning()
  revalidatePath("/portfolio")
  return created
}

export async function updateCaseStudy(
  id: string,
  values: Partial<typeof caseStudies.$inferInsert>
) {
  await db.update(caseStudies).set(values).where(eq(caseStudies.id, id))
  revalidatePath("/portfolio")
}

export async function deleteCaseStudy(id: string) {
  await db.delete(caseStudies).where(eq(caseStudies.id, id))
  revalidatePath("/portfolio")
}

export async function getTestimonials() {
  return await db.select().from(testimonials).orderBy(asc(testimonials.displayOrder))
}

export async function createTestimonial(values: typeof testimonials.$inferInsert) {
  const [created] = await db.insert(testimonials).values(values).returning()
  revalidatePath("/portfolio")
  return created
}

export async function updateTestimonial(
  id: string,
  values: Partial<typeof testimonials.$inferInsert>
) {
  await db.update(testimonials).set(values).where(eq(testimonials.id, id))
  revalidatePath("/portfolio")
}

export async function deleteTestimonial(id: string) {
  await db.delete(testimonials).where(eq(testimonials.id, id))
  revalidatePath("/portfolio")
}
