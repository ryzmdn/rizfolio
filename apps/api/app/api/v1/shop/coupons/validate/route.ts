import { db, eq } from "@workspace/db"
import { coupons } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, ValidationError, NotFoundError } from "@/lib/api"
import { validateCouponSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
    schema: validateCouponSchema,
  },
  async (_, { body }) => {
    const code = body.code.toUpperCase().trim()

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1)

    if (!coupon) {
      throw new NotFoundError(`Coupon code '${code}' is invalid.`)
    }

    if (!coupon.isActive) {
      throw new ValidationError("This coupon is no longer active.")
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw new ValidationError("This coupon has expired.")
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new ValidationError("This coupon has reached its maximum usage limit.")
    }

    if (coupon.minSpend && body.subtotal < coupon.minSpend) {
      throw new ValidationError(
        `Minimum spend of IDR ${coupon.minSpend.toLocaleString()} is required to use this coupon.`
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
