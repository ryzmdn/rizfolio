import { Container } from "@workspace/ui/components/layouts/container"
import { FilterSection } from "@/components/filters-section"
import { getPublishedPosts, getCategoriesWithCount } from "@/lib/queries"
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
import {
  createWebSiteJsonLd,
  getBaseUrl,
  SEO_CONFIG,
} from "@workspace/ui/lib/seo"

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

function formatDate(
  date: string | Date | null,
  format: "short" | "long" = "short"
) {
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
  const currentPage = resolvedParams?.page
    ? parseInt(resolvedParams.page, 10)
    : 1

  const isDefaultView = !category && !tag && !q && currentPage === 1

  const [{ posts, total, totalPages }, categories] = await Promise.all([
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
      <section className="w-full border-b border-foreground/8 pt-12 pb-10 sm:pt-20 sm:pb-16">
        <Container>
          {isDefaultView && featuredPost ? (
            <div className="space-y-12">
              <div className="flex flex-col justify-between gap-6 border-b border-foreground/8 pb-8 md:flex-row md:items-end">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                      [ THE ARCHITECTURAL MONOGRAPH // VOL. 04 ]
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    Essays on systems, invariants & craft.
                  </h1>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground/70 uppercase">
                  <span>{totalAllPosts} Published Monographs</span>
                  <span>•</span>
                  <span>Peer-Reviewed</span>
                </div>
              </div>

              <article className="group overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/2 transition-hover-lift hover:border-foreground/30 hover:shadow-2xl">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="grid grid-cols-1 gap-0 lg:grid-cols-12"
                  aria-label={`Read: ${featuredPost.title}`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted lg:col-span-7 lg:aspect-[16/10]">
                    {featuredPost.coverImageUrl ? (
                      <Image
                        src={featuredPost.coverImageUrl}
                        alt={featuredPost.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-foreground/5">
                        <BookOpen className="size-12 text-foreground/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-5 lg:p-12">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase">
                        <span className="rounded-full bg-foreground px-3 py-0.5 text-[10px] font-semibold tracking-wider text-background">
                          Featured Essay
                        </span>
                        {featuredPost.categories[0] && (
                          <span className="rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 text-[10px] text-muted-foreground">
                            {featuredPost.categories[0].name}
                          </span>
                        )}
                        <span className="text-muted-foreground/40">•</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="size-3" />
                          {featuredPost.readingTime} min
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl leading-snug font-light tracking-tight text-foreground transition-colors group-hover:text-muted-foreground sm:text-3xl lg:text-4xl">
                        {featuredPost.title}
                      </h2>

                      <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-foreground/8 pt-6 font-mono text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span>
                          {formatDate(featuredPost.publishedAt, "long")}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-2 font-medium tracking-wider text-foreground uppercase">
                        <span>Read monograph</span>
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            </div>
          ) : (
            <div className="max-w-3xl space-y-3 py-6 sm:py-10">
              <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                [ ARCHIVE DISPATCH // ALL ESSAYS ]
              </span>
              <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-5xl">
                Essays on systems, design & full-stack craft.
              </h1>
              <p className="text-sm leading-relaxed font-light text-muted-foreground sm:text-base">
                Architectural essays on deterministic state, monorepo package
                isolation, database resilience, and sub-second web performance.
              </p>
            </div>
          )}
        </Container>
      </section>

      <div className="sticky top-16 z-30 border-b border-foreground/8 bg-background/90 py-3.5 backdrop-blur-2xl">
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

      <section className="w-full py-16 sm:py-24">
        <Container>
          {gridPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/15 bg-foreground/2 p-12 text-center sm:p-20">
              <BookOpen className="mb-4 size-10 stroke-[1.25] text-muted-foreground/30" />
              <h2 className="font-serif text-lg font-light text-foreground">
                No monographs located
              </h2>
              <p className="mt-2 max-w-xs text-xs font-light text-muted-foreground">
                No published essays match the current query parameters or
                filters.
              </p>
              <Link
                href="/blog"
                className="mt-6 rounded-full bg-foreground px-6 py-2.5 font-mono text-xs tracking-wider text-background uppercase transition-opacity hover:opacity-80"
              >
                Reset Catalog Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {gridPosts.map((post, index) => {
                const primaryCategory = post.categories[0]

                return (
                  <article
                    key={post.id}
                    className="group flex flex-col justify-between rounded-3xl border border-foreground/8 bg-foreground/[0.015] p-6 transition-hover-lift hover:border-foreground/30 hover:bg-foreground/[0.03] hover:shadow-2xl sm:p-7"
                  >
                    <div>
                      {post.coverImageUrl ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="block overflow-hidden rounded-2xl border border-foreground/8 bg-muted"
                          aria-label={`Read: ${post.title}`}
                          tabIndex={-1}
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden">
                            <Image
                              src={post.coverImageUrl}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              loading={index < 3 ? "eager" : "lazy"}
                              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                            />
                          </div>
                        </Link>
                      ) : null}

                      <div className="pt-5">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground uppercase">
                          {primaryCategory && (
                            <Link
                              href={`/blog?category=${primaryCategory.slug}`}
                              className="rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-foreground transition-colors hover:border-foreground/30"
                            >
                              {primaryCategory.name}
                            </Link>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {post.readingTime} min
                          </span>
                          <span>•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>

                        <h2 className="mt-3 font-serif text-lg leading-snug font-light tracking-tight text-foreground transition-colors group-hover:text-muted-foreground sm:text-xl">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>

                        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed font-light text-muted-foreground">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-foreground/8 pt-4">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 2).map((t) => (
                            <Link
                              key={t.id}
                              href={`/blog?tag=${t.slug}`}
                              className="text-muted-foreground/60 transition-colors hover:text-foreground"
                              aria-label={`Filter by tag: ${t.name}`}
                            >
                              #{t.name}
                            </Link>
                          ))}
                        </div>

                        {post.viewsCount !== undefined &&
                          post.viewsCount > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground/60">
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
            <div className="mt-16 flex items-center justify-between border-t border-foreground/8 pt-8 font-mono text-xs">
              <p className="text-muted-foreground">
                INDEX{" "}
                <span className="font-semibold text-foreground">
                  {currentPage}
                </span>{" "}
                OF{" "}
                <span className="font-semibold text-foreground">
                  {totalPages}
                </span>
              </p>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}${category ? `&category=${category}` : ""}${tag ? `&tag=${tag}` : ""}${q ? `&q=${q}` : ""}${sort !== "latest" ? `&sort=${sort}` : ""}`}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/3 px-4 py-2 tracking-wider text-foreground uppercase transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
                  >
                    <ArrowLeft className="size-3" />
                    <span>Previous</span>
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}${category ? `&category=${category}` : ""}${tag ? `&tag=${tag}` : ""}${q ? `&q=${q}` : ""}${sort !== "latest" ? `&sort=${sort}` : ""}`}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/3 px-4 py-2 tracking-wider text-foreground uppercase transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
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
