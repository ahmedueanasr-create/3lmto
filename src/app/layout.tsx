import type { Metadata } from "next"
import { Noto_Kufi_Arabic } from "next/font/google"
import { Toaster } from "sonner"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const fontSans = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "علمتو - منصة تعليمية عربية",
    template: "%s | علمتو",
  },
  description: "منصة تعليمية عربية متكاملة لكل الأعمار - دورات مسجلة، اختبارات، وشهادات معتمدة",
  keywords: ["تعليم", "دورات", "كورسات", "تعليم عن بعد", "منصة تعليمية عربية"],
  openGraph: {
    title: "علمتو - منصة تعليمية عربية",
    description: "منصة تعليمية عربية متكاملة لكل الأعمار",
    locale: "ar_AR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
