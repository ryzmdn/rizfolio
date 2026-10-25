export interface OrderItemReceipt {
  title: string
  price: number | string
  quantity?: number
  downloadToken?: string
  downloadUrl?: string
}

export interface OrderConfirmationTemplateProps {
  customerName?: string
  customerEmail: string
  orderNumber: string
  orderDate?: Date | string
  items: OrderItemReceipt[]
  totalAmount: number | string
  currency?: string
  shopUrl?: string
  downloadTokenExpiresInDays?: number
}

export function renderOrderConfirmationEmail(
  props: OrderConfirmationTemplateProps
): string {
  const shopUrl = props.shopUrl || "http://localhost:3002"
  const formattedDate = props.orderDate
    ? new Date(props.orderDate).toUTCString()
    : new Date().toUTCString()
  const currency = (props.currency || "USD").toUpperCase()
  const formattedTotal =
    typeof props.totalAmount === "number"
      ? props.totalAmount.toFixed(2)
      : props.totalAmount
  const safeOrderNumber = escapeHtml(props.orderNumber)
  const safeCustomerName = props.customerName
    ? escapeHtml(props.customerName)
    : "Valued Customer"
  const expiryDays = props.downloadTokenExpiresInDays || 7

  const itemsRows = props.items
    .map((item) => {
      const priceStr =
        typeof item.price === "number" ? item.price.toFixed(2) : item.price
      const qty = item.quantity || 1
      return `<tr>
        <td style="padding:12px 16px;border-bottom:1px solid #27272a;font-size:14px;color:#ffffff;font-weight:500;">
          ${escapeHtml(item.title)}
          ${
            item.downloadUrl
              ? `<div style="margin-top:6px;">
                  <a href="${item.downloadUrl}" style="display:inline-block;padding:5px 12px;font-size:11px;font-weight:600;color:#ffffff;background-color:#4f46e5;border-radius:6px;text-decoration:none;">
                    Download Digital Asset &rarr;
                  </a>
                </div>`
              : ""
          }
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #27272a;font-size:13px;color:#a1a1aa;text-align:center;">
          ${qty}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #27272a;font-size:14px;color:#ffffff;text-align:right;font-family:monospace;">
          ${currency} ${priceStr}
        </td>
      </tr>`
    })
    .join("")

  const hasDownloadables = props.items.some((i) => Boolean(i.downloadUrl))

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Receipt #${safeOrderNumber}</title>
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
                    <span style="display:inline-block;padding:4px 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#34d399;background-color:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);border-radius:9999px;">
                      Payment Confirmed
                    </span>
                    <h1 style="margin:12px 0 4px 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                      Thank you for your purchase!
                    </h1>
                    <p style="margin:0;font-size:13px;color:#a1a1aa;">
                      Order #${safeOrderNumber} &bull; ${formattedDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 20px 0;font-size:15px;color:#e4e4e7;line-height:1.6;">
                Hi ${safeCustomerName}, your order has been successfully processed and verified.
              </p>

              ${
                hasDownloadables
                  ? `<div style="background-color:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                      <div style="font-size:13px;font-weight:600;color:#818cf8;margin-bottom:4px;">
                        Digital Downloads Available
                      </div>
                      <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">
                        Your access tokens are valid for ${expiryDays} days. Please click the download buttons in the item list below to retrieve your files.
                      </p>
                    </div>`
                  : ""
              }

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#121215;border:1px solid #27272a;border-radius:12px;margin-bottom:24px;overflow:hidden;">
                <thead>
                  <tr style="background-color:#1c1c20;">
                    <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;color:#a1a1aa;letter-spacing:0.5px;">Item</th>
                    <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:600;text-transform:uppercase;color:#a1a1aa;letter-spacing:0.5px;">Qty</th>
                    <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:600;text-transform:uppercase;color:#a1a1aa;letter-spacing:0.5px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding:16px;text-align:right;font-size:13px;font-weight:600;color:#a1a1aa;">
                      Total Paid:
                    </td>
                    <td style="padding:16px;text-align:right;font-size:16px;font-weight:700;color:#34d399;font-family:monospace;">
                      ${currency} ${formattedTotal}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${shopUrl}" style="display:inline-block;padding:12px 28px;background-color:#27272a;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;border-radius:8px;border:1px solid #3f3f46;">
                      Return to Store &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background-color:#121215;border-top:1px solid #27272a;text-align:center;">
              <p style="margin:0;font-size:12px;color:#71717a;">
                Rizfolio Digital Shop &bull; Need help? Contact us via the portfolio site.
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
