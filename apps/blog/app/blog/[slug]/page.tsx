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
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
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
  const otherRelated = relatedPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <>
      <ViewTracker postId={post.id} />

      <Container className="py-12 md:py-20 max-w-4xl">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {primaryCategory && (
              <span className="rounded-md bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 font-medium">
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

          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          {/* Author info */}
          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <div className="size-10 rounded-full bg-foreground/10 overflow-hidden ring-1 ring-border">
              <Image
                src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                alt="Rizky Ramadhan"
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-medium text-foreground">Rizky Ramadhan</div>
              <div className="text-[11px] text-muted-foreground">Full-Stack Engineer & Author</div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted border border-border/60 my-10 shadow-sm">
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
        <div className="mt-10 pt-4 border-t border-border/40">
          <MarkdownRenderer content={post.contentMd} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border/60">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground mr-1">Tags:</span>
              {post.tags.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-muted/60 text-muted-foreground border border-border/50"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {otherRelated.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="text-lg font-medium text-foreground">Related & Recent Articles</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherRelated.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group block rounded-xl border border-border/60 bg-card/40 p-4 hover:border-border hover:bg-card transition-all"
                >
                  <div className="text-xs text-muted-foreground mb-2">
                    {rel.readingTime} min read &bull; {rel.categories[0]?.name || "Article"}
                  </div>
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {rel.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
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
