import { Container } from "@workspace/ui/components/layouts/container"
import { FilterSection } from "@/components/filters-section"
import {
  getPublishedPosts,
  getCategoriesWithCount,
  getFeaturedPost,
} from "@/lib/queries"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Eye,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react"

interface BlogPageProps {
  searchParams: Promise<{
    category?: string
    tag?: string
    q?: string
    page?: string
    sort?: "latest" | "popular"
  }>
}

export const revalidate = 3600

export default async function BlogHomePage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams
  const category = resolvedParams?.category
  const tag = resolvedParams?.tag
  const q = resolvedParams?.q
  const sort = resolvedParams?.sort || "latest"
  const currentPage = resolvedParams?.page
    ? parseInt(resolvedParams.page, 10)
    : 1

  const isDefaultView = !category && !tag && !q && currentPage === 1

  const [{ posts, total, totalPages }, categories, featuredPost] =
    await Promise.all([
      getPublishedPosts({
        categorySlug: category,
        tagSlug: tag,
        query: q,
        sort,
        page: currentPage,
        limit: 9,
      }),
      getCategoriesWithCount(),
      getFeaturedPost(),
    ])

  const totalAllPosts =
    categories.reduce((acc, cat) => acc + cat.count, 0) || total

  // If showing featured post on default view, omit it from the lower grid to avoid duplicate display
  const gridPosts =
    isDefaultView && featuredPost
      ? posts.filter((p) => p.slug !== featuredPost.slug)
      : posts

  return (
    <>
      {/* Editorial Header */}
      <section className="w-full pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Engineering Notes & Architectural Invariants
            </p>
            <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-5xl/tight">
              Articles on systems, design tokens & full-stack craft.
            </h1>
            <p className="text-sm/relaxed text-muted-foreground sm:text-base/relaxed">
              Substantive architectural essays exploring deterministic state, monorepo package isolation, database pooling resilience, and sub-second web performance.
            </p>
          </div>

          {/* Lead Featured Article Showcase (On default front view) */}
          {isDefaultView && featuredPost && (
            <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 transition-all duration-300 hover:border-foreground/20 hover:bg-card">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                {featuredPost.coverImageUrl && (
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-muted lg:col-span-7 lg:aspect-auto lg:h-full lg:min-h-[380px]">
                    <Image
                      src={featuredPost.coverImageUrl}
                      alt={featuredPost.title}
                      fill
                      priority
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent" />
                  </div>
                )}

                <div className="flex flex-col justify-between space-y-5 p-6 sm:p-8 lg:col-span-5 lg:py-8 lg:pr-8 lg:pl-0">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary text-[11px]">
                        Featured Lead
                      </span>
                      <span>&bull;</span>
                      <span>{featuredPost.readingTime} min read</span>
                      <span>&bull;</span>
                      <span>
                        {featuredPost.publishedAt
                          ? new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recent"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="line-clamp-3 text-xs/relaxed text-muted-foreground sm:text-sm/relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/40 pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {featuredPost.tags.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          #{t.name}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-x-1.5 text-xs font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <span>Read Article</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}
        </Container>
      </section>

      {/* Sticky Interactive Filter Bar */}
      <div className="sticky top-16 z-30 border-y border-border/60 bg-background/90 py-3 backdrop-blur-md">
        <Container>
          <FilterSection
            categories={categories}
            activeCategory={category}
            activeTag={tag}
            searchQuery={q}
            currentSort={sort}
            totalPosts={totalAllPosts}
          />
        </Container>
      </div>

      {/* Main Articles Stream */}
      <section className="w-full py-16">
        <Container>
          {gridPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-8 py-24 text-center">
              <BookOpen className="mb-3 size-10 text-muted-foreground/40" />
              <h2 className="text-base font-medium text-foreground">
                No matching articles found
              </h2>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                We couldn&apos;t find any published engineering notes matching your active filters or search query.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center text-xs font-medium text-primary hover:underline"
              >
                Reset all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => {
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
                            className="object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {primaryCategory && (
                          <Link
                            href={`/?category=${primaryCategory.slug}`}
                            className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground hover:bg-muted/80"
                          >
                            {primaryCategory.name}
                          </Link>
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

                      <div className="space-y-1.5">
                        <h2 className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="focus:outline-hidden"
                          >
                            {post.title}
                          </Link>
                        </h2>
                        <p className="line-clamp-3 text-xs/relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
                        {post.tags.slice(0, 2).map((t) => (
                          <Link
                            key={t.id}
                            href={`/?tag=${t.slug}`}
                            className="text-[11px] text-muted-foreground hover:text-foreground"
                          >
                            #{t.name}
                          </Link>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-between border-t border-border/50 pt-6 text-xs text-muted-foreground">
              <div>
                Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/?page=${currentPage - 1}${category ? `&category=${category}` : ""}${tag ? `&tag=${tag}` : ""}${q ? `&q=${q}` : ""}${sort !== "latest" ? `&sort=${sort}` : ""}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-foreground transition-all hover:bg-muted"
                  >
                    <ArrowLeft className="size-3" />
                    <span>Previous</span>
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/?page=${currentPage + 1}${category ? `&category=${category}` : ""}${tag ? `&tag=${tag}` : ""}${q ? `&q=${q}` : ""}${sort !== "latest" ? `&sort=${sort}` : ""}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-foreground transition-all hover:bg-muted"
                  >
                    <span>Next</span>
                    <ArrowRight className="size-3" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
