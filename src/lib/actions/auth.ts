"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function signUp(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${headers().get("origin")}/auth/callback`,
    },
  })

  if (error) return { error: error.message }
  return { success: true, message: "تم إرسال رابط التأكيد إلى بريدك الإلكتروني" }
}

export async function signIn(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }
  redirect("/")
}

export async function signInWithProvider(provider: "google" | "apple" | "facebook") {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${headers().get("origin")}/api/auth/callback`,
    },
  })
  if (data.url) redirect(data.url)
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function resetPassword(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const email = formData.get("email") as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${headers().get("origin")}/auth/callback?next=update-password`,
  })

  if (error) return { error: error.message }
  return { success: true, message: "تم إرسال رابط إعادة تعيين كلمة المرور" }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "غير مصرح" }

  const updates: Record<string, string> = {}
  const fields = ["full_name", "phone", "bio", "headline"]
  for (const field of fields) {
    const value = formData.get(field) as string
    if (value) updates[field] = value
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)

  if (error) return { error: error.message }
  return { success: true }
}
