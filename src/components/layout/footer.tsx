import Link from "next/link"
import { APP_NAME_ARABIC } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{APP_NAME_ARABIC}</h3>
            <p className="text-sm text-muted-foreground">
              منصة تعليمية عربية متكاملة لكل الأعمار. نقدم دورس مسجلة، اختبارات، وشهادات معتمدة.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">روابط سريعة</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/courses" className="hover:text-primary transition-colors">الدورات</Link>
              <Link href="/pricing" className="hover:text-primary transition-colors">الباقات</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">تصنيفات</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/courses?category=programming" className="hover:text-primary transition-colors">برمجة</Link>
              <Link href="/courses?category=design" className="hover:text-primary transition-colors">تصميم</Link>
              <Link href="/courses?category=business" className="hover:text-primary transition-colors">إدارة أعمال</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">تواصل معنا</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>support@3lmto.com</span>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {APP_NAME_ARABIC}
        </div>
      </div>
    </footer>
  )
}
