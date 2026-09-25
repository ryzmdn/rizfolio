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
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react"

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

  const baseUrl =
    process.env.NEXT_PUBLIC_BLOG_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rizkyramadhan.dev/blog"
  const postUrl = `${baseUrl}/blog/${post.slug}`

  return {
    title: `${post.title} | Rizky Ramadhan`,
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
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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
    .slice(0, 3)

  const baseUrl =
    process.env.NEXT_PUBLIC_BLOG_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rizkyramadhan.dev/blog"
  const postUrl = `${baseUrl}/blog/${post.slug}`

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

      <article className="w-full pt-10 pb-24 sm:pt-16 sm:pb-32">
        <Container className="max-w-5xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Articles</span>
          </Link>

          <header className="mb-10 space-y-6 border-b border-border/40 pb-10">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {primaryCategory && (
                <Link
                  href={`/?category=${primaryCategory.slug}`}
                  className="rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {primaryCategory.name}
                </Link>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formattedDate}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {post.readingTime} min read
              </span>
              {post.viewsCount !== undefined && post.viewsCount > 0 && (
                <>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" />
                    {post.viewsCount} views
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <p className="text-base/relaxed text-muted-foreground sm:text-lg/relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="relative size-9 overflow-hidden rounded-full ring-1 ring-border/60">
                  <Image
                    src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                    alt="Rizky Ramadhan"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Rizky Ramadhan</p>
                  <p className="text-[11px] text-muted-foreground">Multidisciplinary Digital Builder</p>
                </div>
              </div>

              <ShareToolbar title={post.title} url={postUrl} />
            </div>
          </header>

          {post.coverImageUrl && (
            <div className="mb-12 overflow-hidden rounded-xl border border-border/40 bg-muted">
              <div className="relative aspect-video w-full">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="lg:hidden mb-8">
            <TableOfContents content={post.contentMd} />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-10 lg:col-span-8">
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <MarkdownRenderer content={post.contentMd} />
              </div>

              {post.tags.length > 0 && (
                <div className="border-t border-border/40 pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Topics:
                    </span>
                    {post.tags.map((t) => (
                      <Link
                        key={t.id}
                        href={`/?tag=${t.slug}`}
                        className="rounded-md border border-border/50 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/20 p-4 sm:p-5">
                <PostReactions postId={post.id} initialCount={14} />
                <ShareToolbar title={post.title} url={postUrl} />
              </div>

              <AuthorBio />

              <PostNavigation prev={adjacent.prev} next={adjacent.next} />
            </div>

            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-28">
                <div className="rounded-xl border border-border/50 bg-muted/10 p-5">
                  <TableOfContents content={post.contentMd} />
                </div>
              </div>
            </aside>
          </div>

          {otherRelated.length > 0 && (
            <div className="mt-20 border-t border-border/40 pt-14">
              <h2 className="mb-6 text-base font-semibold text-foreground">
                More Articles
              </h2>

              <div className="grid grid-cols-1 gap-px border border-border/40 bg-border/40 sm:grid-cols-3">
                {otherRelated.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col bg-background p-5 transition-colors hover:bg-muted/20"
                  >
                    <div className="mb-3 text-xs text-muted-foreground">
                      <span>{rel.readingTime} min read</span>
                      {rel.categories[0] && (
                        <>
                          <span className="mx-1.5 text-border">·</span>
                          <span>{rel.categories[0].name}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-muted-foreground">
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
