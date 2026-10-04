import { db, eq } from "@workspace/db"
import { users } from "@workspace/db/schema"
import { verifyPassword, hashPassword } from "@workspace/auth"
import { createApiHandler, apiSuccess, UnauthorizedError, NotFoundError } from "@/lib/api"
import { changePasswordSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "AUTH_SENSITIVE",
    schema: changePasswordSchema,
    auditConfig: (_, { security }) => ({
      domain: "AUTH_SECURITY",
      actionType: "PASSWORD_CHANGED",
      entityType: "users",
      entityId: security.user?.id || "unknown",
      status: "COMPLETED",
    }),
  },
  async (_, { body, security }) => {
    const userId = security.user?.id

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId!))
      .limit(1)

    if (!user) {
      throw new NotFoundError("User not found.")
    }

    const isCurrentValid = await verifyPassword(
      body.currentPassword,
      user.passwordHash
    )

    if (!isCurrentValid) {
      throw new UnauthorizedError("Current password is incorrect.")
    }

    const newHash = await hashPassword(body.newPassword)

    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, user.id))

    return apiSuccess({
      message: "Password successfully updated.",
      updatedAt: new Date().toISOString(),
    })
  }
)
