export type Role = "student" | "teacher" | "admin"

export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all"

export type ContentType = "video" | "article" | "quiz" | "resource"

export type PaymentMethod = "paymob" | "fawry" | "vodafone_cash"

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"

export type SubscriptionPlan = "monthly" | "yearly"

export type SubscriptionStatus = "active" | "cancelled" | "expired" | "pending"

export interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  phone: string | null
  role: Role
  bio: string | null
  headline: string | null
  social_links: Record<string, string>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name_ar: string
  name_en: string | null
  slug: string
  description: string | null
  icon: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Course {
  id: string
  teacher_id: string
  category_id: string | null
  title: string
  slug: string
  description: string | null
  short_description: string | null
  thumbnail_url: string | null
  trailer_video_url: string | null
  price: number
  is_free: boolean
  is_published: boolean
  is_featured: boolean
  level: CourseLevel
  language: string
  duration_hours: number
  total_lessons: number
  total_students: number
  avg_rating: number
  requirements: string[]
  outcomes: string[]
  tags: string[]
  created_at: string
  updated_at: string
  teacher?: Profile
  category?: Category
  modules?: Module[]
}

export interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  sort_order: number
  is_free: boolean
  created_at: string
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: ContentType
  video_url: string | null
  video_duration: number
  article_body: string | null
  resources: Resource[]
  is_free: boolean
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface Resource {
  title: string
  url: string
  type: "pdf" | "link" | "file"
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at: string | null
  progress: number
  is_completed: boolean
  expires_at: string | null
  course?: Course
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  is_completed: boolean
  watch_time_seconds: number
  completed_at: string | null
  created_at: string
}

export interface Quiz {
  id: string
  lesson_id: string
  title: string
  passing_score: number
  max_attempts: number
  created_at: string
  questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: "multiple_choice" | "true_false"
  options: string[]
  correct_option: number
  sort_order: number
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  answers: number[]
  is_passed: boolean
  attempted_at: string
}

export interface Certificate {
  id: string
  user_id: string
  course_id: string
  certificate_url: string | null
  issued_at: string
  certificate_number: string
}

export interface Review {
  id: string
  user_id: string
  course_id: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
  user?: Profile
}

export interface Payment {
  id: string
  user_id: string
  course_id: string | null
  subscription_id: string | null
  amount: number
  currency: string
  payment_method: PaymentMethod | null
  paymob_order_id: string | null
  paymob_transaction_id: string | null
  status: PaymentStatus
  invoice_url: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_type: SubscriptionPlan
  status: SubscriptionStatus
  paymob_order_id: string | null
  started_at: string
  expires_at: string
  cancelled_at: string | null
  created_at: string
}
