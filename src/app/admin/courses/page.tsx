import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, Users, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatPrice, formatDate } from "@/lib/utils"

export default async function AdminCoursesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/")

  const { data: courses } = await supabase
    .from("courses")
    .select("*, teacher:profiles(full_name), category:categories(name_ar)")
    .order("created_at", { ascending: false })

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">إدارة الدورات</h1>
        <Link href="/admin"><Button variant="outline">العودة</Button></Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع الدورات ({courses?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right">
                  <th className="pb-3 font-medium">العنوان</th>
                  <th className="pb-3 font-medium">المعلم</th>
                  <th className="pb-3 font-medium">التصنيف</th>
                  <th className="pb-3 font-medium">السعر</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">الطلاب</th>
                  <th className="pb-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{c.title}</td>
                    <td className="py-3 text-muted-foreground">{c.teacher?.full_name}</td>
                    <td className="py-3">{c.category?.name_ar}</td>
                    <td className="py-3">{c.is_free ? "مجاني" : formatPrice(c.price)}</td>
                    <td className="py-3">
                      {c.is_published ? (
                        <span className="flex items-center gap-1 text-green-600"><Eye className="h-4 w-4" />منشور</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600"><EyeOff className="h-4 w-4" />مسودة</span>
                      )}
                    </td>
                    <td className="py-3">{c.total_students}</td>
                    <td className="py-3 text-muted-foreground">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
