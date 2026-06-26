"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ChevronRight, ChevronLeft, CheckCircle, FileText, PlayCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { generateBunnyEmbedUrl } from "@/lib/bunny"
import type { Lesson, Module } from "@/types/database"

interface LessonPlayerProps {
  lesson: Lesson & { module: { course_id: string; title: string } }
  modules?: Module[]
  userId?: string
}

export function LessonPlayer({ lesson, modules, userId }: LessonPlayerProps) {
  const [completed, setCompleted] = useState(false)

  const handleComplete = useCallback(async () => {
    if (!userId) return
    setCompleted(true)
    const { updateLessonProgress } = await import("@/lib/actions/courses")
    await updateLessonProgress(lesson.id, lesson.video_duration || 300)
  }, [lesson.id, lesson.video_duration, userId])

  const embedUrl = lesson.video_url ? generateBunnyEmbedUrl(lesson.video_url.split("/").pop() || lesson.video_url) : null

  const allLessons = modules?.flatMap((m) =>
    (m.lessons || []).map((l) => ({ ...l, moduleTitle: m.title, moduleId: m.id }))
  ) || []
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={handleComplete} variant={completed ? "default" : "outline"}>
                <CheckCircle className="ml-2 h-4 w-4" />
                {completed ? "تم الإكمال" : "تحديد كمكتمل"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link href={`/courses/${lesson.module.course_id}/lessons/${prevLesson.id}`}>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4 ml-1" />السابق
                  </Button>
                </Link>
              )}
              {nextLesson && (
                <Link href={`/courses/${lesson.module.course_id}/lessons/${nextLesson.id}`}>
                  <Button variant="outline" size="sm">
                    التالي<ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-r p-4 bg-muted/30 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <h3 className="font-semibold mb-4">محتوى الدورة</h3>
        <div className="space-y-1">
          {modules?.map((mod) => (
            <div key={mod.id} className="mb-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">{mod.title}</p>
              {mod.lessons?.map((l) => {
                const isActive = l.id === lesson.id
                return (
                  <Link
                    key={l.id}
                    href={`/courses/${lesson.module.course_id}/lessons/${l.id}`}
                    className={`flex items-center gap-2 py-1.5 px-2 rounded text-sm transition-colors ${
                      isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                    }`}
                  >
                    {l.content_type === "video" ? (
                      <PlayCircle className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">{l.title}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
