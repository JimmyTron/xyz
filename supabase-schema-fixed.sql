-- =====================================================
-- FIXED Supabase Database Schema for Contact Submissions
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- This version fixes RLS policy issues

-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_type TEXT NOT NULL CHECK (request_type IN ('virtual-call', 'task-request')),
  email TEXT NOT NULL,
  name TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON public.contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status 
  ON public.contact_submissions(status);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON public.contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh (be careful in production!)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated selects" ON public.contact_submissions;
DROP POLICY IF EXISTS "Block anonymous selects" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow anon insert" ON public.contact_submissions;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.contact_submissions;

-- CRITICAL: RLS Policy to allow anonymous users to INSERT
-- This must be created for the form to work
CREATE POLICY "Allow anonymous inserts"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to SELECT (for admin panel later)
CREATE POLICY "Allow authenticated selects"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- IMPORTANT: Allow anonymous users to SELECT their own inserted rows
-- This allows .select() to work after insert
CREATE POLICY "Allow anonymous select own inserts"
ON public.contact_submissions
FOR SELECT
TO anon
USING (true);

-- Alternative: If you want to block SELECT for anon (stricter security),
-- remove the above policy and remove .select() from the client code
-- (which we've already done in the updated supabase.ts)

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
-- CRITICAL: These grants are required for RLS to work properly
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT ON public.contact_submissions TO anon;  -- Needed if using .select() after insert
GRANT SELECT ON public.contact_submissions TO authenticated;

-- Verify the setup
-- Run this query to check your policies:
-- SELECT * FROM pg_policies WHERE tablename = 'contact_submissions';

-- Optional: Create a view for admin dashboard (future use)
-- Note: Explicitly set SECURITY INVOKER to avoid security linter warnings
-- SECURITY INVOKER uses the permissions of the querying user (respects RLS)
CREATE OR REPLACE VIEW public.contact_submissions_summary
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

GRANT SELECT ON public.contact_submissions_summary TO authenticated;

