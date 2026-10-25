export interface InquiryAlertTemplateProps {
  inquiryId?: string
  name: string
  email: string
  subject?: string
  projectScope?: string
  budgetRange?: string
  message: string
  receivedAt?: Date | string
  cmsInboxUrl?: string
}

export function renderInquiryAlertEmail(
  props: InquiryAlertTemplateProps
): string {
  const cmsUrl = props.cmsInboxUrl || "http://localhost:3004/inbox"
  const formattedDate = props.receivedAt
    ? new Date(props.receivedAt).toUTCString()
    : new Date().toUTCString()

  const safeName = escapeHtml(props.name)
  const safeEmail = escapeHtml(props.email)
  const safeSubject = escapeHtml(props.subject || "New Project Inquiry")
  const safeScope = escapeHtml(props.projectScope || "PROJECT_INQUIRY")
  const safeBudget = escapeHtml(props.budgetRange || "Flexible / To Discuss")
  const safeMessage = escapeHtml(props.message)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fafafa;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09090b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #27272a;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:4px 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#818cf8;background-color:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:9999px;">
                      Portfolio Alert
                    </span>
                    <h1 style="margin:12px 0 4px 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                      New Client Inquiry Received
                    </h1>
                    <p style="margin:0;font-size:13px;color:#a1a1aa;">
                      ${formattedDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#121215;border:1px solid #27272a;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #27272a;">
                    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;">Client Name</div>
                    <div style="font-size:15px;font-weight:600;color:#ffffff;margin-top:4px;">${safeName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #27272a;">
                    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;">Client Email</div>
                    <div style="font-size:14px;color:#818cf8;margin-top:4px;word-break:break-all;">
                      <a href="mailto:${safeEmail}" style="color:#818cf8;text-decoration:none;">${safeEmail}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #27272a;">
                    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;">Project Scope &amp; Budget</div>
                    <div style="margin-top:6px;">
                      <span style="display:inline-block;padding:3px 8px;font-size:12px;font-family:monospace;color:#e4e4e7;background-color:#27272a;border-radius:6px;margin-right:8px;">${safeScope}</span>
                      <span style="display:inline-block;padding:3px 8px;font-size:12px;font-family:monospace;color:#34d399;background-color:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);border-radius:6px;">${safeBudget}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;">Subject</div>
                    <div style="font-size:14px;font-weight:600;color:#ffffff;margin-top:4px;">${safeSubject}</div>
                  </td>
                </tr>
              </table>

              <div style="margin-bottom:28px;">
                <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;margin-bottom:8px;">Project Message</div>
                <div style="background-color:#121215;border:1px solid #27272a;border-radius:12px;padding:20px;font-size:14px;line-height:1.6;color:#e4e4e7;white-space:pre-wrap;">${safeMessage}</div>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${cmsUrl}" style="display:inline-block;padding:12px 28px;background-color:#4f46e5;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;box-shadow:0 4px 14px rgba(79,70,229,0.4);">
                      Open in CMS Inbox &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background-color:#121215;border-top:1px solid #27272a;text-align:center;">
              <p style="margin:0;font-size:12px;color:#71717a;">
                This inquiry was delivered securely via Rizfolio Portfolio Engine.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
