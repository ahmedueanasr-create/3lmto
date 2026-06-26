import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { obj } = body

    if (!obj || obj.success !== true) {
      return NextResponse.json({ received: true })
    }

    const supabase = createAdminClient()
    const orderId = obj.order?.merchant_order_id || ""
    const transactionId = obj.id?.toString()
    const amountCents = obj.amount_cents
    const amount = parseInt(amountCents) / 100

    const { data: payment } = await supabase
      .from("payments")
      .update({
        status: "completed",
        paymob_transaction_id: transactionId,
        updated_at: new Date().toISOString(),
      })
      .eq("paymob_order_id", orderId)
      .eq("status", "pending")
      .select()
      .single()

    if (payment) {
      if (payment.course_id) {
        await supabase.from("enrollments").upsert({
          user_id: payment.user_id,
          course_id: payment.course_id,
        })
      }

      if (payment.subscription_id) {
        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("id", payment.subscription_id)
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
