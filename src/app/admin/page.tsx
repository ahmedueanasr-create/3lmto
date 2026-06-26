import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/")

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const { count: totalCourses } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true })

  const { count: totalEnrollments } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })

  const { count: totalPayments } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  const stats = [
    { title: "المستخدمين", value: totalUsers || 0, icon: Users, href: "/admin/users" },
    { title: "الدورات", value: totalCourses || 0, icon: BookOpen, href: "/admin/courses" },
    { title: "المسجلين", value: totalEnrollments || 0, icon: TrendingUp, href: "#" },
    { title: "المدفوعات", value: totalPayments || 0, icon: DollarSign, href: "/admin/payments" },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">لوحة الإدارة</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
