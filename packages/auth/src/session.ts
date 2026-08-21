import { SignJWT, jwtVerify } from "jose"

const SESSION_SECRET = new TextEncoder().encode(
  process.env.CMS_SESSION_SECRET ||
    "rizfolio-default-super-secret-session-key-32chars"
)

export const SESSION_COOKIE_NAME = "rizfolio_cms_session"

export interface SessionPayload {
  userId: string
  email: string
  role: string
  [key: string]: unknown
}

export async function createSessionToken(
  payload: SessionPayload,
  expiresIn = "7d"
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SESSION_SECRET)
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET, {
      algorithms: ["HS256"],
    })
    return payload as SessionPayload
  } catch {
    return null
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
}
