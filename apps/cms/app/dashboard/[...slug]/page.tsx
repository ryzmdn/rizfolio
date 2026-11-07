import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardCatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const targetPath = slug && slug.length > 0 ? `/${slug.join("/")}` : "/"
  redirect(targetPath)
}
