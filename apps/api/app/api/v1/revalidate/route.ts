import { revalidatePath, revalidateTag } from "next/cache"
import crypto from "crypto"
import {
  createApiHandler,
  apiSuccess,
  UnauthorizedError,
  ValidationError,
} from "@/lib/api"
import { revalidateRequestSchema } from "@/lib/validations"

function safeCompareTokens(provided: string, expected: string): boolean {
  try {
    const bufProvided = Buffer.from(provided, "utf8")
    const bufExpected = Buffer.from(expected, "utf8")
    if (bufProvided.length !== bufExpected.length) {
      return false
    }
    return crypto.timingSafeEqual(bufProvided, bufExpected)
  } catch {
    return false
  }
}

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    schema: revalidateRequestSchema,
  },
  async (_, { body }) => {
    const validSecret =
      process.env.REVALIDATION_SECRET_TOKEN || process.env.API_MASTER_KEY

    if (
      !validSecret ||
      !body.secret ||
      !safeCompareTokens(body.secret, validSecret)
    ) {
      throw new UnauthorizedError(
        "Invalid or missing revalidation secret token."
      )
    }

    if (!body.path && !body.tag) {
      throw new ValidationError(
        "Either 'path' or 'tag' must be specified for revalidation."
      )
    }

    const revalidated: { path?: string; tag?: string } = {}

    if (body.path) {
      revalidatePath(body.path)
      revalidated.path = body.path
    }

    if (body.tag) {
      ;(revalidateTag as (tag: string, profile?: string) => void)(
        body.tag,
        "max-age=0"
      )
      revalidated.tag = body.tag
    }

    return apiSuccess({
      revalidated: true,
      target: revalidated,
      timestamp: new Date().toISOString(),
    })
  }
)
