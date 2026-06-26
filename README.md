# 3LMTO (علمتو) - منصة تعليمية عربية

منصة تعليمية عربية متكاملة لكل الأعمار (طلاب مدارس، جامعة، مهنيين). تقدم دورات مسجلة، اختبارات تفاعلية، وشهادات PDF. تدعم نموذج Freemium + اشتراك شهري + دفع لكل كورس.

## 🏗️ هيكل المشروع

```
3LMTO/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout مع RTL
│   │   ├── page.tsx                # الصفحة الرئيسية
│   │   ├── globals.css             # أنماط Tailwind + variables
│   │   ├── middleware.ts           # Supabase auth middleware
│   │   ├── (auth)/
│   │   │   ├── login/              # تسجيل الدخول
│   │   │   ├── register/           # إنشاء حساب
│   │   │   └── forgot-password/    # نسيت كلمة المرور
│   │   ├── courses/
│   │   │   ├── page.tsx            # تصفح الدورات
│   │   │   └── [courseId]/
│   │   │       ├── page.tsx        # صفحة الدورة
│   │   │       └── lessons/[lessonId]/  # مشاهدة الدرس
│   │   ├── dashboard/
│   │   │   ├── student/            # لوحة الطالب
│   │   │   └── teacher/            # لوحة المعلم
│   │   ├── admin/                  # لوحة الإدارة
│   │   ├── api/
│   │   │   ├── auth/callback/      # OAuth callback
│   │   │   ├── courses/            # REST API للدورات
│   │   │   ├── payments/paymob/    # Paymob checkout + webhook
│   │   │   ├── upload/             # رفع الملفات لـ Supabase Storage
│   │   │   └── webhooks/bunny/     # Webhooks من Bunny.net
│   │   └── pricing/                # صفحة الباقات
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── layout/                 # Navbar, Footer, Sidebar
│   │   ├── courses/                # CourseCard, LessonPlayer, Quiz
│   │   ├── auth/                   # LoginForm, RegisterForm
│   │   └── payments/               # SubscriptionButton
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Supabase browser client
│   │   │   ├── server.ts           # Supabase server client
│   │   │   ├── admin.ts            # Supabase service role client
│   │   │   └── middleware.ts       # Session middleware
│   │   ├── actions/
│   │   │   ├── auth.ts             # Server Actions للمصادقة
│   │   │   ├── courses.ts          # Server Actions للدورات
│   │   │   └── payments.ts         # Server Actions للدفع
│   │   ├── paymob.ts               # Paymob API integration
│   │   ├── bunny.ts                # Bunny.net integration
│   │   ├── utils.ts                # Utilities (cn, formatPrice, etc.)
│   │   └── constants.ts            # ثوابت التطبيق
│   ├── hooks/                      # React Hooks
│   └── types/                      # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_schema.sql          # قاعدة البيانات كاملة
├── public/
├── mobile/                         # React Native + Expo (قيد التطوير)
└── docs/
    └── deployment.md
```

## 🚀 التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| Next.js 15 (App Router) | Full-stack framework |
| TypeScript (strict) | Type safety |
| Tailwind CSS + shadcn/ui | واجهة المستخدم |
| Supabase (PostgreSQL) | قاعدة البيانات + Auth + Storage |
| Paymob | بوابة الدفع (Checkout + Webhooks) |
| Bunny.net | تشغيل الفيديو (CDN) |
| React Hook Form + Zod | إدارة النماذج والتحقق |

## ✅ المتطلبات الأساسية

- Node.js 20+
- npm أو yarn
- حساب Supabase (مجاني)
- حساب Paymob (لتفعيل الدفع)
- حساب Bunny.net (لتفعيل الفيديو)

## 📦 التثبيت والتشغيل المحلي

```bash
# 1. استنساخ المشروع
git clone https://github.com/your-org/3lmto.git
cd 3lmto

# 2. تثبيت الاعتماديات
npm install

# 3. نسخ متغيرات البيئة
cp .env.example .env.local

# 4. تعديل .env.local بمتغيراتك (انظر الجدول أدناه)

# 5. تشغيل قاعدة البيانات (Supabase)
# قم بتشغيل supabase/migrations/001_schema.sql في SQL Editor
# أو استخدم Supabase CLI:
supabase migration up

# 6. تشغيل المشروع محلياً
npm run dev
```

## 🔐 متغيرات البيئة

| المتغير | الشرح |
|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | المفتاح العام لـ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح الخدمة (للـ Admin) |
| `PAYMOB_API_KEY` | مفتاح API من Paymob |
| `PAYMOB_INTEGRATION_ID` | رقم التكامل من Paymob |
| `PAYMOB_IFRAME_ID` | رقم الـ Iframe من Paymob |
| `PAYMOB_HMAC_SECRET` | مفتاح HMAC للتحقق من Webhooks |
| `NEXT_PUBLIC_BUNNY_LIBRARY_ID` | معرف مكتبة الفيديو في Bunny |
| `BUNNY_API_KEY` | مفتاح API لـ Bunny |
| `NEXT_PUBLIC_APP_URL` | رابط التطبيق |

