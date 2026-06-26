import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { supabase } from "@/src/lib/supabase"
import type { Lesson } from "@/src/types/database"
import { WebView } from "react-native-webview"

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const { width } = useWindowDimensions()

  useEffect(() => {
    loadLesson()
  }, [lessonId])

  async function loadLesson() {
    const { data } = await supabase
      .from("lessons")
      .select("*, module:modules!inner(course_id, title)")
      .eq("id", lessonId)
      .single()
    setLesson(data)
    setLoading(false)
  }

  async function handleComplete() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setCompleted(true)
    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId as string,
      is_completed: true,
      completed_at: new Date().toISOString(),
      watch_time_seconds: lesson?.video_duration || 300,
    })
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>
  if (!lesson) return <View style={styles.center}><Text>الدرس غير موجود</Text></View>

  const embedUrl = lesson.video_url
    ? `https://iframe.mediadelivery.net/embed/${lesson.video_url.split("/").pop()}`
    : null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {lesson.content_type === "video" && embedUrl ? (
        <View style={[styles.videoContainer, { height: width * 0.5625 }]}>
          <WebView
            source={{ uri: embedUrl }}
            style={styles.video}
            allowsFullscreenVideo
            javaScriptEnabled
          />
        </View>
      ) : lesson.content_type === "article" ? (
        <View style={styles.article}>
          <Text>{lesson.article_body || "لا يوجد محتوى"}</Text>
        </View>
      ) : null}

      <Text style={styles.title}>{lesson.title}</Text>
      {lesson.description && <Text style={styles.desc}>{lesson.description}</Text>}

      <TouchableOpacity
        style={[styles.completeButton, completed && styles.completedButton]}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>
          {completed ? "✓ تم الإكمال" : "تحديد كمكتمل"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  videoContainer: { width: "100%", backgroundColor: "#000" },
  video: { flex: 1 },
  article: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", padding: 16, paddingBottom: 8 },
  desc: { fontSize: 16, color: "#475569", paddingHorizontal: 16, lineHeight: 24 },
  completeButton: { backgroundColor: "#2563eb", marginHorizontal: 16, marginTop: 24, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  completedButton: { backgroundColor: "#16a34a" },
  completeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
})
