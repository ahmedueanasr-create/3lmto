import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, Users, Star, Plus, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function TeacherDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "teacher" && profile?.role !== "admin") redirect("/dashboard/student")

  const { data: courses } = await supabase
    .from("courses")
    .select("*, enrollments:enrollments(count)")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false })

  const totalStudents = courses?.reduce((acc, c) => acc + (c.enrollments?.[0]?.count || 0), 0) || 0
  const totalRevenue = courses?.reduce((acc, c) => acc + c.price * (c.enrollments?.[0]?.count || 0), 0) || 0

  const stats = [
    { title: "الدورات", value: courses?.length || 0, icon: BookOpen },
    { title: "الطلاب", value: totalStudents, icon: Users },
    { title: "الإيرادات", value: `${totalRevenue} ج.م`, icon: DollarSign },
    { title: "التقييم", value: courses?.reduce((acc, c) => acc + (c.avg_rating || 0), 0) / (courses?.length || 1) || 0, icon: Star },
  ]

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">لوحة المعلم</h1>
        <Link href="/dashboard/teacher/courses/new">
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            دورة جديدة
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{typeof stat.value === "number" ? stat.value.toFixed(1) : stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">دوراتي</h2>
      <div className="space-y-4">
        {courses?.map((course) => (
          <Link key={course.id} href={`/dashboard/teacher/courses/${course.id}/edit`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.enrollments?.[0]?.count || 0} طالب
                    {course.is_published ? " • منشور" : " • مسودة"}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {course.is_free ? "مجاني" : `${course.price} ج.م`}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {(!courses || courses.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <p>لا توجد دورات بعد</p>
            <Link href="/dashboard/teacher/courses/new">
              <Button variant="outline" className="mt-4">إنشاء أول دورة</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
