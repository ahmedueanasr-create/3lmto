import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native"
import { router } from "expo-router"
import { supabase } from "@/src/lib/supabase"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("خطأ", "يرجى إدخال البريد الإلكتروني وكلمة المرور")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) Alert.alert("خطأ", error.message)
    else router.replace("/(tabs)/dashboard")
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>مرحباً بعودتك</Text>

        <TextInput
          style={styles.input}
          placeholder="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تسجيل الدخول</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.link}>ليس لديك حساب؟ سجل الآن</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#64748b", marginBottom: 32, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, textAlign: "right" },
  button: { backgroundColor: "#2563eb", paddingVertical: 16, borderRadius: 12, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { color: "#2563eb", textAlign: "center", fontSize: 14 },
})
