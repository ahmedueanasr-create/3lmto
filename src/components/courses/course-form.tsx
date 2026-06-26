"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import type { Category } from "@/types/database"

interface CourseFormProps {
  categories: Category[]
  initialData?: {
    title?: string | null
    description?: string | null
    short_description?: string | null
    price?: number | null
    is_free?: boolean | null
    level?: string | null
    category_id?: string | null
  }
  courseId?: string
}

export function CourseForm({ categories, initialData, courseId }: CourseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFree, setIsFree] = useState(initialData?.is_free || false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const { createCourse, updateCourse } = await import("@/lib/actions/courses")

    if (courseId) {
      const result = await updateCourse(courseId, formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push("/dashboard/teacher/courses")
        router.refresh()
      }
    } else {
      const result = await createCourse(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push("/dashboard/teacher/courses")
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان الدورة</Label>
        <Input id="title" name="title" defaultValue={initialData?.title || ""} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">وصف مختصر</Label>
        <Textarea id="short_description" name="short_description" defaultValue={initialData?.short_description || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف الكامل</Label>
        <Textarea id="description" name="description" className="min-h-[200px]" defaultValue={initialData?.description || ""} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">التصنيف</Label>
          <Select name="category_id" defaultValue={initialData?.category_id || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="اختر تصنيف" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name_ar}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">المستوى</Label>
          <Select name="level" defaultValue={initialData?.level || "beginner"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">مبتدئ</SelectItem>
              <SelectItem value="intermediate">متوسط</SelectItem>
              <SelectItem value="advanced">متقدم</SelectItem>
              <SelectItem value="all">جميع المستويات</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="is_free"
            name="is_free"
            value="true"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
          <Label htmlFor="is_free">دورة مجانية</Label>
        </div>
      </div>

      {!isFree && (
        <div className="space-y-2">
          <Label htmlFor="price">السعر (ج.م)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initialData?.price || 0}
            dir="ltr"
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          {courseId ? "تحديث الدورة" : "إنشاء الدورة"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </form>
  )
}
