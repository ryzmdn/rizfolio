import { Container } from "@workspace/ui/components/layouts/container"
import { FilterSection } from "@/components/filters-section"
import {
  getPublishedPosts,
  getCategoriesWithCount,
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
import { createWebSiteJsonLd, getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

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

function formatDate(date: string | Date | null, format: "short" | "long" = "short") {
  if (!date) return "Recent"
  return new Date(date).toLocaleDateString("en-US", {
    month: format === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function BlogHomePage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams
  const category = resolvedParams?.category
  const tag = resolvedParams?.tag
  const q = resolvedParams?.q
  const sort = resolvedParams?.sort || "latest"
  const currentPage = resolvedParams?.page ? parseInt(resolvedParams.page, 10) : 1

  const isDefaultView = !category && !tag && !q && currentPage === 1

  const [{ posts, total, totalPages }, categories] =
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
    ])

  const featuredPost = isDefaultView
    ? posts.find((p) => p.featured) || posts[0] || null
    : null

  const totalAllPosts =
    categories.reduce((acc, cat) => acc + cat.count, 0) || total

  const gridPosts =
    isDefaultView && featuredPost
      ? posts.filter((p) => p.slug !== featuredPost.slug)
      : posts

  const blogUrl = getBaseUrl("blog")
  const websiteSchema = createWebSiteJsonLd({
    siteKey: "blog",
    url: blogUrl,
  })

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${blogUrl}/#blog`,
    name: SEO_CONFIG.sites.blog.name,
    description: SEO_CONFIG.sites.blog.description,
    url: blogUrl,
    publisher: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${blogUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <section className="w-full border-b border-border/40 pb-0 pt-10 sm:pt-16">
        <Container>
          {isDefaultView && featuredPost ? (
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
              <div className="flex flex-col justify-between py-6 pr-0 lg:col-span-5 lg:py-8 lg:pr-12">
                <div>
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Engineering Notes & Architectural Invariants
                  </p>
                  <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    Articles on systems, design & full-stack craft.
                  </h1>
                  <p className="mt-4 text-sm/relaxed text-muted-foreground sm:text-base/relaxed">
                    Architectural essays on deterministic state, monorepo package isolation, database resilience, and sub-second web performance.
                  </p>
                </div>

                <div className="mt-8 hidden text-xs text-muted-foreground lg:flex">
                  <span>{totalAllPosts} articles published</span>
                </div>
              </div>

              <article className="group relative lg:col-span-7 lg:border-l lg:border-border/50">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="block"
                  aria-label={`Read: ${featuredPost.title}`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted lg:aspect-[4/3]">
                    {featuredPost.coverImageUrl ? (
                      <Image
                        src={featuredPost.coverImageUrl}
                        alt={featuredPost.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-muted">
                        <BookOpen className="size-12 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-white/70">
                        <span className="rounded bg-white/15 px-2 py-0.5 font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                          Featured
                        </span>
                        {featuredPost.categories[0] && (
                          <span className="text-white/60">
                            {featuredPost.categories[0].name}
                          </span>
                        )}
                        <span className="text-white/40">&bull;</span>
                        <span className="flex items-center gap-1 text-white/60">
                          <Clock className="size-3" />
                          {featuredPost.readingTime} min read
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
                        {featuredPost.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm/relaxed text-white/70">
                        {featuredPost.excerpt}
                      </p>

                      <div className="mt-4 flex items-center gap-x-2 text-xs text-white/60">
                        <Calendar className="size-3" />
                        <span>{formatDate(featuredPost.publishedAt)}</span>
                        <span className="ml-auto inline-flex items-center gap-1 font-medium text-white transition-opacity group-hover:opacity-70">
                          <span>Read article</span>
                          <ArrowUpRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            </div>
          ) : (
            <div className="max-w-3xl py-8 sm:py-12">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Engineering Notes & Architectural Invariants
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                Articles on systems, design & full-stack craft.
              </h1>
              <p className="mt-4 text-sm/relaxed text-muted-foreground sm:text-base/relaxed">
                Architectural essays on deterministic state, monorepo package isolation, database resilience, and sub-second web performance.
              </p>
            </div>
          )}
        </Container>
      </section>

      <div className="sticky top-14 z-30 border-b border-border/50 bg-background/95 py-3 backdrop-blur-md">
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

      <section className="w-full py-12 sm:py-16">
        <Container>
          {gridPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-border/50 py-24 text-center">
              <BookOpen className="mb-4 size-8 text-muted-foreground/30" />
              <h2 className="text-sm font-semibold text-foreground">
                No articles found
              </h2>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                No published articles match your current filters or search query.
              </p>
              <Link
                href="/"
                className="mt-5 text-sm font-medium text-foreground underline underline-offset-2 hover:text-muted-foreground"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-px border border-border/40 bg-border/40 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, index) => {
                const primaryCategory = post.categories[0]
                const isLarge = index === 0 && gridPosts.length >= 3

                return (
                  <article
                    key={post.id}
                    className={
                      isLarge
                        ? "group flex flex-col justify-between bg-background md:col-span-2"
                        : "group flex flex-col justify-between bg-background"
                    }
                  >
                    <div>
                      {post.coverImageUrl ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="block overflow-hidden bg-muted"
                          aria-label={`Read: ${post.title}`}
                          tabIndex={-1}
                        >
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                              src={post.coverImageUrl}
                              alt={post.title}
                              fill
                              loading={index < 3 ? "eager" : "lazy"}
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                        </Link>
                      ) : null}

                      <div className="p-5 sm:p-6 pb-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                          {primaryCategory && (
                            <>
                              <Link
                                href={`/?category=${primaryCategory.slug}`}
                                className="font-medium text-foreground transition-colors hover:text-muted-foreground"
                              >
                                {primaryCategory.name}
                              </Link>
                              <span className="text-border">·</span>
                            </>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {post.readingTime} min
                          </span>
                          <span className="text-border">·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>

                        <h2
                          className={
                            isLarge
                              ? "mt-3 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl"
                              : "mt-3 text-base font-semibold leading-snug tracking-tight text-foreground"
                          }
                        >
                          <Link
                            href={`/blog/${post.slug}`}
                            className="transition-colors hover:text-muted-foreground"
                          >
                            {post.title}
                          </Link>
                        </h2>

                        <p className="mt-3 line-clamp-3 text-sm/relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 pt-5">
                      <div className="flex items-center justify-between border-t border-border/40 pt-4">
                        <div className="flex flex-wrap gap-x-2">
                          {post.tags.slice(0, 2).map((t) => (
                            <Link
                              key={t.id}
                              href={`/?tag=${t.slug}`}
                              className="text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
                              aria-label={`Filter by tag: ${t.name}`}
                            >
                              #{t.name}
                            </Link>
                          ))}
                        </div>

                        {post.viewsCount !== undefined && post.viewsCount > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                            <Eye className="size-3" />
                            <span>{post.viewsCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-border/40 pt-6">
              <p className="text-xs text-muted-foreground">
                Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/?page=${currentPage - 1}${category ? `&category=${category}` : ""}${tag ? `&tag=${tag}` : ""}${q ? `&q=${q}` : ""}${sort !== "latest" ? `&sort=${sort}` : ""}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/50"
                  >
                    <ArrowLeft className="size-3" />
                    <span>Previous</span>
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/?page=${currentPage + 1}${category ? `&category=${category}` : ""}${tag ? `&tag=${tag}` : ""}${q ? `&q=${q}` : ""}${sort !== "latest" ? `&sort=${sort}` : ""}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/50"
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
