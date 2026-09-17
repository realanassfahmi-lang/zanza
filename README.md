# Zanza — دليل النشر السريع

## الملفات
- `index.html` — الواجهة (الموقع اللي كيشوفوه الزوار)
- `api/users.js` — وظيفة سيرفر للتسجيل/الدخول/تحديث الحساب
- `api/listings.js` — وظيفة سيرفر لنشر/تصفح/حذف الإعلانات
- `package.json` — يقول لـ Vercel أي مكتبة خاصو يثبت (@supabase/supabase-js)

## قبل النشر: Environment Variables فـ Vercel
فإعدادات المشروع فـ Vercel (Settings → Environment Variables)، زيد:

| الاسم | القيمة |
|---|---|
| `SUPABASE_URL` | `https://tukoizxdblpvksxkkyrp.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | (المفتاح السري ديال Supabase — خاصو يبقى هنا فقط، ماشي فالكود) |
| `ADMIN_PHONE` | `0711826819` |

⚠️ `SUPABASE_SERVICE_ROLE_KEY` سري 100% — تحطهاش فأي ملف كود، غير هنا فـ Vercel Environment Variables.

## خطوات النشر
1. دير حساب فـ github.com، دير repository جديد
2. حمل هاد الملفات كاملة (بما فيها مجلد `api/`) لـ GitHub
3. دخل لـ vercel.com، اربط حسابك بـ GitHub
4. "Import Project" → اختار الـ repository ديال Zanza
5. زيد الـ 3 Environment Variables اللي فوق
6. اضغط Deploy

بعد دقيقة، الموقع يولي حي على رابط بحال `zanza-xxx.vercel.app`.
