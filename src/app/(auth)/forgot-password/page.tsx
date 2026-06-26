"use client"

import { useState } from "react"
import { resetPassword } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)
    if (result?.error) setError(result.error)
    if (result?.success) setSuccess(result.message || "تم إرسال رابط إعادة التعيين")
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">نسيت كلمة المرور</CardTitle>
          <CardDescription>أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" required dir="ltr" className="text-left" />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              إرسال رابط إعادة التعيين
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
