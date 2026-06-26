import Link from "next/link"
import { APP_NAME_ARABIC } from "@/lib/constants"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NavbarClient } from "./navbar-client"

export async function Navbar() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role, avatar_url, full_name")
      .eq("id", user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">{APP_NAME_ARABIC}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
              الدورات
            </Link>
            <Link href="/courses?level=beginner" className="text-sm font-medium hover:text-primary transition-colors">
              للمبتدئين
            </Link>
          </nav>
        </div>

        <NavbarClient user={user} profile={profile} />
      </div>
    </header>
  )
}
