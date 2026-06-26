import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = await createServerSupabaseClient()

  const category = searchParams.get("category")
  const level = searchParams.get("level")
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")

  let query = supabase
    .from("courses")
    .select("*, teacher:profiles(*), category:categories(*)", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (category) query = query.eq("category_id", category)
  if (level) query = query.eq("level", level)
  if (search) query = query.ilike("title", `%${search}%`)

  const { data: courses, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ courses, total: count || 0, page, limit })
}
