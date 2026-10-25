export interface InquiryReplyTemplateProps {
  clientName: string
  replySubject: string
  replyContent: string
  originalMessage?: string
  senderName?: string
  portfolioUrl?: string
}

export function renderInquiryReplyEmail(
  props: InquiryReplyTemplateProps
): string {
  const senderName = props.senderName || "Rizky Ramadhan"
  const portfolioUrl = props.portfolioUrl || "https://rizfolio.dev"
  const safeClientName = escapeHtml(props.clientName)
  const safeSubject = escapeHtml(props.replySubject)
  const safeReply = escapeHtml(props.replyContent).replace(/\n/g, "<br>")
  const safeOriginal = props.originalMessage
    ? escapeHtml(props.originalMessage)
    : null

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
              <span style="display:inline-block;padding:4px 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#818cf8;background-color:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:9999px;">
                Rizfolio
              </span>
              <h1 style="margin:12px 0 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                ${safeSubject}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px 0;font-size:15px;color:#e4e4e7;line-height:1.6;">
                Hi ${safeClientName},
              </p>

              <div style="font-size:15px;line-height:1.7;color:#e4e4e7;margin-bottom:28px;">
                ${safeReply}
              </div>

              ${
                safeOriginal
                  ? `<div style="margin-bottom:28px;padding:16px 20px;background-color:#121215;border-left:3px solid #6366f1;border-radius:0 8px 8px 0;">
                      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;margin-bottom:6px;">
                        Regarding your inquiry:
                      </div>
                      <div style="font-size:13px;line-height:1.6;color:#a1a1aa;white-space:pre-wrap;">${safeOriginal}</div>
                    </div>`
                  : ""
              }

              <div style="border-top:1px solid #27272a;padding-top:20px;margin-top:20px;">
                <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">
                  ${senderName}
                </p>
                <p style="margin:2px 0 12px 0;font-size:12px;color:#a1a1aa;">
                  Engineering &amp; System Architecture
                </p>
                <a href="${portfolioUrl}" style="display:inline-block;font-size:13px;color:#818cf8;text-decoration:none;font-weight:500;">
                  Visit Portfolio &rarr;
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background-color:#121215;border-top:1px solid #27272a;text-align:center;">
              <p style="margin:0;font-size:12px;color:#71717a;">
                You received this email because you contacted Rizky Ramadhan via Rizfolio.
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
