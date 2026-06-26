"use client"

import { useState, useCallback } from "react"
import { ChevronRight, ChevronLeft, CheckCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { generateBunnyEmbedUrl } from "@/lib/bunny"
import type { Lesson } from "@/types/database"

interface LessonPlayerProps {
  lesson: Lesson & { module: { course_id: string; title: string } }
  userId?: string
}

export function LessonPlayer({ lesson, userId }: LessonPlayerProps) {
  const [completed, setCompleted] = useState(false)

  const handleComplete = useCallback(async () => {
    if (!userId) return
    setCompleted(true)
    const { updateLessonProgress } = await import("@/lib/actions/courses")
    await updateLessonProgress(lesson.id, lesson.video_duration || 300)
  }, [lesson.id, lesson.video_duration, userId])

  const embedUrl = lesson.video_url ? generateBunnyEmbedUrl(lesson.video_url.split("/").pop() || lesson.video_url) : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
      {/* Video Player */}
      <div className="lg:col-span-2 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {lesson.content_type === "video" && embedUrl ? (
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : lesson.content_type === "article" ? (
            <div className="prose prose-lg max-w-none mb-6" dangerouslySetInnerHTML={{ __html: lesson.article_body || "" }} />
          ) : (
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center mb-6">
              <FileText className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-muted-foreground mb-4">{lesson.module.title}</p>

          {lesson.description && (
            <p className="text-muted-foreground mb-6">{lesson.description}</p>
          )}

          <div className="flex items-center gap-4">
            <Button onClick={handleComplete} variant={completed ? "default" : "outline"}>
              <CheckCircle className="ml-2 h-4 w-4" />
              {completed ? "تم الإكمال" : "تحديد كمكتمل"}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - could be used for course curriculum */}
      <div className="border-r p-4 bg-muted/30">
        <h3 className="font-semibold mb-4">محتوى الدورة</h3>
        <p className="text-sm text-muted-foreground">سيتم عرض قائمة الدروس هنا</p>
      </div>
    </div>
  )
}
