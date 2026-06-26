import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = (formData.get("bucket") as string) || "course-assets"

    if (!file) return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl, path: data?.path })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "فشل الرفع" },
      { status: 500 }
    )
  }
}
