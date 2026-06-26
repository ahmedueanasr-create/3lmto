import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: course } = await supabase
    .from("courses")
    .select("*, teacher:profiles(*), category:categories(*), modules:modules(*, lessons:lessons(*))")
    .eq("id", courseId)
    .single()

  if (!course) return NextResponse.json({ error: "غير موجود" }, { status: 404 })
  return NextResponse.json(course)
}
