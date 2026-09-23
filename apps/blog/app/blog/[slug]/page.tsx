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
import { ArrowLeft, Calendar, Clock, Eye, Sparkles } from "lucide-react"

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
    return {
      title: "Article Not Found",
    }
  }

  const title = post.title
  const description = post.excerpt
  const baseUrl =
    process.env.NEXT_PUBLIC_BLOG_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rizkyramadhan.dev/blog"
  const postUrl = `${baseUrl}/blog/${post.slug}`

  return {
    title: `${title} | Rizky Ramadhan`,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: postUrl,
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
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
    .slice(0, 2)

  const baseUrl =
    process.env.NEXT_PUBLIC_BLOG_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rizkyramadhan.dev/blog"
  const postUrl = `${baseUrl}/blog/${post.slug}`

  // JSON-LD Structured Data Schema for Google Rich Snippets
  const jsonLd = {
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
      : undefined,
    image: post.coverImageUrl || undefined,
    author: {
      "@type": "Person",
      name: "Rizky Ramadhan",
      url: "https://rizkyramadhan.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Rizky Ramadhan",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgressBar />
      <ViewTracker postId={post.id} />

      <article className="w-full pt-12 pb-24 sm:pt-20 sm:pb-32">
        <Container className="max-w-4xl space-y-10">
          {/* Breadcrumb Navigation */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Articles</span>
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {primaryCategory && (
                <Link
                  href={`/?category=${primaryCategory.slug}`}
                  className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-medium text-primary hover:bg-primary/20"
                >
                  {primaryCategory.name}
                </Link>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>{formattedDate}</span>
              </span>
              <span className="text-muted-foreground/40">&bull;</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                <span>{post.readingTime} min read</span>
              </span>
              {post.viewsCount !== undefined && post.viewsCount > 0 && (
                <>
                  <span className="text-muted-foreground/40">&bull;</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="size-3.5" />
                    <span>{post.viewsCount} views</span>
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl/tight">
              {post.title}
            </h1>

            <p className="text-base/relaxed text-muted-foreground sm:text-lg/relaxed">
              {post.excerpt}
            </p>

            {/* Author Byline Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4">
              <div className="flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full ring-1 ring-border">
                  <Image
                    src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                    alt="Rizky Ramadhan"
                    fill
                    className="size-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">
                    Rizky Ramadhan
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Multidisciplinary Digital Builder
                  </div>
                </div>
              </div>

              <ShareToolbar title={post.title} url={postUrl} />
            </div>
          </header>

          {/* Cover Hero Image */}
          {post.coverImageUrl && (
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                priority
                className="size-full object-cover"
              />
            </div>
          )}

          {/* Mobile Table of Contents */}
          <div className="lg:hidden">
            <TableOfContents content={post.contentMd} />
          </div>

          {/* Split Content Grid (Content + Sticky TOC on Desktop) */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Main MDX Content */}
            <div className="space-y-12 lg:col-span-8">
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <MarkdownRenderer content={post.contentMd} />
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="border-t border-border/50 pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground mr-1">
                      Topics:
                    </span>
                    {post.tags.map((t) => (
                      <Link
                        key={t.id}
                        href={`/?tag=${t.slug}`}
                        className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Reader Reactions & Share */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/40 p-4 sm:p-5">
                <PostReactions postId={post.id} initialCount={14} />
                <ShareToolbar title={post.title} url={postUrl} />
              </div>

              {/* Author Bio Box */}
              <AuthorBio />

              {/* Adjacent Previous / Next Post Navigation */}
              <PostNavigation prev={adjacent.prev} next={adjacent.next} />
            </div>

            {/* Desktop Sticky Table of Contents */}
            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-xl border border-border/60 bg-card/50 p-5">
                  <TableOfContents content={post.contentMd} />
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles Showcase */}
          {otherRelated.length > 0 && (
            <div className="mt-20 space-y-6 border-t border-border/50 pt-16">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h2 className="text-lg font-medium text-foreground">
                  Related Architecture Notes
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {otherRelated.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group block rounded-xl border border-border/60 bg-card/40 p-5 transition-all hover:border-border hover:bg-card hover:shadow-xs"
                  >
                    <div className="mb-2 text-xs text-muted-foreground">
                      {rel.readingTime} min read &bull;{" "}
                      {rel.categories[0]?.name || "Article"}
                    </div>
                    <h3 className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {rel.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs/relaxed text-muted-foreground">
                      {rel.excerpt}
                    </p>
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
