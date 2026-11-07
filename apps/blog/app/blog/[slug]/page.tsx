import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Container } from "@workspace/ui/components/layouts/container"
import {
  getPostBySlug,
  getAllPostSlugs,
  getAdjacentPosts,
  getFeaturedOrRecentPosts,
} from "@/lib/queries"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { ViewTracker } from "@/components/view-tracker"
import { ReadingProgressBar } from "@/components/reading-progress-bar"
import { TableOfContents } from "@/components/table-of-contents"
import { ShareToolbar } from "@/components/share-toolbar"
import { PostReactions } from "@/components/post-reactions"
import { AuthorBio } from "@/components/author-bio"
import { PostNavigation } from "@/components/post-navigation"
import { CommentsSection } from "@/components/comments-section"
import { ArrowLeft, Calendar, Clock, Eye, ChevronRight } from "lucide-react"
import { getPostReactionCount } from "@/lib/actions"
import {
  getBaseUrl,
  SEO_CONFIG,
  createBreadcrumbJsonLd,
} from "@workspace/ui/lib/seo"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: "Article Not Found" }
  }

  const baseUrl = getBaseUrl("blog")
  const postUrl = `${baseUrl}/blog/${post.slug}`
  const coverImage = post.coverImageUrl || SEO_CONFIG.author.avatar

  return {
    title: `${post.title} | ${SEO_CONFIG.author.name}`,
    description: post.excerpt,
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: postUrl,
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      images: [{ url: coverImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [post, adjacent, relatedPosts] = await Promise.all([
    getPostBySlug(slug),
    getAdjacentPosts(slug),
    getFeaturedOrRecentPosts(3),
  ])

  if (!post) {
    notFound()
  }

  const reactionCount = await getPostReactionCount(post.id)

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recent"

  const primaryCategory = post.categories[0]
  const otherRelated = relatedPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  const baseUrl = getBaseUrl("blog")
  const postUrl = `${baseUrl}/blog/${post.slug}`

  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    dateModified: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
    image: post.coverImageUrl || SEO_CONFIG.author.avatar,
    author: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
    publisher: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Articles", url: baseUrl },
    ...(primaryCategory
      ? [
          {
            name: primaryCategory.name,
            url: `${baseUrl}/?category=${primaryCategory.slug}`,
          },
        ]
      : []),
    { name: post.title, url: postUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ReadingProgressBar />
      <ViewTracker postId={post.id} />

      <article className="w-full pt-12 pb-24 sm:pt-16 sm:pb-36">
        <Container className="max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3" />
              <span>Monographs</span>
            </Link>
            {primaryCategory && (
              <>
                <span className="text-foreground/20">/</span>
                <Link
                  href={`/?category=${primaryCategory.slug}`}
                  className="transition-colors hover:text-foreground"
                >
                  {primaryCategory.name}
                </Link>
              </>
            )}
            <span className="text-foreground/20">/</span>
            <span className="max-w-[200px] truncate text-foreground sm:max-w-xs">
              {post.slug}
            </span>
          </nav>

          <header className="mb-12 space-y-6 border-b border-foreground/8 pb-12">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase text-muted-foreground">
              {primaryCategory && (
                <Link
                  href={`/?category=${primaryCategory.slug}`}
                  className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-0.5 text-foreground transition-colors hover:border-foreground/30"
                >
                  {primaryCategory.name}
                </Link>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>{formattedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>{post.readingTime} min read</span>
              </span>
              {post.viewsCount !== undefined && post.viewsCount > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="size-3.5" />
                    <span>{post.viewsCount} views</span>
                  </span>
                </>
              )}
            </div>

            <h1 className="font-serif text-3xl font-light leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {post.title}
            </h1>

            <p className="max-w-3xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/8 pt-6">
              <div className="flex items-center gap-3.5">
                <div className="relative size-10 overflow-hidden rounded-full border border-foreground/15 bg-foreground/5">
                  <Image
                    src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                    alt="Rizky Ramadhan"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-serif text-sm font-light text-foreground">
                    Rizky Ramadhan
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    Multidisciplinary Digital Builder
                  </p>
                </div>
              </div>

              <ShareToolbar title={post.title} url={postUrl} />
            </div>
          </header>

          {post.coverImageUrl && (
            <div className="mb-14 overflow-hidden rounded-3xl border border-foreground/10 bg-muted">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 1100px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="mb-8 lg:hidden">
            <TableOfContents content={post.contentMd} />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-12 lg:col-span-8 lg:max-w-[700px]">
              <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-light prose-p:text-[1.125rem] prose-p:leading-[1.8] prose-p:font-light prose-p:text-foreground/90">
                <MarkdownRenderer content={post.contentMd} />
              </div>

              {post.tags.length > 0 && (
                <div className="border-t border-foreground/8 pt-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Index Tags:
                    </span>
                    {post.tags.map((t) => (
                      <Link
                        key={t.id}
                        href={`/?tag=${t.slug}`}
                        className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 font-mono text-xs uppercase text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:text-foreground"
                      >
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/8 pt-8">
                <PostReactions postId={post.id} initialCount={reactionCount} />
                <ShareToolbar title={post.title} url={postUrl} />
              </div>

              <AuthorBio />

              <PostNavigation prev={adjacent.prev} next={adjacent.next} />

              <CommentsSection postId={post.id} postSlug={post.slug} />
            </div>

            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-28 space-y-6">
                <TableOfContents content={post.contentMd} />
              </div>
            </aside>
          </div>

          {otherRelated.length > 0 && (
            <div className="mt-24 border-t border-foreground/8 pt-16">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    [ COMPLEMENTARY ARCHIVES ]
                  </span>
                  <h2 className="font-serif text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                    More Engineering Monographs
                  </h2>
                </div>
                <Link
                  href="/"
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  View All Archives [ -&gt; ]
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {otherRelated.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-6 transition-all duration-300 hover:border-foreground/25 hover:bg-foreground/[0.03]"
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase text-muted-foreground">
                        <span>{rel.readingTime} min</span>
                        {rel.categories[0] && (
                          <>
                            <span>•</span>
                            <span className="text-foreground">{rel.categories[0].name}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-serif text-base font-light leading-snug tracking-tight text-foreground transition-colors group-hover:text-muted-foreground">
                        {rel.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs font-light leading-relaxed text-muted-foreground">
                        {rel.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </article>
    </>
  )
}
