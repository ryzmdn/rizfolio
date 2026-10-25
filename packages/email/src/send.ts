import {
  sendEmail,
  DEFAULT_OWNER_EMAIL,
  type SendEmailResult,
} from "./client"
import {
  renderInquiryAlertEmail,
  type InquiryAlertTemplateProps,
  renderInquiryReplyEmail,
  type InquiryReplyTemplateProps,
  renderOrderConfirmationEmail,
  type OrderConfirmationTemplateProps,
  renderNewsletterWelcomeEmail,
  type NewsletterWelcomeTemplateProps,
  renderChangelogReleaseEmail,
  type ChangelogReleaseTemplateProps,
} from "./templates"

export async function sendInquiryAlertEmail(
  props: InquiryAlertTemplateProps,
  options?: { to?: string; from?: string }
): Promise<SendEmailResult> {
  const to = options?.to || DEFAULT_OWNER_EMAIL
  const subject = `[Rizfolio Inquiry] ${props.subject || `New message from ${props.name}`}`
  const html = renderInquiryAlertEmail(props)

  return sendEmail({
    to,
    from: options?.from,
    replyTo: props.email,
    subject,
    html,
  })
}

export async function sendInquiryReplyEmail(
  props: InquiryReplyTemplateProps,
  options: { to: string; from?: string; replyTo?: string }
): Promise<SendEmailResult> {
  const html = renderInquiryReplyEmail(props)

  return sendEmail({
    to: options.to,
    from: options.from,
    replyTo: options.replyTo || DEFAULT_OWNER_EMAIL,
    subject: props.replySubject,
    html,
  })
}

export async function sendOrderConfirmationEmail(
  props: OrderConfirmationTemplateProps,
  options?: { from?: string }
): Promise<SendEmailResult> {
  const subject = `Order Receipt #${props.orderNumber} - Rizfolio Shop`
  const html = renderOrderConfirmationEmail(props)

  return sendEmail({
    to: props.customerEmail,
    from: options?.from,
    subject,
    html,
  })
}

export async function sendNewsletterWelcomeEmail(
  props: NewsletterWelcomeTemplateProps,
  options?: { from?: string }
): Promise<SendEmailResult> {
  const subject = "Welcome to the Rizfolio Engineering Dispatch"
  const html = renderNewsletterWelcomeEmail(props)

  return sendEmail({
    to: props.email,
    from: options?.from,
    subject,
    html,
  })
}

export async function sendChangelogReleaseEmail(
  props: ChangelogReleaseTemplateProps,
  options: { to: string | string[]; from?: string }
): Promise<SendEmailResult> {
  const subject = `Rizfolio Release ${props.version}: ${props.title}`
  const html = renderChangelogReleaseEmail(props)

  return sendEmail({
    to: options.to,
    from: options.from,
    subject,
    html,
  })
}
