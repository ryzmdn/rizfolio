import { GET as getRss } from "../rss.xml/route"

export const dynamic = "force-static"
export const revalidate = 3600

export async function GET() {
  return getRss()
}
