import { redirect } from "next/navigation"
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function StudentDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, course:courses(*)")
    .eq("user_id", user.id)

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)

  const stats = [
    { title: "الدورات المسجلة", value: enrollments?.length || 0, icon: BookOpen },
    { title: "الدورات المكتملة", value: enrollments?.filter((e) => e.is_completed).length || 0, icon: Award },
    { title: "الشهادات", value: certificates?.length || 0, icon: TrendingUp },
    { title: "الدروس المكتملة", value: progress?.filter((p) => p.is_completed).length || 0, icon: Clock },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">لوحة الطالب</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">دوراتي</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enrollments?.map((enrollment) => (
          <a
            key={enrollment.id}
            href={`/courses/${enrollment.course?.slug}`}
            className="block"
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{enrollment.course?.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{Math.round(enrollment.progress)}%</span>
                  {enrollment.is_completed && <span className="text-green-500">مكتمل ✓</span>}
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
}
