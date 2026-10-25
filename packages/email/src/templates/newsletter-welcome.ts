export interface NewsletterWelcomeTemplateProps {
  email: string
  subscriberName?: string
  blogUrl?: string
  unsubscribeUrl?: string
}

export function renderNewsletterWelcomeEmail(
  props: NewsletterWelcomeTemplateProps
): string {
  const blogUrl = props.blogUrl || "http://localhost:3001"
  const safeName = props.subscriberName ? escapeHtml(props.subscriberName) : "Reader"
  const safeEmail = escapeHtml(props.email)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Rizfolio Engineering Dispatch</title>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fafafa;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09090b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #27272a;">
              <span style="display:inline-block;padding:4px 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#818cf8;background-color:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:9999px;">
                Newsletter Confirmed
              </span>
              <h1 style="margin:12px 0 4px 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                Welcome to the Engineering Dispatch
              </h1>
              <p style="margin:0;font-size:13px;color:#a1a1aa;">
                Subscribed as ${safeEmail}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px 0;font-size:15px;color:#e4e4e7;line-height:1.6;">
                Hi ${safeName}, thanks for joining!
              </p>

              <p style="margin:0 0 20px 0;font-size:14px;color:#a1a1aa;line-height:1.6;">
                You will receive thoughtful, in-depth technical analyses directly to your inbox. Here is a preview of topics we explore:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#121215;border:1px solid #27272a;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #27272a;">
                    <div style="font-size:13px;font-weight:600;color:#ffffff;">
                      &bull; Production Next.js &amp; Serverless Architectures
                    </div>
                    <div style="font-size:12px;color:#71717a;margin-top:2px;">
                      High-throughput APIs, sliding-window rate limiting, and zero-downtime migrations.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #27272a;">
                    <div style="font-size:13px;font-weight:600;color:#ffffff;">
                      &bull; TypeScript Rigor &amp; Type Systems
                    </div>
                    <div style="font-size:12px;color:#71717a;margin-top:2px;">
                      Monorepos, end-to-end schema validation with Drizzle ORM and Zod.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;">
                    <div style="font-size:13px;font-weight:600;color:#ffffff;">
                      &bull; UI Systems &amp; Modern Web Aesthetics
                    </div>
                    <div style="font-size:12px;color:#71717a;margin-top:2px;">
                      Crafting ultra-fast, premium interfaces with modern CSS and Tailwind.
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${blogUrl}" style="display:inline-block;padding:12px 28px;background-color:#4f46e5;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;box-shadow:0 4px 14px rgba(79,70,229,0.4);">
                      Read Latest Articles &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background-color:#121215;border-top:1px solid #27272a;text-align:center;">
              <p style="margin:0;font-size:12px;color:#71717a;">
                Rizfolio &bull; Curated by Rizky Ramadhan
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
