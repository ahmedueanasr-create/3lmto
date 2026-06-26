export const APP_NAME = "3LMTO"
export const APP_NAME_ARABIC = "علمتو"
export const APP_DESCRIPTION = "منصة تعليمية عربية متكاملة لكل الأعمار"

export const SUBSCRIPTION_PRICES = {
  monthly: 199,
  yearly: 1999,
} as const

export const PAYMOB_CURRENCY = "EGP"

export const PLANS = [
  { id: "free", name: "مجاني", price: 0, features: ["5 دورات مجانية", "محتوى محدود", "بدون شهادات"] },
  { id: "monthly", name: "شهري", price: 199, features: ["جميع الدورات", "شهادات PDF", "محتوى غير محدود", "دعم فني"] },
  { id: "yearly", name: "سنوي", price: 1999, features: ["جميع الدورات", "شهادات PDF", "محتوى غير محدود", "دعم فني", "توفير 15%"] },
] as const

export const LEVELS = [
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" },
  { value: "all", label: "جميع المستويات" },
] as const
