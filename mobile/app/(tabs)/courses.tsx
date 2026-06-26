import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { supabase } from "@/src/lib/supabase"
import type { Course } from "@/src/types/database"

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadCourses()
  }, [])

  async function loadCourses() {
    let query = supabase
      .from("courses")
      .select("*, teacher:profiles(full_name, avatar_url), category:categories(name_ar)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (search) query = query.ilike("title", `%${search}%`)

    const { data } = await query
    setCourses(data || [])
    setLoading(false)
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="ابحث عن دورة..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={loadCourses}
        returnKeyType="search"
      />

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/courses/${item.slug}`)}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardTeacher}>{item.teacher?.full_name}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardPrice}>{item.is_free ? "مجاني" : `${item.price} ج.م`}</Text>
                <Text style={styles.cardLevel}>
                  {item.level === "beginner" ? "مبتدئ" : item.level === "intermediate" ? "متوسط" : "متقدم"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد دورات متاحة</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  search: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 16, textAlign: "right" },
  list: { paddingBottom: 20 },
  card: { backgroundColor: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 12 },
  cardContent: {},
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  cardTeacher: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  cardMeta: { flexDirection: "row", justifyContent: "space-between" },
  cardPrice: { fontSize: 16, fontWeight: "700", color: "#2563eb" },
  cardLevel: { fontSize: 14, color: "#64748b" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 60, fontSize: 16 },
})
