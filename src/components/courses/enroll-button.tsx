"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface EnrollButtonProps {
  courseId: string
  isFree: boolean
}

export function EnrollButton({ courseId, isFree }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleEnroll() {
    setLoading(true)
    if (isFree) {
      const { enrollInCourse } = await import("@/lib/actions/courses")
      const result = await enrollInCourse(courseId)
      if (result?.error) {
        alert(result.error)
      } else {
        router.refresh()
      }
    } else {
      const { createCheckout } = await import("@/lib/actions/payments")
      const result = await createCheckout(courseId)
      if (result?.iframeUrl) {
        window.location.href = result.iframeUrl
      } else {
        alert(result?.error || "فشل في إنشاء الدفع")
      }
    }
    setLoading(false)
  }

  return (
    <Button className="w-full" size="lg" onClick={handleEnroll} disabled={loading}>
      {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      {isFree ? "التحق مجاناً" : "اشتر الآن"}
    </Button>
  )
}
