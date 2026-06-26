"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, Video, FileText, GripVertical } from "lucide-react"
import { CourseForm } from "@/components/courses/course-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Course, Module, Lesson, Category } from "@/types/database"

export default function CourseEditPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const router = useRouter()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [addingModule, setAddingModule] = useState(false)
  const [moduleLessonInputs, setModuleLessonInputs] = useState<Record<string, { title: string; contentType: string }>>({})

  useEffect(() => {
    params.then(({ courseId }) => {
      setCourseId(courseId)
      loadData(courseId)
    })
  }, [params])

  async function loadData(id: string) {
    const { getCourseById } = await import("@/lib/actions/courses")
    const supabase = (await import("@/lib/supabase/client")).createClient()
    const { data: cats } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order")
    setCategories(cats || [])
    const result = await getCourseById(id)
    if (result) setCourse(result)
    setLoading(false)
  }

  async function handleAddModule() {
    if (!newModuleTitle.trim() || !courseId) return
    setAddingModule(true)
    const { addModule } = await import("@/lib/actions/courses")
    const form = new FormData()
    form.set("courseId", courseId)
    form.set("title", newModuleTitle)
    form.set("sortOrder", String(course?.modules?.length || 0))
    await addModule(form)
    setNewModuleTitle("")
    loadData(courseId)
    setAddingModule(false)
  }

  async function handleDeleteModule(moduleId: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الموديول؟")) return
    const { deleteModule } = await import("@/lib/actions/courses")
    await deleteModule(moduleId)
    if (courseId) loadData(courseId)
  }

  async function handleAddLesson(moduleId: string) {
    const input = moduleLessonInputs[moduleId]
    if (!input?.title.trim() || !courseId) return
    const { addLesson } = await import("@/lib/actions/courses")
    const form = new FormData()
    form.set("moduleId", moduleId)
    form.set("title", input.title)
    form.set("contentType", input.contentType || "video")
    const module = course?.modules?.find((m) => m.id === moduleId)
    form.set("sortOrder", String(module?.lessons?.length || 0))
    await addLesson(form)
    setModuleLessonInputs((prev) => ({ ...prev, [moduleId]: { title: "", contentType: "video" } }))
    if (courseId) loadData(courseId)
  }

  function toggleModule(id: string) {
    setExpandedModule((prev) => (prev === id ? null : id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-8 text-center">
        <p className="text-xl text-muted-foreground">الدورة غير موجودة</p>
        <Button onClick={() => router.push("/dashboard/teacher/courses")} className="mt-4">العودة</Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">تعديل الدورة</h1>
          <p className="text-muted-foreground">{course.title}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/teacher/courses")}>العودة</Button>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الدورة</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm categories={categories} initialData={course} courseId={course.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>المحتوى (الموديولات والدروس)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.modules?.map((mod) => (
                <Card key={mod.id} className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <button onClick={() => toggleModule(mod.id)} className="flex items-center gap-2 flex-1 text-right">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mod.title}</span>
                        <span className="text-sm text-muted-foreground">({mod.lessons?.length || 0} دروس)</span>
                        {expandedModule === mod.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteModule(mod.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {expandedModule === mod.id && (
                      <div className="mt-4 mr-6 space-y-2">
                        {mod.lessons?.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              {lesson.content_type === "video" ? (
                                <Video className="h-4 w-4 text-primary" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={async () => {
                              if (!confirm("حذف هذا الدرس؟")) return
                              const { deleteLesson } = await import("@/lib/actions/courses")
                              await deleteLesson(lesson.id)
                              if (courseId) loadData(courseId)
                            }}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}

                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            placeholder="عنوان الدرس الجديد"
                            value={moduleLessonInputs[mod.id]?.title || ""}
                            onChange={(e) =>
                              setModuleLessonInputs((prev) => ({
                                ...prev,
                                [mod.id]: { ...prev[mod.id], title: e.target.value, contentType: prev[mod.id]?.contentType || "video" },
                              }))
                            }
                            className="flex-1"
                          />
                          <Select
                            value={moduleLessonInputs[mod.id]?.contentType || "video"}
                            onValueChange={(v) =>
                              setModuleLessonInputs((prev) => ({
                                ...prev,
                                [mod.id]: { ...prev[mod.id], contentType: v, title: prev[mod.id]?.title || "" },
                              }))
                            }
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">فيديو</SelectItem>
                              <SelectItem value="article">مقال</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={() => handleAddLesson(mod.id)}>
                            <Plus className="h-4 w-4 ml-1" />إضافة
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  placeholder="عنوان الموديول الجديد"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddModule} disabled={addingModule}>
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة موديول
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
