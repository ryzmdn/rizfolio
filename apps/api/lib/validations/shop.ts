import { z } from "zod"
import { paginationQuerySchema } from "./common"

export const queryProductsSchema = paginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  productType: z.string().trim().optional(),
})

export const createProductSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().int().min(0, "Price must be non-negative"),
  currency: z.string().trim().max(10).default("IDR"),
  productType: z.string().trim().max(50).default("DIGITAL_DOWNLOAD"),
  coverImageUrl: z.string().trim().optional().nullable(),
  galleryUrls: z.array(z.string().trim()).default([]),
  stock: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required").max(255),
  customerEmail: z.string().trim().email("Invalid email address").max(255),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product ID"),
        quantity: z.coerce.number().int().min(1).default(1),
      })
    )
    .min(1, "At least one product item is required"),
  couponCode: z.string().trim().optional().nullable(),
  paymentProvider: z.string().trim().max(50).default("STRIPE"),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
    "REFUNDED",
  ]),
  paymentRef: z.string().trim().optional().nullable(),
})

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1, "Coupon code is required").max(50).toUpperCase(),
  subtotal: z.coerce.number().int().min(0),
})

export const createCouponSchema = z.object({
  code: z.string().trim().min(1, "Code is required").max(50).toUpperCase(),
  discountPercent: z.coerce.number().int().min(1).max(100),
  description: z.string().trim().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  minSpend: z.coerce.number().int().min(0).default(0),
  maxUses: z.coerce.number().int().min(1).optional().nullable(),
  isActive: z.boolean().default(true),
})

export const updateCouponSchema = createCouponSchema.partial()

export const createReviewSchema = z.object({
  productSlug: z.string().trim().min(1, "Product slug is required"),
  authorName: z.string().trim().min(1, "Author name is required").max(255),
  authorRole: z.string().trim().max(255).default("Verified Developer"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  content: z.string().trim().min(1, "Review content is required"),
  _hp_website: z.string().optional(),
  _hp_email: z.string().optional(),
})

export const updateReviewStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
})
