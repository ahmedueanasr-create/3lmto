import { notFound } from "next/navigation"
import { Star, Users, Clock, CheckCircle, PlayCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { EnrollButton } from "@/components/courses/enroll-button"
import { ReviewSection } from "@/components/courses/review-section"

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: course } = await supabase
    .from("courses")
    .select("*, teacher:profiles(*), category:categories(*), modules:modules(*, lessons:lessons(*))")
    .eq("slug", courseId)
    .single()

  if (!course) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  let enrollment = null
  if (user) {
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .single()
    enrollment = data
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, user:profiles(full_name, avatar_url)")
    .eq("course_id", course.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex gap-2 mb-4">
                {course.is_free && <Badge className="bg-green-500">مجاني</Badge>}
                <Badge variant="outline">
                  {course.level === "beginner" ? "مبتدئ" : course.level === "intermediate" ? "متوسط" : "متقدم"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.short_description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {course.avg_rating || "جديد"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.total_students} طالب
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration_hours} ساعة
                </span>
                <span>{course.modules?.reduce((acc: number, m: { lessons?: { length: number }[] }) => acc + (m.lessons?.length || 0), 0) || 0} درس</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                {course.teacher?.avatar_url && (
                  <img src={course.teacher.avatar_url} alt="" className="h-10 w-10 rounded-full" />
                )}
                <div>
                  <p className="font-medium">{course.teacher?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{course.teacher?.headline}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt={course.title} className="rounded-xl w-full aspect-video object-cover shadow-lg" />
              ) : (
                <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">عن الدورة</h2>
              <p className="text-muted-foreground whitespace-pre-line">{course.description}</p>
            </section>

            {/* Outcomes */}
            {course.outcomes?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">ماذا ستتعلم</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">المتطلبات</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {course.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Curriculum */}
            <section>
              <h2 className="text-2xl font-bold mb-4">محتويات الدورة</h2>
              <div className="space-y-4">
                {course.modules?.map((module, mi) => (
                  <Card key={module.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {mi + 1}. {module.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {module.lessons?.length || 0} درس
                        </span>
                      </div>
                      <div className="space-y-1">
                        {module.lessons?.map((lesson, li) => (
                          <div key={lesson.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-sm">
                            <div className="flex items-center gap-2">
                              {lesson.content_type === "video" ? (
                                <PlayCircle className="h-4 w-4 text-primary" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                              <span>{mi + 1}.{li + 1} {lesson.title}</span>
                            </div>
                            <span className="text-muted-foreground">
                              {lesson.video_duration > 0 ? `${Math.floor(lesson.video_duration / 60)}:${(lesson.video_duration % 60).toString().padStart(2, "0")}` : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <ReviewSection courseId={course.id} reviews={reviews || []} userId={user?.id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold mb-2">
                    {course.is_free ? "مجاني" : formatPrice(course.price)}
                  </p>
                  {enrollment ? (
                    <div className="space-y-2">
                      <Progress value={enrollment.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">{Math.round(enrollment.progress)}% مكتمل</p>
                    </div>
                  ) : (
                    <EnrollButton courseId={course.id} isFree={course.is_free} />
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المستوى</span>
                    <span>{course.level === "beginner" ? "مبتدئ" : course.level === "intermediate" ? "متوسط" : "متقدم"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد الدروس</span>
                    <span>{course.total_lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المدة</span>
                    <span>{course.duration_hours} ساعة</span>
                  </div>
                  {course.category && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">التصنيف</span>
                      <span>{course.category.name_ar}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
