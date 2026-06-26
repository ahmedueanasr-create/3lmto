import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createPaymobOrder } from "@/lib/paymob"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

    const { courseId, planType } = await request.json()

    let amountCents: number
    let merchantOrderId: string

    if (courseId) {
      const { data: course } = await supabase
        .from("courses")
        .select("price")
        .eq("id", courseId)
        .single()
      if (!course) return NextResponse.json({ error: "الدورة غير موجودة" }, { status: 404 })

      amountCents = Math.round(course.price * 100)
      merchantOrderId = `${user.id}_${courseId}_${Date.now()}`

      await supabase.from("payments").insert({
        user_id: user.id,
        course_id: courseId,
        amount: course.price,
        payment_method: "paymob",
        status: "pending",
        paymob_order_id: merchantOrderId,
      })
    } else if (planType) {
      const prices: Record<string, number> = { monthly: 19900, yearly: 199900 }
      amountCents = prices[planType]
      merchantOrderId = `sub_${user.id}_${Date.now()}`

      const expiresAt = planType === "monthly"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

      const { data: sub } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_type: planType,
          status: "pending",
          expires_at: expiresAt,
          paymob_order_id: merchantOrderId,
        })
        .select()
        .single()

      await supabase.from("payments").insert({
        user_id: user.id,
        subscription_id: sub?.id,
        amount: amountCents / 100,
        payment_method: "paymob",
        status: "pending",
        paymob_order_id: merchantOrderId,
      })
    } else {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 })
    }

    const { paymentKey } = await createPaymobOrder(amountCents, merchantOrderId)
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`

    return NextResponse.json({ paymentKey, iframeUrl })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "فشل في إنشاء الدفع" },
      { status: 500 }
    )
  }
}
