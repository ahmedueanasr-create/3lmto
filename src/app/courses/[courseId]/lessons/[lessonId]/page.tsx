import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { LessonPlayer } from "@/components/courses/lesson-player"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const { courseId, lessonId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, module:modules!inner(course_id, title)")
    .eq("id", lessonId)
    .single()

  if (!lesson) notFound()

  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons:lessons(*)")
    .eq("course_id", courseId)
    .order("sort_order")

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <LessonPlayer lesson={lesson} modules={modules || undefined} userId={user?.id} />
    </div>
  )
}
