-- =============================================
-- 3LMTO - Supabase Schema (Full RTL Support)
-- =============================================

-- Enable UUID gen & pgcrypto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== PROFILES ====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  bio TEXT,
  headline TEXT,
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ==================== CATEGORIES ====================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ==================== COURSES ====================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  trailer_video_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  language TEXT DEFAULT 'ar',
  duration_hours INT DEFAULT 0,
  total_lessons INT DEFAULT 0,
  total_students INT DEFAULT 0,
  avg_rating DECIMAL(2,1) DEFAULT 0,
  requirements TEXT[] DEFAULT '{}',
  outcomes TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_published ON courses(is_published) WHERE is_published = true;
CREATE INDEX idx_courses_free ON courses(is_free) WHERE is_free = true;
CREATE INDEX idx_courses_rating ON courses(avg_rating DESC);
CREATE INDEX idx_courses_created ON courses(created_at DESC);

-- ==================== MODULES ====================
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, sort_order);

-- ==================== LESSONS ====================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'article', 'quiz', 'resource')),
  video_url TEXT,
  video_duration INT DEFAULT 0,
  article_body TEXT,
  resources JSONB DEFAULT '[]',
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, sort_order);

-- ==================== ENROLLMENTS ====================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress DECIMAL(5,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- ==================== LESSON PROGRESS ====================
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  watch_time_seconds INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);

-- ==================== QUIZZES ====================
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  passing_score INT DEFAULT 70,
  max_attempts INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);

-- ==================== QUIZ QUESTIONS ====================
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false')),
  options JSONB NOT NULL DEFAULT '[]',
  correct_option INT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);

-- ==================== QUIZ ATTEMPTS ====================
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]',
  is_passed BOOLEAN DEFAULT false,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- ==================== CERTIFICATES ====================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT now(),
  certificate_number TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::text,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_certificates_user ON certificates(user_id);

-- ==================== REVIEWS ====================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ==================== WISHLIST ====================
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- ==================== SUBSCRIPTIONS ====================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  paymob_order_id TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ==================== PAYMENTS ====================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EGP',
  payment_method TEXT CHECK (payment_method IN ('paymob', 'fawry', 'vodafone_cash')),
  paymob_order_id TEXT,
  paymob_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_course ON payments(course_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ==================== COUPONS ====================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INT DEFAULT 100,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== RLS POLICIES ====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read any profile, update only own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Courses: anyone can read published, teachers manage own
CREATE POLICY "courses_select_published" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "courses_select_own" ON courses FOR SELECT USING (auth.uid() = teacher_id);
CREATE POLICY "courses_insert" ON courses FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "courses_update" ON courses FOR UPDATE USING (auth.uid() = teacher_id);
CREATE POLICY "courses_delete" ON courses FOR DELETE USING (auth.uid() = teacher_id);

-- Modules: read if course published or own
CREATE POLICY "modules_select" ON modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM courses WHERE id = modules.course_id AND (is_published = true OR teacher_id = auth.uid()))
);
CREATE POLICY "modules_insert" ON modules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM courses WHERE id = modules.course_id AND teacher_id = auth.uid())
);
CREATE POLICY "modules_update" ON modules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM courses WHERE id = modules.course_id AND teacher_id = auth.uid())
);
CREATE POLICY "modules_delete" ON modules FOR DELETE USING (
  EXISTS (SELECT 1 FROM courses WHERE id = modules.course_id AND teacher_id = auth.uid())
);

-- Enrollments: own only
CREATE POLICY "enrollments_select" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "enrollments_insert" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews: anyone read, own insert/update
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Wishlist: own only
CREATE POLICY "wishlist_select" ON wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert" ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_delete" ON wishlist FOR DELETE USING (auth.uid() = user_id);

-- Payments: own only
CREATE POLICY "payments_select" ON payments FOR SELECT USING (auth.uid() = user_id);

-- ==================== TRIGGERS ====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
