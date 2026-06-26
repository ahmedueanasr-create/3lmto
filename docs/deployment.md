# دليل النشر على Hostinger Web Apps

## 1. إنشاء تطبيق Node.js في Hostinger

1. اذهب إلى Hostinger hPanel → Web Apps
2. اضغط "Create Web App"
3. اختر:
   - **Runtime:** Node.js 20
   - **Framework:** Next.js
   - **Region:** اختيار الأقرب لجمهورك (مصر/السعودية)

## 2. ربط المستودع

```bash
# ادفع الكود إلى GitHub
git add .
git commit -m "Initial MVP"
git branch -M main
git remote add origin https://github.com/your-org/3lmto.git
git push -u origin main
```

في Hostinger Web Apps:
1. اذهب إلى Settings → Build & Deploy
2. ربط حساب GitHub
3. اختر المستودع والفرع `main`
4. اختر "Auto Deploy"

## 3. إعدادات البناء

| الإعداد | القيمة |
|---------|--------|
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Publish Directory | `.next` |
| Node Version | 20 |
| Install Command | `npm ci` |

## 4. متغيرات البيئة

أضف في Hostinger → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx
PAYMOB_API_KEY=xxxx
PAYMOB_INTEGRATION_ID=xxxx
PAYMOB_IFRAME_ID=xxxx
PAYMOB_HMAC_SECRET=xxxx
NEXT_PUBLIC_BUNNY_LIBRARY_ID=xxxx
BUNNY_API_KEY=xxxx
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 5. تحسينات Hostinger

### Memory Optimization
- استخدم `experimental.serverComponentsExternalPackages` في next.config.ts
- قلل الصور غير المضغوطة
- فعّل `swcMinify` (افتراضي في Next.js 15)

### CDN
- استخدم Bunny.net للفيديو (خارج Hostinger)
- استخدم Supabase Storage للملفات والصور

### Database
- Supabase PostgreSQL (مجاني ومدار)
- المناطق المدعومة: USA, EU (اختر الأقرب)

## 6. التحقق من النشر

```bash
# تحقق من Health Check
curl https://your-domain.com/api/health

# تحقق من الصفحة الرئيسية
curl https://your-domain.com
```

## 7. التوسع والنمو

- **Hostinger Web Apps** مناسب للنمو حتى ~10k زائر/يوم
- للزيادة: ترقية خطة Hostinger أو الانتقال إلى VPS
- استخدم Supabase Connection Pooling للتوسع
