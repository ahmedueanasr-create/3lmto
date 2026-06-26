import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CourseForm } from "@/components/courses/course-form"

export default async function NewCoursePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "teacher" && profile?.role !== "admin") redirect("/dashboard/student")

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">إنشاء دورة جديدة</h1>
      <CourseForm categories={categories || []} />
    </div>
  )
}
