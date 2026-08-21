import {
  verifySessionToken,
  SessionPayload,
  JWT_ISSUER,
  JWT_AUDIENCE,
} from "./session"

export async function validateOwnerSession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return null
  }

  const payload = await verifySessionToken(token)
  if (!payload) {
    return null
  }

  if (payload.iss && payload.iss !== JWT_ISSUER) {
    return null
  }

  if (payload.aud && payload.aud !== JWT_AUDIENCE) {
    return null
  }

  if (!payload.jti || typeof payload.jti !== "string" || payload.jti.trim() === "") {
    return null
  }

  if (payload.role !== "OWNER") {
    return null
  }

  const ownerEmail = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase()
  if (ownerEmail && payload.email.trim().toLowerCase() !== ownerEmail) {
    return null
  }

  return payload
}

export async function requireOwnerSession(
  token: string | undefined | null
): Promise<SessionPayload> {
  const session = await validateOwnerSession(token)

  if (!session) {
    throw new Error("Unauthorized: Invalid or missing administrator session.")
  }

  return session
}
