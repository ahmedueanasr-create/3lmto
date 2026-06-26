"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, GraduationCap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getInitials } from "@/lib/utils"
import { useState } from "react"

interface NavbarClientProps {
  user: { id: string } | null
  profile: { role: string; avatar_url: string | null; full_name: string } | null
}

export function NavbarClient({ user, profile }: NavbarClientProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: "/courses", label: "الدورات" },
    { href: "/courses?level=beginner", label: "المبتدئين" },
    { href: "/pricing", label: "الباقات" },
  ]

  const dashboardLink = profile?.role === "admin"
    ? "/admin"
    : profile?.role === "teacher"
    ? "/dashboard/teacher"
    : "/dashboard/student"

  return (
    <>
      <div className="flex items-center gap-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>{profile ? getInitials(profile.full_name) : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>{profile?.full_name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(dashboardLink)}>
                <GraduationCap className="ml-2 h-4 w-4" />
                لوحة التحكم
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/student/my-courses")}>
                <User className="ml-2 h-4 w-4" />
                دوراتي
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => {
                const { signOut } = await import("@/lib/actions/auth")
                await signOut()
              }}>
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">تسجيل الدخول</Button>
            </Link>
            <Link href="/register">
              <Button>إنشاء حساب</Button>
            </Link>
          </div>
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
