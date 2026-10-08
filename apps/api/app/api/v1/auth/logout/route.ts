import { SESSION_COOKIE_NAME } from "@workspace/auth"
import { createApiHandler, apiSuccess } from "@/lib/api"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
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
