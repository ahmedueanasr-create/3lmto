import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { router } from "expo-router"

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>الصفحة غير موجودة</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>العودة للرئيسية</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  button: { backgroundColor: "#2563eb", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
})
