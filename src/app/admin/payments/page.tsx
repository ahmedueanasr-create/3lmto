import { redirect } from "next/navigation"
import Link from "next/link"
import { DollarSign, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatPrice, formatDate } from "@/lib/utils"

export default async function AdminPaymentsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/")

  const { data: payments } = await supabase
    .from("payments")
    .select("*, user:profiles(full_name, email), course:courses(title)")
    .order("created_at", { ascending: false })

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-500",
      pending: "bg-amber-500",
      failed: "bg-red-500",
      refunded: "bg-purple-500",
    }
    const labels: Record<string, string> = {
      completed: "مكتمل",
      pending: "قيد الانتظار",
      failed: "فشل",
      refunded: "مسترجع",
    }
    return <Badge className={colors[status] || "bg-gray-500"}>{labels[status] || status}</Badge>
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">إدارة المدفوعات</h1>
        <Link href="/admin"><Button variant="outline">العودة</Button></Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatPrice(payments?.filter((p) => p.status === "completed").reduce((a, p) => a + p.amount, 0) || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">معاملات ناجحة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{payments?.filter((p) => p.status === "completed").length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{payments?.filter((p) => p.status === "pending").length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">فاشلة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{payments?.filter((p) => p.status === "failed").length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع المعاملات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right">
                  <th className="pb-3 font-medium">المستخدم</th>
                  <th className="pb-3 font-medium">الدورة</th>
                  <th className="pb-3 font-medium">المبلغ</th>
                  <th className="pb-3 font-medium">طريقة الدفع</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-3">{p.user?.full_name || p.user?.email}</td>
                    <td className="py-3 text-muted-foreground">{p.course?.title || "اشتراك"}</td>
                    <td className="py-3 font-medium">{formatPrice(p.amount)}</td>
                    <td className="py-3">{p.payment_method === "paymob" ? "Paymob" : p.payment_method}</td>
                    <td className="py-3">{statusBadge(p.status)}</td>
                    <td className="py-3 text-muted-foreground">{formatDate(p.created_at)}</td>
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
