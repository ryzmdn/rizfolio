import { SignJWT, jwtVerify } from "jose"

export const JWT_ISSUER = "rizfolio-cms"
export const JWT_AUDIENCE = "rizfolio-cms-client"
export const SESSION_COOKIE_NAME = "rizfolio_cms_session"

export function getSessionSecret(): Uint8Array {
  const secret = process.env.CMS_SESSION_SECRET

  if (!secret || secret.trim().length < 32) {
    throw new Error(
      "CRITICAL SECURITY ERROR: CMS_SESSION_SECRET environment variable is missing or shorter than 32 characters. Please configure a secure secret in your environment."
    )
  }

  return new TextEncoder().encode(secret)
}

export interface SessionPayload {
  userId: string
  email: string
  role: string
  jti?: string
  iss?: string
  aud?: string
  [key: string]: unknown
}

export async function createSessionToken(
  payload: SessionPayload,
  expiresIn = "24h"
): Promise<string> {
  const secretKey = getSessionSecret()
  const jti = crypto.randomUUID()

  return new SignJWT({ ...payload, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setJti(jti)
    .setExpirationTime(expiresIn)
    .sign(secretKey)
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return null
  }

  try {
    const secretKey = getSessionSecret()
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
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
  maxAge: 24 * 60 * 60, // 24 hours (1 day)
}
