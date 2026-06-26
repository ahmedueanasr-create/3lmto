"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createPaymobOrder } from "@/lib/paymob"

export async function createCheckout(courseId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "غير مصرح" }

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, price")
    .eq("id", courseId)
    .single()

  if (!course) return { error: "الدورة غير موجودة" }

  const merchantOrderId = `${user.id}_${course.id}_${Date.now()}`
  const amountCents = Math.round(course.price * 100)

  try {
    const { paymentKey } = await createPaymobOrder(amountCents, merchantOrderId)

    await supabase.from("payments").insert({
      user_id: user.id,
      course_id: course.id,
      amount: course.price,
      payment_method: "paymob",
      status: "pending",
      paymob_order_id: merchantOrderId,
    })

    return { paymentKey, iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "فشل في إنشاء الدفع" }
  }
}

export async function createSubscriptionCheckout(planType: "monthly" | "yearly") {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "غير مصرح" }

  const prices = { monthly: 19900, yearly: 199900 }
  const amountCents = prices[planType]
  const merchantOrderId = `sub_${user.id}_${Date.now()}`

  try {
    const { paymentKey } = await createPaymobOrder(amountCents, merchantOrderId)

    const expiresAt = planType === "monthly"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

    const { data: subscription } = await supabase
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
      subscription_id: subscription?.id,
      amount: amountCents / 100,
      payment_method: "paymob",
      status: "pending",
      paymob_order_id: merchantOrderId,
    })

    return { paymentKey, iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "فشل في إنشاء الاشتراك" }
  }
}
