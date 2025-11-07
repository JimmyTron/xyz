-- =====================================================
-- FIX: Remove SECURITY DEFINER from view
-- =====================================================
-- This fixes the Supabase linter error about SECURITY DEFINER views
-- Run this in Supabase SQL Editor

-- Drop the existing view (it has SECURITY DEFINER which is a security risk)
DROP VIEW IF EXISTS public.contact_submissions_summary;

-- Recreate the view WITHOUT SECURITY DEFINER
-- SECURITY INVOKER (the default) uses the permissions of the querying user
-- This respects RLS policies properly
CREATE VIEW public.contact_submissions_summary
WITH (security_invoker = true) AS
SELECT 
  id,
  request_type,
  email,
  name,
  LEFT(message, 100) as message_preview,
  status,
  created_at,
  updated_at
FROM public.contact_submissions
ORDER BY created_at DESC;

-- Grant SELECT to authenticated users (for future admin panel)
GRANT SELECT ON public.contact_submissions_summary TO authenticated;

-- Verify the view is now SECURITY INVOKER
-- Run this query to check:
-- SELECT viewname, viewowner, definition 
-- FROM pg_views 
-- WHERE viewname = 'contact_submissions_summary';

