import { Container } from "@workspace/ui/components/layouts/container"
import { getChangelogReleases, getChangelogStats } from "@/lib/queries"
import { TimelineExplorer } from "@/components"

export const revalidate = 3600

export default async function ChangelogPage() {
  const [releases, stats] = await Promise.all([
    getChangelogReleases(),
    getChangelogStats(),
  ])

  return (
    <Container className="max-w-6xl py-10 sm:py-16">
      <TimelineExplorer initialReleases={releases} stats={stats} />
    </Container>
  )
}
