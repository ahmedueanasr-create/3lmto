import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"

export default function LandingScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>علمتو</Text>
        <Text style={styles.subtitle}>منصة تعليمية عربية متكاملة</Text>
        <Text style={styles.description}>
          دورس مسجلة، اختبارات تفاعلية، وشهادات معتمدة. ابدأ رحلة التعلم اليوم.
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.primaryButtonText}>إنشاء حساب مجاني</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.secondaryButtonText}>تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flexGrow: 1, justifyContent: "center", padding: 24 },
  hero: { alignItems: "center" },
  title: { fontSize: 48, fontWeight: "800", color: "#0f172a", marginBottom: 8 },
  subtitle: { fontSize: 24, fontWeight: "600", color: "#2563eb", marginBottom: 16, textAlign: "center" },
  description: { fontSize: 16, color: "#64748b", textAlign: "center", marginBottom: 32, lineHeight: 24 },
  buttons: { width: "100%", gap: 12 },
  primaryButton: { backgroundColor: "#2563eb", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  secondaryButton: { borderWidth: 1, borderColor: "#2563eb", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  secondaryButtonText: { color: "#2563eb", fontSize: 18, fontWeight: "600" },
})
