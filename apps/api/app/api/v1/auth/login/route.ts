import { db, eq } from "@workspace/db"
import { users } from "@workspace/db/schema"
import {
  verifyPassword,
  hashPassword,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@workspace/auth"
import { createApiHandler, apiSuccess, UnauthorizedError } from "@/lib/api"
import { loginSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "AUTH_SENSITIVE",
    schema: loginSchema,
  },
  async (_, { body }) => {
    const normalizedEmail = body.email.toLowerCase().trim()
    const ownerEnvEmail = process.env.CMS_OWNER_EMAIL?.toLowerCase().trim()
    const ownerEnvPassword = process.env.CMS_OWNER_PASSWORD

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)

    let userId: string | undefined
    let userRole = "OWNER"

    if (existingUser) {
      if (
        ownerEnvEmail &&
        existingUser.email.toLowerCase() !== ownerEnvEmail
      ) {
        throw new UnauthorizedError("Invalid email or password.")
      }

      const isPasswordValid = await verifyPassword(
        body.password,
        existingUser.passwordHash
      )

      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password.")
      }

      userId = existingUser.id
      userRole = existingUser.role

      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, existingUser.id))
    } else {
      if (!ownerEnvEmail || normalizedEmail !== ownerEnvEmail) {
        throw new UnauthorizedError("Invalid email or password.")
      }

      if (!ownerEnvPassword || body.password !== ownerEnvPassword) {
        throw new UnauthorizedError("Invalid email or password.")
      }

      const passwordHash = await hashPassword(ownerEnvPassword)
      const [newUser] = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          passwordHash,
          role: "OWNER",
          lastLoginAt: new Date(),
        })
        .returning()

      if (!newUser) {
        throw new UnauthorizedError("Failed to initialize user session.")
      }

      userId = newUser.id
      userRole = newUser.role
    }

    const token = await createSessionToken({
      userId: userId!,
      email: normalizedEmail,
      role: userRole,
    })

    const response = apiSuccess({
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        role: userRole,
      },
    })

    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)

    return response
  }
)
