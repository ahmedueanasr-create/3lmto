import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { supabase } from "@/src/lib/supabase"
import type { Enrollment } from "@/src/types/database"

export default function DashboardScreen() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()
    setUserName(profile?.full_name || "")
    const { data: enrolls } = await supabase
      .from("enrollments")
      .select("*, course:courses(*)")
      .eq("user_id", user.id)
    setEnrollments(enrolls || [])
    setLoading(false)
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>

  const stats = [
    { label: "دوراتي", value: enrollments.length, color: "#2563eb" },
    { label: "مكتملة", value: enrollments.filter((e) => e.is_completed).length, color: "#16a34a" },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>مرحباً {userName}</Text>

      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.statCard, { borderTopColor: s.color }]}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>دوراتي</Text>
      <FlatList
        data={enrollments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => router.push(`/courses/${item.course?.slug || item.course_id}`)}
          >
            <Text style={styles.courseTitle}>{item.course?.title}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.round(item.progress)}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(item.progress)}% مكتمل</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>لم تسجل في أي دورة بعد</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 24, fontWeight: "700", marginBottom: 20, marginTop: 8 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: "#f8fafc", borderRadius: 12, padding: 16, borderTopWidth: 3 },
  statValue: { fontSize: 28, fontWeight: "700" },
  statLabel: { fontSize: 14, color: "#64748b", marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  courseCard: { backgroundColor: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 12 },
  courseTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: "#e2e8f0", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#2563eb", borderRadius: 4 },
  progressText: { fontSize: 12, color: "#64748b", marginTop: 4, textAlign: "left" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40, fontSize: 16 },
})
