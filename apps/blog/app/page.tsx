import { Container } from "@workspace/ui/components/layouts/container"
import { FilterSection } from "@/components/filters-section"
import {
  getPublishedPosts,
  getCategoriesWithCount,
} from "@/lib/queries"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Eye, Sparkles, BookOpen, ArrowLeft, ArrowRight } from "lucide-react"

interface BlogPageProps {
  searchParams: Promise<{
    category?: string
    q?: string
    page?: string
  }>
}

export default async function BlogHomePage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams
  const category = resolvedParams?.category
  const q = resolvedParams?.q
  const currentPage = resolvedParams?.page ? parseInt(resolvedParams.page, 10) : 1

  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPublishedPosts({
      categorySlug: category,
      query: q,
      page: currentPage,
      limit: 9,
    }),
    getCategoriesWithCount(),
  ])

  const totalAllPosts = categories.reduce((acc, cat) => acc + cat.count, 0) || total

  return (
    <>
      <Container className="py-20">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            <span>Engineering Insights & Systems Design</span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Articles, Architecture & Notes
          </h1>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            In-depth perspectives on modern full-stack systems, monorepo architectures, deterministic state management, and high-impact UI engineering.
          </p>
        </div>
      </Container>

      <Container className="border-y border-border py-4 bg-background/50 backdrop-blur-xs sticky top-0 z-20">
        <FilterSection
          categories={categories}
          activeCategory={category}
          searchQuery={q}
          totalPosts={totalAllPosts}
        />
      </Container>

      <Container className="py-16">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-border p-8">
            <BookOpen className="size-10 text-muted-foreground/40 mb-3" />
            <h2 className="text-lg font-medium text-foreground">No articles found</h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              We couldn&apos;t find any published articles matching your current filter or search criteria.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center text-xs text-primary hover:underline font-medium"
            >
              Reset all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const primaryCategory = post.categories[0]
              const formattedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent"

              return (
                <article
                  key={post.id}
                  className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-4 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-xs"
                >
                  <div className="space-y-4">
                    {post.coverImageUrl && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={post.coverImageUrl}
                          alt={post.title}
                          fill
                          loading="lazy"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {primaryCategory && (
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                          {primaryCategory.name}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{post.readingTime} min read</span>
                      </span>
                      <span className="text-muted-foreground/40">&bull;</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>{formattedDate}</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                        <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t.id} className="text-[11px] text-muted-foreground/80">
                          #{t.name}
                        </span>
                      ))}
                    </div>
                    {post.viewsCount !== undefined && post.viewsCount > 0 && (
                      <div className="flex items-center gap-1 text-[11px]">
                        <Eye className="size-3" />
                        <span>{post.viewsCount}</span>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
            <div>
              Showing page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/?page=${currentPage - 1}${category ? `&category=${category}` : ""}${q ? `&q=${q}` : ""}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 hover:bg-muted text-foreground transition-all"
                >
                  <ArrowLeft className="size-3" />
                  <span>Previous</span>
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/?page=${currentPage + 1}${category ? `&category=${category}` : ""}${q ? `&q=${q}` : ""}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 hover:bg-muted text-foreground transition-all"
                >
                  <span>Next</span>
                  <ArrowRight className="size-3" />
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