## 🌐 النشر على Hostinger Web Apps

### متطلبات Hostinger:
- خطة Hostinger Web Apps (Node.js)
- Node.js 20+
- Build command: `npm run build`
- Start command: `npm start`
- Output directory: `.next`

### خطوات النشر:

#### 1. تحضير المشروع
```bash
# تأكد من أن المتغيرات البيئية جاهزة في Hostinger Dashboard
# اذهب إلى  Hostinger Web Apps → Settings → Environment Variables
```

#### 2. ربط المستودع
- ارفع الكود إلى GitHub/GitLab
- في Hostinger Web Apps، اختر "Connect Repository"
- اختر المستودع والفرع الرئيسي

#### 3. إعدادات النشر في Hostinger

| الإعداد | القيمة |
|---------|--------|
| Runtime | Node.js 20 |
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Publish Directory | `.next` |
| Node Environment | production |

#### 4. متغيرات البيئة في Hostinger
أضف جميع المتغيرات من `.env.example` في إعدادات Hostinger Web Apps → Environment Variables.

#### 5. قاعدة البيانات
- استخدم Supabase PostgreSQL (مجاني)
- شغل ملف `supabase/migrations/001_schema.sql` في Supabase SQL Editor
- فعّل Authentication Providers (Email, Google, Apple, Facebook) من Supabase Dashboard

#### 6. الدفع (Paymob)
1. سجل في Paymob
2. أنشئ Integration (Iframe)
3. ضبط Webhook URL: `https://your-domain.com/api/payments/paymob/webhook`
4. أضف المتغيرات في `.env`

#### 7. الفيديو (Bunny.net)
1. أنشئ Library في Bunny Stream
2. ارفع الفيديوهات
3. أضف `NEXT_PUBLIC_BUNNY_LIBRARY_ID` و `BUNNY_API_KEY`

### تحسينات الأداء لـ Hostinger:
- استخدم Server Components قدر الإمكان (تم)
- قلل الاعتماديات الثقيلة
- استخدم Supabase Realtime عند الحاجة فقط
- فعّل Image Optimization في Next.js
- استخدم Static Generation للصفحات الثابتة

## 📱 الهيكل الكامل للمجلدات

```
src/
├── app/                           # Next.js App Router pages
│   ├── layout.tsx                 # Root layout مع RTL و Navbar
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Tailwind + CSS variables
│   ├── middleware.ts              # Auth middleware
│   ├── (auth)/                    # Auth pages group
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── courses/                   # Course pages
│   │   ├── page.tsx               # Browse with filters
│   │   └── [courseId]/
│   │       ├── page.tsx           # Course detail
│   │       └── lessons/[lessonId]/  # Lesson player
│   ├── dashboard/
│   │   ├── student/
│   │   │   ├── page.tsx           # Student dashboard
│   │   │   ├── my-courses/        # Enrolled courses
│   │   │   └── wishlist/          # Wishlist
│   │   └── teacher/
│   │       ├── page.tsx           # Teacher dashboard
│   │       ├── courses/
│   │       │   ├── new/           # Create course
│   │       │   └── [courseId]/edit/  # Edit course
│   │       ├── analytics/         # Analytics
│   │       └── quizzes/           # Manage quizzes
│   ├── admin/                     # Admin panel
│   │   ├── page.tsx
│   │   ├── users/
│   │   ├── courses/
│   │   └── payments/
│   ├── api/                       # API routes
│   │   ├── auth/callback/
│   │   ├── courses/
│   │   ├── payments/paymob/
│   │   │   ├── checkout/
│   │   │   └── webhook/
│   │   ├── upload/
│   │   └── webhooks/bunny/
│   └── pricing/
├── components/
│   ├── ui/                        # shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── sheet.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   ├── progress.tsx
│   │   └── separator.tsx
│   ├── layout/                    # Layout components
│   │   ├── navbar.tsx
│   │   ├── navbar-client.tsx
│   │   └── footer.tsx
│   ├── courses/                   # Course components
│   │   ├── course-card.tsx
│   │   ├── course-form.tsx
│   │   ├── course-list.tsx
│   │   ├── lesson-player.tsx
│   │   ├── enroll-button.tsx
│   │   └── review-section.tsx
│   ├── auth/                      # Auth components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   └── payments/                  # Payment components
│       └── subscription-button.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── admin.ts
│   │   └── middleware.ts
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── courses.ts
│   │   └── payments.ts
│   ├── paymob.ts
│   ├── bunny.ts
│   ├── utils.ts
│   └── constants.ts
├── hooks/
├── types/
│   └── database.ts
└── middleware.ts
```

## 📄 الترخيص

جميع الحقوق محفوظة
