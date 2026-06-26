"use client"

import { useState } from "react"
import { signUp, signInWithProvider } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Loader2 } from "lucide-react"

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة")
      setLoading(false)
      return
    }

    const result = await signUp(formData)
    if (result?.error) setError(result.error)
    if (result?.success) setSuccess(result.message || "تم إنشاء الحساب بنجاح")
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
        <CardDescription>انضم إلى آلاف المتعلمين</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">الاسم الكامل</Label>
            <Input id="full_name" name="full_name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" required dir="ltr" className="text-left" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" name="password" type="password" required dir="ltr" className="text-left" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">تأكيد كلمة المرور</Label>
            <Input id="confirm_password" name="confirm_password" type="password" required dir="ltr" className="text-left" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            إنشاء حساب
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">أو</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => signInWithProvider("google")}>
          <Chrome className="ml-2 h-4 w-4" />
          إنشاء حساب بـ Google
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          لديك حساب بالفعل؟{" "}
          <a href="/login" className="text-primary hover:underline">
            تسجيل الدخول
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
