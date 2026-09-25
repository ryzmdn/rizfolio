import { CmsPageShell } from "@/components/cms-page-shell"
import { ChangelogManagerView } from "@/components/changelog/changelog-manager-view"
import {
  getChangelogs,
  getAllChangelogItems,
  getRoadmapItems,
} from "@/lib/actions/changelog-actions"

export const dynamic = "force-dynamic"

export default async function ChangelogManagerPage() {
  const [changelogs, items, roadmapItems] = await Promise.all([
    getChangelogs(),
    getAllChangelogItems(),
    getRoadmapItems(),
  ])

  return (
    <CmsPageShell
      title="Changelog Engine & Interactive Roadmap Hub"
      description="Catat riwayat rilis pembaruan, rincian butir fitur sorotan, dan lini masa target peta jalan pengembangan."
    >
      <ChangelogManagerView
        changelogs={changelogs}
        items={items}
        roadmapItems={roadmapItems}
      />
    </CmsPageShell>
  )
}
