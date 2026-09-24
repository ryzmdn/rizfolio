import { CmsPageShell } from "@/components/cms-page-shell"
import { BlogManagerView } from "@/components/blog/blog-manager-view"
import {
  getPosts,
  getBlogCategories,
  getBlogTags,
  getPostRelationsMap,
} from "@/lib/actions/blog-actions"

export const dynamic = "force-dynamic"

export default async function BlogManagerPage() {
  const [postList, categoryList, tagList, relations] = await Promise.all([
    getPosts(),
    getBlogCategories(),
    getBlogTags(),
    getPostRelationsMap(),
  ])

  return (
    <CmsPageShell
      title="Blog Manager"
      description="Tulis artikel teknis, kelola draf, publikasi, taksonomi kategori, dan optimasi SEO."
    >
      <BlogManagerView
        initialPosts={postList}
        categories={categoryList}
        tags={tagList}
        postCategoriesMap={relations.postCategoriesMap}
        postTagsMap={relations.postTagsMap}
      />
    </CmsPageShell>
  )
}
