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
  const [posts, categories, tags, relations] = await Promise.all([
    getPosts(),
    getBlogCategories(),
    getBlogTags(),
    getPostRelationsMap(),
  ])

  return (
    <CmsPageShell
      title="Blog Manager"
      description="Tulis artikel teknis dengan live Markdown editor, kelola status publikasi, dan atur taksonomi kategori."
    >
      <BlogManagerView
        initialPosts={posts}
        categories={categories}
        tags={tags}
        postCategoriesMap={relations.postCategoriesMap}
        postTagsMap={relations.postTagsMap}
      />
    </CmsPageShell>
  )
}
