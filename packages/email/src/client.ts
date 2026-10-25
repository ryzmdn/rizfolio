import { Resend } from "resend"

export interface SendEmailPayload {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string | string[]
  text?: string
}

export interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
  mock?: boolean
}

const apiKey = process.env.RESEND_API_KEY || ""
const isMockMode = !apiKey || apiKey === "re_mock_key" || apiKey.trim() === ""

export const resend = isMockMode ? null : new Resend(apiKey)

export const DEFAULT_FROM =
  process.env.EMAIL_FROM || "Rizfolio <onboarding@resend.dev>"

export const DEFAULT_OWNER_EMAIL =
  process.env.CMS_OWNER_EMAIL || "owner@example.com"

export function isEmailServiceConfigured(): boolean {
  return !isMockMode && Boolean(resend)
}

export async function sendEmail(
  payload: SendEmailPayload
): Promise<SendEmailResult> {
  const from = payload.from || DEFAULT_FROM

  if (!resend || isMockMode) {
    const mockId = `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    return {
      success: true,
      id: mockId,
      mock: true,
    }
  }

  try {
    const response = await resend.emails.send({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo,
      text: payload.text,
    })

    if (response.error) {
      return {
        success: false,
        error: response.error.message || "Failed to send email via Resend",
      }
    }

    return {
      success: true,
      id: response.data?.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected email error",
    }
  }
}
