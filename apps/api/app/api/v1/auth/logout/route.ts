import { SESSION_COOKIE_NAME, verifySessionToken } from "@workspace/auth"
import { db, eq, sql } from "@workspace/db"
import { users } from "@workspace/db/schema"
import { createApiHandler, apiSuccess } from "@/lib/api"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    let token = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (!token) {
      const auth = request.headers.get("authorization")
      if (auth?.startsWith("Bearer ")) {
        token = auth.substring(7).trim()
      }
    }

    if (token) {
      const session = await verifySessionToken(token)
      if (session?.userId) {
        try {
          await db
            .update(users)
            .set({ tokenVersion: sql`${users.tokenVersion} + 1` })
            .where(eq(users.id, session.userId))
        } catch {}
      }
    }

    const response = apiSuccess({
      message: "Session successfully terminated.",
      loggedOut: true,
    })

    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  }
)
