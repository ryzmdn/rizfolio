import { z } from "zod"

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(255),
  headline: z.string().trim().min(1, "Headline is required").max(255),
  bio: z.string().trim().min(1, "Bio is required"),
  location: z.string().trim().max(255).optional().nullable(),
  resumeUrl: z.string().trim().url("Invalid resume URL").optional().nullable().or(z.literal("")),
  status: z.string().trim().max(50).default("available"),
  socialLinks: z
    .record(z.string(), z.string().url().or(z.literal("")).or(z.string()))
    .optional()
    .nullable(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const createExperienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(255),
  role: z.string().trim().min(1, "Role is required").max(255),
  location: z.string().trim().max(255).optional().nullable(),
  companyLogoUrl: z.string().trim().optional().nullable(),
  startDate: z.string().trim().min(1, "Start date is required").max(50),
  endDate: z.string().trim().max(50).optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().min(1, "Description is required"),
  techStack: z.array(z.string().trim()).default([]),
  displayOrder: z.coerce.number().int().default(0),
})

export const updateExperienceSchema = createExperienceSchema.partial()

export const createEducationSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(255),
  degree: z.string().trim().min(1, "Degree is required").max(255),
  field: z.string().trim().min(1, "Field of study is required").max(255),
  startYear: z.string().trim().min(1, "Start year is required").max(20),
  endYear: z.string().trim().max(20).optional().nullable(),
  gpa: z.string().trim().max(20).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
})

export const updateEducationSchema = createEducationSchema.partial()

export const createCertificationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  issuer: z.string().trim().min(1, "Issuer is required").max(255),
  issueDate: z.string().trim().min(1, "Issue date is required").max(50),
  expiryDate: z.string().trim().max(50).optional().nullable(),
  credentialUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  credentialId: z.string().trim().max(255).optional().nullable(),
  badgeUrl: z.string().trim().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
})

export const updateCertificationSchema = createCertificationSchema.partial()

export const createServiceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  summary: z.string().trim().min(1, "Summary is required"),
  description: z.string().trim().min(1, "Description is required"),
  deliverables: z.array(z.string().trim()).default([]),
  startingPrice: z.coerce.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
})

export const updateServiceSchema = createServiceSchema.partial()

export const createCaseStudySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().trim().min(1, "Title is required").max(255),
  clientName: z.string().trim().max(255).optional().nullable(),
  summary: z.string().trim().min(1, "Summary is required"),
  contentMd: z.string().trim().min(1, "Markdown content is required"),
  thumbnailUrl: z.string().trim().optional().nullable(),
  liveUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  repoUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  metrics: z.record(z.string(), z.unknown()).optional().nullable(),
  isPublished: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
})

export const updateCaseStudySchema = createCaseStudySchema.partial()

export const createTestimonialSchema = z.object({
  clientName: z.string().trim().min(1, "Client name is required").max(255),
  role: z.string().trim().max(255).optional().nullable(),
  company: z.string().trim().max(255).optional().nullable(),
  content: z.string().trim().min(1, "Testimonial content is required"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  avatarUrl: z.string().trim().optional().nullable(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

export const createInquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().max(255).optional().nullable(),
  message: z.string().trim().min(1, "Message is required"),
  projectScope: z
    .enum(["FULL_TIME", "CONTRACT", "CONSULTING", "ADVISORY", "PROJECT_INQUIRY"])
    .default("PROJECT_INQUIRY"),
  budgetRange: z.string().trim().max(100).optional().nullable(),
  // Honeypot fields to detect bots
  _hp_website: z.string().optional(),
  _hp_email: z.string().optional(),
  _hp_timestamp: z.coerce.number().optional(),
})

export const updateInquiryStatusSchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "RESPONDED", "ARCHIVED"]),
  replyNotes: z.string().trim().optional().nullable(),
})
