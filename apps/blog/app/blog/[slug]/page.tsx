import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { getPostBySlug, getFeaturedOrRecentPosts } from "@/lib/queries"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { ViewTracker } from "@/components/view-tracker"
import { ArrowLeft, Calendar, Clock, Eye, Sparkles } from "lucide-react"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Article Not Found — Rizky's Blog",
    }
  }

  const title = post.title
  const description = post.excerpt

  return {
    title: `${title} — Rizky's Blog`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
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
  const [post, relatedPosts] = await Promise.all([
    getPostBySlug(slug),
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

  return (
    <>
      <ViewTracker postId={post.id} />

      <Container className="max-w-4xl py-12 md:py-20">
        {/* Back Navigation */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {primaryCategory && (
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-medium text-primary">
                {primaryCategory.name}
              </span>
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

          <h1 className="text-3xl leading-tight font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {post.excerpt}
          </p>

          {/* Author info */}
          <div className="flex items-center gap-3 border-t border-border/60 pt-4">
            <div className="size-10 overflow-hidden rounded-full bg-foreground/10 ring-1 ring-border">
              <Image
                src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                alt="Rizky Ramadhan"
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-medium text-foreground">
                Rizky Ramadhan
              </div>
              <div className="text-[11px] text-muted-foreground">
                Full-Stack Engineer & Author
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="relative my-10 aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Main Article Markdown Content */}
        <div className="mt-10 border-t border-border/40 pt-4">
          <MarkdownRenderer content={post.contentMd} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 border-t border-border/60 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium text-muted-foreground">
                Tags:
              </span>
              {post.tags.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center rounded-md border border-border/50 bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {otherRelated.length > 0 && (
          <div className="mt-20 space-y-6 border-t border-border pt-12">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="text-lg font-medium text-foreground">
                Related & Recent Articles
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {otherRelated.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group block rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-border hover:bg-card"
                >
                  <div className="mb-2 text-xs text-muted-foreground">
                    {rel.readingTime} min read &bull;{" "}
                    {rel.categories[0]?.name || "Article"}
                  </div>
                  <h3 className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {rel.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
