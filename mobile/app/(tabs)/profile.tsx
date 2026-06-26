import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { router } from "expo-router"
import { supabase } from "@/src/lib/supabase"
import type { Profile } from "@/src/types/database"

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    setProfile(data)
  }

  async function handleLogout() {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل الخروج",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut()
          router.replace("/")
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0) || "?"}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        <Text style={styles.role}>
          {profile?.role === "admin" ? "مدير" : profile?.role === "teacher" ? "معلم" : "طالب"}
        </Text>
      </View>

      <View style={styles.actions}>
        {profile?.role === "teacher" || profile?.role === "admin" ? (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>لوحة المعلم</Text>
          </TouchableOpacity>
        ) : null}
        {profile?.role === "admin" ? (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>لوحة الإدارة</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { alignItems: "center", paddingVertical: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#2563eb", justifyContent: "center", alignItems: "center", marginBottom: 12 },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  name: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  email: { fontSize: 16, color: "#64748b", marginBottom: 4 },
  role: { fontSize: 14, color: "#2563eb", fontWeight: "500" },
  actions: { gap: 12, marginTop: 24 },
  actionButton: { backgroundColor: "#f8fafc", padding: 16, borderRadius: 12, alignItems: "center" },
  actionText: { fontSize: 16, fontWeight: "500", color: "#2563eb" },
  logoutButton: { backgroundColor: "#fef2f2", padding: 16, borderRadius: 12, alignItems: "center" },
  logoutText: { fontSize: 16, fontWeight: "500", color: "#dc2626" },
})
