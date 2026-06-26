import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { supabase } from "@/src/lib/supabase"
import type { Course } from "@/src/types/database"

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [id])

  async function loadCourse() {
    const { data } = await supabase
      .from("courses")
      .select("*, teacher:profiles(full_name, avatar_url), category:categories(name_ar), modules:modules(*, lessons:lessons(*))")
      .eq("slug", id)
      .single()
    setCourse(data)
    const { data: { user } } = await supabase.auth.getUser()
    if (user && data) {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", data.id)
        .single()
      setEnrolled(!!enrollment)
    }
    setLoading(false)
  }

  async function handleEnroll() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/(auth)/login"); return }
    if (!course) return

    if (course.is_free) {
      const { error } = await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: course.id,
      })
      if (error) Alert.alert("خطأ", error.message)
      else {
        setEnrolled(true)
        Alert.alert("تم", "تم التسجيل في الدورة بنجاح")
      }
    }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>
  if (!course) return <View style={styles.center}><Text>الدورة غير موجودة</Text></View>

  const firstLesson = course.modules?.[0]?.lessons?.[0]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.teacher}>بواسطة {course.teacher?.full_name}</Text>
      {course.short_description && <Text style={styles.desc}>{course.short_description}</Text>}

      <View style={styles.meta}>
        <Text style={styles.metaItem}>{course.level === "beginner" ? "مبتدئ" : course.level === "intermediate" ? "متوسط" : "متقدم"}</Text>
        <Text style={styles.metaItem}>{course.duration_hours} ساعة</Text>
        <Text style={styles.metaItem}>{course.total_students} طالب</Text>
      </View>

      <Text style={styles.price}>{course.is_free ? "مجاني" : `${course.price} ج.م`}</Text>

      {course.description && (
        <>
          <Text style={styles.sectionTitle}>عن الدورة</Text>
          <Text style={styles.description}>{course.description}</Text>
        </>
      )}

      {course.modules && course.modules.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>محتويات الدورة</Text>
          {course.modules.map((mod) => (
            <View key={mod.id} style={styles.module}>
              <Text style={styles.moduleTitle}>{mod.title}</Text>
              {mod.lessons?.map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.lesson}
                  onPress={() => {
                    if (enrolled || course.is_free) {
                      router.push(`/courses/${course.slug}/lessons/${lesson.id}`)
                    } else {
                      Alert.alert("تنبيه", "يجب التسجيل في الدورة أولاً")
                    }
                  }}
                >
                  <Text style={styles.lessonIcon}>{lesson.content_type === "video" ? "▶" : "📄"}</Text>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </>
      )}

      {enrolled && firstLesson ? (
        <TouchableOpacity
          style={styles.enrollButton}
          onPress={() => router.push(`/courses/${course.slug}/lessons/${firstLesson.id}`)}
        >
          <Text style={styles.enrollButtonText}>متابعة التعلم</Text>
        </TouchableOpacity>
      ) : !enrolled ? (
        <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
          <Text style={styles.enrollButtonText}>
            {course.is_free ? "سجل مجاناً" : `اشترك الآن - ${course.price} ج.م`}
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  teacher: { fontSize: 16, color: "#64748b", marginBottom: 12 },
  desc: { fontSize: 16, color: "#475569", lineHeight: 24, marginBottom: 16 },
  meta: { flexDirection: "row", gap: 12, marginBottom: 16 },
  metaItem: { backgroundColor: "#f1f5f9", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontSize: 14, color: "#475569" },
  price: { fontSize: 24, fontWeight: "700", color: "#2563eb", marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: "600", marginTop: 24, marginBottom: 12 },
  description: { fontSize: 16, color: "#475569", lineHeight: 24 },
  module: { marginBottom: 16 },
  moduleTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#0f172a" },
  lesson: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: "#f8fafc", borderRadius: 8, marginBottom: 6 },
  lessonIcon: { fontSize: 16, marginRight: 8 },
  lessonTitle: { fontSize: 15, color: "#334155", flex: 1 },
  enrollButton: { backgroundColor: "#2563eb", paddingVertical: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  enrollButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
})
