"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, formatDate } from "@/lib/utils"
import type { Review } from "@/types/database"

interface ReviewSectionProps {
  courseId: string
  reviews: (Review & { user: { full_name: string; avatar_url: string | null } })[]
  userId?: string
}

export function ReviewSection({ courseId, reviews, userId }: ReviewSectionProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || !userId) return
    setSubmitting(true)

    const supabase = (await import("@/lib/supabase/client")).createClient()
    await supabase.from("reviews").upsert({
      user_id: userId,
      course_id: courseId,
      rating,
      comment,
    })

    setRating(0)
    setComment("")
    setSubmitting(false)
    window.location.reload()
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">
        التقييمات ({reviews.length})
        {avgRating > 0 && (
          <span className="text-base font-normal text-muted-foreground mr-2">
            ({avgRating.toFixed(1)} / 5)
          </span>
        )}
      </h2>

      {/* Write Review */}
      {userId && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
          <div className="flex gap-1 mb-3" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredStar || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="اكتب تقييمك..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-3"
          />
          <Button type="submit" disabled={!rating || submitting}>
            إرسال التقييم
          </Button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3 p-4 border rounded-lg">
            <Avatar>
              <AvatarImage src={review.user?.avatar_url || undefined} />
              <AvatarFallback>{review.user ? getInitials(review.user.full_name) : "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{review.user?.full_name}</span>
                <div className="flex" dir="ltr">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{formatDate(review.created_at)}</p>
              {review.comment && <p className="text-sm">{review.comment}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
