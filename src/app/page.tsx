import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/courses/course-card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { APP_NAME_ARABIC } from "@/lib/constants"

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  const { data: courses } = await supabase
    .from("courses")
    .select("*, teacher:profiles(full_name, avatar_url)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6)

  const { data: featured } = await supabase
    .from("courses")
    .select("*, teacher:profiles(full_name, avatar_url)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              تعلم كل شيء مع
              <span className="text-primary block mt-2">{APP_NAME_ARABIC}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              منصة تعليمية عربية متكاملة. دورس مسجلة، اختبارات تفاعلية، وشهادات معتمدة. ابدأ رحلة التعلم اليوم.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/courses">
                <Button size="lg" className="text-base">تصفح الدورات</Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="text-base">ابدأ مجاناً</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featured && featured.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-2">دورات مميزة</h2>
            <p className="text-muted-foreground mb-8">اختر من أفضل الدورات التي يقدمها نخبة المدربين</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Courses */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">أحدث الدورات</h2>
              <p className="text-muted-foreground">تصفح أحدث الدورات المضافة للمنصة</p>
            </div>
            <Link href="/courses">
              <Button variant="outline">عرض الكل</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">لماذا {APP_NAME_ARABIC}؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "محتوى عربي ١٠٠٪", desc: "جميع المحتويات باللغة العربية الفصحى المناسبة" },
              { title: "شهادات معتمدة", desc: "احصل على شهادة PDF بعد إكمال كل دورة" },
              { title: "تعلم في أي وقت", desc: "الدورس مسجلة ومتاحة 24/7 حسب وقتك" },
            ].map((f) => (
              <div key={f.title} className="text-center p-6">
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">هل أنت مستعد لبدء رحلة التعلم؟</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            انضم إلى آلاف المتعلمين وابدأ في تطوير مهاراتك اليوم
          </p>
          <Link href="/register">
            <Button size="lg">إنشاء حساب مجاني</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
