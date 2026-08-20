import { verifySessionToken, SessionPayload } from "./session"

export async function validateOwnerSession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null

  const payload = await verifySessionToken(token)
  if (!payload) return null

  const ownerEmail = process.env.CMS_OWNER_EMAIL
  if (ownerEmail && payload.email !== ownerEmail) {
    return null
  }

  if (payload.role !== "OWNER") {
    return null
  }

  return payload
}
