export type Role = "student" | "teacher" | "admin"
export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all"
export type ContentType = "video" | "article" | "quiz" | "resource"

export interface Course {
  id: string
  teacher_id: string
  category_id: string | null
  title: string
  slug: string
  description: string | null
  short_description: string | null
  thumbnail_url: string | null
  price: number
  is_free: boolean
  is_published: boolean
  is_featured: boolean
  level: CourseLevel
  duration_hours: number
  total_lessons: number
  total_students: number
  avg_rating: number
  requirements: string[]
  outcomes: string[]
  tags: string[]
  created_at: string
  teacher?: { full_name: string; avatar_url: string | null }
  category?: { name_ar: string }
  modules?: Module[]
}

export interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  sort_order: number
  is_free: boolean
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
  is_free: boolean
  is_published: boolean
  sort_order: number
}

export interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  role: Role
  headline: string | null
}

export interface Enrollment {
  id: string
  course_id: string
  enrolled_at: string
  progress: number
  is_completed: boolean
  course?: Course
}
