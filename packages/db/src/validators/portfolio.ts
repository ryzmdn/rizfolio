import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import {
  profile,
  experiences,
  education,
  certifications,
  services,
  caseStudies,
  testimonials,
} from "@workspace/db/schema/portfolio"

export const insertProfileSchema = createInsertSchema(profile)
export const selectProfileSchema = createSelectSchema(profile)

export const insertExperienceSchema = createInsertSchema(experiences)
export const selectExperienceSchema = createSelectSchema(experiences)

export const insertEducationSchema = createInsertSchema(education)
export const selectEducationSchema = createSelectSchema(education)

export const insertCertificationSchema = createInsertSchema(certifications)
export const selectCertificationSchema = createSelectSchema(certifications)

export const insertServiceSchema = createInsertSchema(services)
export const selectServiceSchema = createSelectSchema(services)

export const insertCaseStudySchema = createInsertSchema(caseStudies)
export const selectCaseStudySchema = createSelectSchema(caseStudies)

export const insertTestimonialSchema = createInsertSchema(testimonials)
export const selectTestimonialSchema = createSelectSchema(testimonials)
