"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, signInWithProvider } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Apple, Facebook, Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
        <CardDescription>أهلاً بعودتك! سجل دخولك للمتابعة</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" required dir="ltr" className="text-left" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" name="password" type="password" required dir="ltr" className="text-left" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            تسجيل الدخول
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

        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={() => signInWithProvider("google")}>
            <Chrome className="ml-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="w-full" onClick={() => signInWithProvider("apple")}>
            <Apple className="ml-2 h-4 w-4" />
            Apple
          </Button>
          <Button variant="outline" className="w-full" onClick={() => signInWithProvider("facebook")}>
            <Facebook className="ml-2 h-4 w-4" />
            Facebook
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ليس لديك حساب؟{" "}
          <a href="/register" className="text-primary hover:underline">
            إنشاء حساب
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
