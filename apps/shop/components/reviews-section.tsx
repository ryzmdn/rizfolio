"use client"

import { useState, useTransition } from "react"
import { Star, CheckCircle2, MessageSquarePlus, X } from "lucide-react"
import { submitReviewAction } from "../lib/actions"
import type { ProductReview } from "../lib/queries"
import { cn } from "@workspace/ui/lib/utils"

interface ReviewsSectionProps {
  productSlug: string
  initialReviews: ProductReview[]
  averageRating: number
  reviewCount: number
}

export function ReviewsSection({
  productSlug,
  initialReviews,
  averageRating,
  reviewCount,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [formName, setFormName] = useState("")
  const [formRole, setFormRole] = useState("")
  const [formRating, setFormRating] = useState(5)
  const [formContent, setFormContent] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!formName.trim() || formName.trim().length < 2) {
      setFormError("Please enter your name with at least 2 characters.")
      return
    }

    if (!formContent.trim() || formContent.trim().length < 10) {
      setFormError("Please write a review with at least 10 characters.")
      return
    }

    startTransition(async () => {
      const result = await submitReviewAction({
        productSlug,
        authorName: formName.trim(),
        authorRole: formRole.trim() || "Verified Developer",
        rating: formRating,
        content: formContent.trim(),
      })

      if (result.success && result.review) {
        setReviews((prev) => [result.review!, ...prev])
        setFormSuccess(true)
        setFormName("")
        setFormRole("")
        setFormContent("")
        setFormRating(5)
        setTimeout(() => {
          setFormSuccess(false)
          setIsFormOpen(false)
        }, 1500)
      } else {
        setFormError(result.error || "Failed to submit review.")
      }
    })
  }

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { stars, count, percentage }
  })

  return (
    <section className="space-y-8 rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Customer Reviews & Feedback
            </span>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Verified ratings and architectural reviews from software engineers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.99]"
        >
          <MessageSquarePlus className="size-4 text-primary" />
          <span>Write a Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border/60 bg-muted/20 p-6 sm:grid-cols-12 sm:items-center sm:gap-8">
        <div className="flex flex-col items-center justify-center text-center sm:col-span-4 sm:items-start sm:text-left">
          <span className="font-mono text-4xl font-bold text-foreground sm:text-5xl">
            {averageRating.toFixed(1)}
          </span>
          <div className="mt-2 flex items-center text-amber-500 dark:text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "size-4",
                  star <= Math.round(averageRating)
                    ? "fill-current"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="mt-1 text-xs text-muted-foreground">
            Based on {reviewCount} verified reviews
          </span>
        </div>

        <div className="space-y-2 sm:col-span-8">
          {ratingCounts.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="flex w-12 items-center gap-1 font-mono text-muted-foreground">
                <span>{stars}</span>
                <Star className="size-3 fill-current text-amber-500" />
              </span>

              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-8 text-right font-mono text-xs text-muted-foreground">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="space-y-4 rounded-2xl border border-primary/30 bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Share Your Experience
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {formSuccess ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              <span>Review submitted successfully. Thank you for your feedback.</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Alex Pratama"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Role / Position (Optional)
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Architect"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="cursor-pointer p-1 text-amber-500 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "size-5",
                          star <= formRating
                            ? "fill-current"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {formRating} of 5 stars
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Review Comment
                </label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Share details about the code structure, performance, or developer experience..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-500">{formError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </>
          )}
        </form>
      )}

      <div className="divide-y divide-border/60">
        {reviews.map((rev) => (
          <article key={rev.id} className="space-y-2.5 py-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  {rev.authorName}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {rev.authorRole}
                </span>
                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    <span>Verified Buyer</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500 dark:text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "size-3",
                        star <= Math.round(rev.rating)
                          ? "fill-current"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <time className="font-mono text-[11px] text-muted-foreground">
                  {new Date(rev.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {rev.content}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
