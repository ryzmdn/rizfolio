import crypto from "crypto"
import { db, eq } from "@workspace/db"
import { coupons } from "@workspace/db/schema"
import {
  createApiHandler,
  apiSuccess,
  ValidationError,
} from "@/lib/api"
import { validateCouponSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

function constantTimeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    schema: validateCouponSchema,
  },
  async (_, { body }) => {
    const code = body.code.toUpperCase().trim()

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1)

    const isMatch = coupon ? constantTimeCompare(coupon.code, code) : false

    if (!coupon || !isMatch) {
      constantTimeCompare(code, "DUMMY_COUPON_CODE_FOR_TIMING_ALIGNMENT")
      throw new ValidationError("Invalid or ineligible coupon code.")
    }

    const isExpired =
      Boolean(coupon.expiresAt) && new Date(coupon.expiresAt!) < new Date()
    const isExhausted =
      typeof coupon.maxUses === "number" && coupon.usedCount >= coupon.maxUses

    if (!coupon.isActive || isExpired || isExhausted) {
      throw new ValidationError("Invalid or ineligible coupon code.")
    }

    if (coupon.minSpend && body.subtotal < coupon.minSpend) {
      throw new ValidationError(
        `Minimum order spend of IDR ${coupon.minSpend.toLocaleString()} is required for this coupon.`
      )
    }

    const discountAmount = Math.round(
      (body.subtotal * coupon.discountPercent) / 100
    )
    const newTotal = Math.max(0, body.subtotal - discountAmount)

    return apiSuccess({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount,
      subtotal: body.subtotal,
      finalTotal: newTotal,
      description: coupon.description,
    })
  }
)
