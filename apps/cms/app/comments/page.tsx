import { Metadata } from "next"
import { CmsPageShell } from "@/components/cms-page-shell"
import {
  getCommentsAdmin,
  getCommentStats,
} from "@/lib/actions/comment-actions"
import { CommentsManagerClient } from "@/components/comments/comments-manager-client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Moderasi Komentar Blog",
  description:
    "Pusat kontrol dan filter moderasi komentar pembaca artikel blog.",
}

export default async function CommentsPage() {
  const [initialComments, initialStats] = await Promise.all([
    getCommentsAdmin(),
    getCommentStats(),
  ])

  return (
    <CmsPageShell
      title="Moderasi Komentar Blog"
      description="Kelola, filter, setujui, tandai spam, atau bersihkan komentar pada seluruh artikel blog ekosistem rizfolio."
    >
      <CommentsManagerClient
        initialComments={initialComments}
        initialStats={initialStats}
      />
    </CmsPageShell>
  )
}
