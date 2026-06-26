"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SubscriptionButtonProps {
  planId: string
  className?: string
}

export function SubscriptionButton({ planId, className }: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubscribe() {
    if (planId === "free") {
      router.push("/register")
      return
    }

    setLoading(true)
    const { createSubscriptionCheckout } = await import("@/lib/actions/payments")
    const result = await createSubscriptionCheckout(planId as "monthly" | "yearly")

    if (result?.iframeUrl) {
      window.location.href = result.iframeUrl
    } else {
      alert(result?.error || "فشل في إنشاء الاشتراك")
    }
    setLoading(false)
  }

  return (
    <Button
      className={className}
      variant={planId === "free" ? "outline" : "default"}
      size="lg"
      onClick={handleSubscribe}
      disabled={loading}
    >
      {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      {planId === "free" ? "ابدأ مجاناً" : planId === "monthly" ? "اشترك شهرياً" : "اشترك سنوياً"}
    </Button>
  )
}
