-- =====================================================
-- Comprehensive CMS Database Schema for Supabase
-- Serverless CMS API System
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
--
-- This schema includes:
-- - Blog system (posts, categories, tags)
-- - Portfolio projects
-- - Services
-- - Skills and skill categories
-- - Admin user management
-- - View tracking
-- - Monetization (subscriptions, payments, premium content)
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- BLOG SYSTEM TABLES
-- =====================================================

-- Blog Categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Blog Tags
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Blog Post Categories (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.blog_post_categories (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Blog Post Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Blog Post Views (Analytics)
CREATE TABLE IF NOT EXISTS public.blog_post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- PORTFOLIO TABLES
-- =====================================================

-- Portfolio Projects
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SERVICES TABLE
-- =====================================================

-- Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SKILLS TABLES
-- =====================================================

-- Skill Categories
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  category UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADMIN USER MANAGEMENT
-- =====================================================

-- Admin Users (extends auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- MONETIZATION TABLES
-- =====================================================

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'pro')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Subscriptions (detailed features and limits)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  features JSONB DEFAULT '{}',
  usage_limits JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Premium Content Access
CREATE TABLE IF NOT EXISTS public.premium_content_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog_post', 'feature')),
  content_id UUID NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Blog indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_premium ON public.blog_posts(is_premium);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON public.blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_post_id ON public.blog_post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_viewed_at ON public.blog_post_views(viewed_at DESC);

-- Portfolio indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured ON public.portfolio_projects(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_order_index ON public.portfolio_projects(order_index);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_order_index ON public.services(order_index);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order_index ON public.skills(order_index);
CREATE INDEX IF NOT EXISTS idx_skill_categories_order_index ON public.skill_categories(order_index);

-- Monetization indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_premium_content_access_user_id ON public.premium_content_access(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_content_access_content ON public.premium_content_access(content_type, content_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to increment view count atomically
CREATE OR REPLACE FUNCTION increment_blog_post_view_count(post_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id
  RETURNING view_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ language 'plpgsql';

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = user_id
  );
END;
$$ language 'plpgsql';

-- Function to check premium content access
CREATE OR REPLACE FUNCTION has_premium_access(user_id UUID, content_type TEXT, content_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_subscription BOOLEAN;
  subscription_status TEXT;
BEGIN
  -- Check if user has active premium/pro subscription
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = has_premium_access.user_id
      AND s.status = 'active'
      AND s.plan_type IN ('premium', 'pro')
  ) INTO has_subscription;
  
  IF has_subscription THEN
    RETURN true;
  END IF;
  
  -- Check for temporary access
  RETURN EXISTS (
    SELECT 1 FROM public.premium_content_access
    WHERE user_id = has_premium_access.user_id
      AND content_type = has_premium_access.content_type
      AND content_id = has_premium_access.content_id
      AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
    BEFORE UPDATE ON public.portfolio_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_content_access ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- BLOG POLICIES
-- =====================================================

-- Blog Posts: Public can read published posts (non-premium or with access)
CREATE POLICY "Public can read published blog posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (
  status = 'published' AND (
    is_premium = false OR
    (auth.uid() IS NOT NULL AND has_premium_access(auth.uid(), 'blog_post', id))
  )
);

-- Blog Posts: Admins can do everything
CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Blog Categories: Public read
CREATE POLICY "Public can read blog categories"
ON public.blog_categories
FOR SELECT
TO anon, authenticated
USING (true);

-- Blog Categories: Admin write
CREATE POLICY "Admins can manage blog categories"
ON public.blog_categories
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Blog Tags: Public read
CREATE POLICY "Public can read blog tags"
ON public.blog_tags
FOR SELECT
TO anon, authenticated
USING (true);

-- Blog Tags: Admin write
CREATE POLICY "Admins can manage blog tags"
ON public.blog_tags
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Blog Post Views: Public can insert, admins can read
CREATE POLICY "Public can track views"
ON public.blog_post_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read view analytics"
ON public.blog_post_views
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- =====================================================
-- PORTFOLIO POLICIES
-- =====================================================

-- Portfolio: Public read, Admin write
CREATE POLICY "Public can read portfolio projects"
ON public.portfolio_projects
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage portfolio projects"
ON public.portfolio_projects
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- =====================================================
-- SERVICES POLICIES
-- =====================================================

-- Services: Public read, Admin write
CREATE POLICY "Public can read services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- =====================================================
-- SKILLS POLICIES
-- =====================================================

-- Skills: Public read, Admin write
CREATE POLICY "Public can read skills"
ON public.skills
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage skills"
ON public.skills
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Skill Categories: Public read, Admin write
CREATE POLICY "Public can read skill categories"
ON public.skill_categories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage skill categories"
ON public.skill_categories
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- =====================================================
-- ADMIN POLICIES
-- =====================================================

-- Admin Users: Only admins can read, super_admins can manage
CREATE POLICY "Admins can read admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- =====================================================
-- MONETIZATION POLICIES
-- =====================================================

-- Subscriptions: Users can read their own, admins can read all
CREATE POLICY "Users can read own subscription"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Users can create own subscription"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR is_admin(auth.uid()))
WITH CHECK (user_id = auth.uid() OR is_admin(auth.uid()));

-- User Subscriptions: Users can read their own, admins can read all
CREATE POLICY "Users can read own subscription details"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Users can create own subscription details"
ON public.user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription details"
ON public.user_subscriptions
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR is_admin(auth.uid()))
WITH CHECK (user_id = auth.uid() OR is_admin(auth.uid()));

-- Payments: Users can read their own, admins can read all
CREATE POLICY "Users can read own payments"
ON public.payments
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "System can create payments"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Premium Content Access: Users can read their own, admins can read all
CREATE POLICY "Users can read own premium access"
ON public.premium_content_access
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "System can create premium access"
ON public.premium_content_access
FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Blog grants
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT SELECT ON public.blog_tags TO anon, authenticated;
GRANT INSERT ON public.blog_post_views TO anon, authenticated;
GRANT ALL ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_tags TO authenticated;

-- Portfolio grants
GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT ALL ON public.portfolio_projects TO authenticated;

-- Services grants
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO authenticated;

-- Skills grants
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT SELECT ON public.skill_categories TO anon, authenticated;
GRANT ALL ON public.skills TO authenticated;
GRANT ALL ON public.skill_categories TO authenticated;

-- Monetization grants
GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_subscriptions TO authenticated;
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT SELECT, INSERT ON public.premium_content_access TO authenticated;

-- Function grants
GRANT EXECUTE ON FUNCTION increment_blog_post_view_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_premium_access(UUID, TEXT, UUID) TO authenticated;





