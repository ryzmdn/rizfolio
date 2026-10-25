export interface ChangelogReleaseTemplateProps {
  version: string
  title: string
  description?: string
  highlights?: string[]
  releaseUrl?: string
  publishedAt?: Date | string
  unsubscribeUrl?: string
}

export function renderChangelogReleaseEmail(
  props: ChangelogReleaseTemplateProps
): string {
  const releaseUrl = props.releaseUrl || "http://localhost:3003"
  const formattedDate = props.publishedAt
    ? new Date(props.publishedAt).toUTCString()
    : new Date().toUTCString()

  const safeVersion = escapeHtml(props.version)
  const safeTitle = escapeHtml(props.title)
  const safeDescription = props.description
    ? escapeHtml(props.description)
    : "A new release has been deployed across the Rizfolio ecosystem."

  const highlightsHtml =
    props.highlights && props.highlights.length > 0
      ? `<div style="margin-bottom:24px;">
          <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#a1a1aa;margin-bottom:8px;">
            Key Improvements &amp; Changes
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#121215;border:1px solid #27272a;border-radius:12px;">
            ${props.highlights
              .map(
                (item) => `<tr>
                  <td style="padding:10px 16px;border-bottom:1px solid #27272a;font-size:13px;color:#e4e4e7;line-height:1.5;">
                    <span style="color:#818cf8;margin-right:8px;">&bull;</span>${escapeHtml(item)}
                  </td>
                </tr>`
              )
              .join("")}
          </table>
        </div>`
      : ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rizfolio ${safeVersion}: ${safeTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fafafa;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09090b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #27272a;">
              <span style="display:inline-block;padding:4px 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#818cf8;background-color:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:9999px;">
                Release ${safeVersion}
              </span>
              <h1 style="margin:12px 0 4px 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                ${safeTitle}
              </h1>
              <p style="margin:0;font-size:13px;color:#a1a1aa;">
                Published &bull; ${formattedDate}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 20px 0;font-size:15px;color:#e4e4e7;line-height:1.6;">
                ${safeDescription}
              </p>

              ${highlightsHtml}

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${releaseUrl}" style="display:inline-block;padding:12px 28px;background-color:#4f46e5;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;box-shadow:0 4px 14px rgba(79,70,229,0.4);">
                      View Release in Changelog &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background-color:#121215;border-top:1px solid #27272a;text-align:center;">
              <p style="margin:0;font-size:12px;color:#71717a;">
                Rizfolio Ecosystem Changelog
                ${
                  props.unsubscribeUrl
                    ? ` &bull; <a href="${props.unsubscribeUrl}" style="color:#a1a1aa;text-decoration:underline;">Unsubscribe</a>`
                    : ""
                }
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
