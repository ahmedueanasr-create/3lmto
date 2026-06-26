"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"

export async function getCourses(params?: {
  category?: string
  level?: string
  search?: string
  page?: number
  limit?: number
}) {
  const supabase = await createServerSupabaseClient()
  const { category, level, search, page = 1, limit = 12 } = params || {}

  let query = supabase
    .from("courses")
    .select("*, teacher:profiles(*), category:categories(*)", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (category) query = query.eq("category_id", category)
  if (level) query = query.eq("level", level)
  if (search) query = query.ilike("title", `%${search}%`)

  const { data: courses, count, error } = await query
  if (error) throw new Error(error.message)

  return { courses, total: count || 0, page, limit }
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()

  const { data: course } = await supabase
    .from("courses")
    .select("*, teacher:profiles(*), category:categories(*), modules:modules(*, lessons:lessons(*))")
    .eq("slug", slug)
    .single()

  return course
}

export async function createCourse(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "غير مصرح" }

  const title = formData.get("title") as string
  const slug = slugify(title)

  const { error } = await supabase.from("courses").insert({
    teacher_id: user.id,
    title,
    slug,
    description: formData.get("description") as string,
    short_description: formData.get("short_description") as string,
    category_id: formData.get("category_id") as string,
    price: parseFloat(formData.get("price") as string) || 0,
    is_free: formData.get("is_free") === "true",
    level: formData.get("level") as string,
    requirements: JSON.parse((formData.get("requirements") as string) || "[]"),
    outcomes: JSON.parse((formData.get("outcomes") as string) || "[]"),
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
  })

  if (error) return { error: error.message }
  revalidatePath("/dashboard/teacher/courses")
  return { success: true, slug }
}

export async function updateCourse(courseId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "غير مصرح" }

  const updates: Record<string, unknown> = {}
  const fields = ["title", "description", "short_description", "category_id", "price", "level", "requirements", "outcomes", "tags", "is_published", "is_free", "thumbnail_url"]

  for (const field of fields) {
    const value = formData.get(field)
    if (value !== null) {
      if (["requirements", "outcomes", "tags"].includes(field)) {
        updates[field] = JSON.parse(value as string)
      } else if (["is_published", "is_free"].includes(field)) {
        updates[field] = value === "true"
      } else if (["price"].includes(field)) {
        updates[field] = parseFloat(value as string) || 0
      } else {
        updates[field] = value as string
      }
    }
  }

  const { error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", courseId)
    .eq("teacher_id", user.id)

  if (error) return { error: error.message }
  revalidatePath(`/dashboard/teacher/courses/${courseId}`)
  return { success: true }
}

export async function enrollInCourse(courseId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "غير مصرح" }

  const { error } = await supabase.from("enrollments").insert({
    user_id: user.id,
    course_id: courseId,
  })

  if (error) return { error: error.message }
  revalidatePath(`/courses/${courseId}`)
  return { success: true }
}

export async function updateLessonProgress(lessonId: string, watchSeconds: number) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("lesson_progress").upsert({
    user_id: user.id,
    lesson_id: lessonId,
    watch_time_seconds: watchSeconds,
    is_completed: true,
    completed_at: new Date().toISOString(),
  })
}

export async function submitQuiz(quizId: string, answers: number[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "غير مصرح" }

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, correct_option")
    .eq("quiz_id", quizId)

  if (!questions) return { error: "الاختبار غير موجود" }

  let score = 0
  const total = questions.length
  questions.forEach((q, i) => {
    if (answers[i] === q.correct_option) score++
  })

  const percentage = Math.round((score / total) * 100)
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("passing_score")
    .eq("id", quizId)
    .single()

  const isPassed = percentage >= (quiz?.passing_score || 70)

  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    quiz_id: quizId,
    score: percentage,
    total_questions: total,
    answers,
    is_passed: isPassed,
  })

  return { score: percentage, total, passed: isPassed }
}
