import { db, eq } from "@workspace/db"
import { users } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { security }) => {
    const userId = security.user?.id

    if (userId === "m2m-service-account") {
      return apiSuccess({
        id: "m2m-service-account",
        email: "m2m@api.internal",
        role: "OWNER",
        authMethod: "API_KEY",
        scopes: security.user?.scopes || ["*"],
      })
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        avatarUrl: users.avatarUrl,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId!))
      .limit(1)

    if (!user) {
      throw new NotFoundError(
        "Authenticated user record not found in database."
      )
    }

    return apiSuccess({
      ...user,
      authMethod: security.authMethod,
    })
  }
)
