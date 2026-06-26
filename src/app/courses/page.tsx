import { createServerSupabaseClient } from "@/lib/supabase/server"
import { CourseCard } from "@/components/courses/course-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; level?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const supabase = await createServerSupabaseClient()
  const page = parseInt(params.page || "1")
  const limit = 12

  let query = supabase
    .from("courses")
    .select("*, teacher:profiles(full_name, avatar_url), category:categories(name_ar)", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (params.category) query = query.eq("category_id", params.category)
  if (params.level) query = query.eq("level", params.level)
  if (params.search) query = query.ilike("title", `%${params.search}%`)

  const { data: courses, count } = await query
  const totalPages = Math.ceil((count || 0) / limit)

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">جميع الدورات</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form className="flex-1 flex gap-2">
          <Input
            name="search"
            placeholder="ابحث عن دورة..."
            defaultValue={params.search}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4 ml-2" />
            بحث
          </Button>
        </form>
        <div className="flex gap-2 flex-wrap">
          {categories?.map((cat) => (
            <a
              key={cat.id}
              href={`/courses?category=${cat.id}`}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border transition-colors ${
                params.category === cat.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {cat.name_ar}
            </a>
          ))}
        </div>
      </div>

      {/* Results */}
      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">لا توجد دورات متاحة</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/courses?page=${p}${params.category ? `&category=${params.category}` : ""}${params.level ? `&level=${params.level}` : ""}`}
              className={`px-4 py-2 rounded-md border text-sm ${
                p === page ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
