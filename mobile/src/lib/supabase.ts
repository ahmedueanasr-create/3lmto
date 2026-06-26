import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://naumiqwuhincmgyfmwtf.supabase.co"
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdW1pcXd1aGluY21neWZtd3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTA3NDIsImV4cCI6MjA5ODA2Njc0Mn0.kyma4p-0asYJKfzA5bq605a0181oqp39KxFVpaXTLLw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
