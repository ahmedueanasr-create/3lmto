import { redirect } from "next/navigation"
import Link from "next/link"
import { Mail, Shield, UserCheck, UserX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/")

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-500",
      teacher: "bg-blue-500",
      student: "bg-green-500",
    }
    return <Badge className={colors[role] || "bg-gray-500"}>{role === "admin" ? "مدير" : role === "teacher" ? "معلم" : "طالب"}</Badge>
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
        <Link href="/admin"><Button variant="outline">العودة</Button></Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع المستخدمين ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right">
                  <th className="pb-3 font-medium">الاسم</th>
                  <th className="pb-3 font-medium">البريد</th>
                  <th className="pb-3 font-medium">الدور</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-3">{u.full_name}</td>
                    <td className="py-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3">{roleBadge(u.role)}</td>
                    <td className="py-3">
                      {u.is_active ? (
                        <span className="flex items-center gap-1 text-green-600"><UserCheck className="h-4 w-4" />نشط</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600"><UserX className="h-4 w-4" />محظور</span>
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
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
